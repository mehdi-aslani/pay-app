import moment from "moment-jalaali";
import React, { useEffect, useState } from "react";
import { Container, Col, Form, Row, Button } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getRequest, patchRequest, postRequest } from "../services/PlineTools";

const CustomerForm = () => {
  const [state, setState] = useState({
    id: null,
    id_costumer: null,
    id_service: null,
    refer_code: "",
    price: "",
    mobile: "",
    date: moment().format("jYYYY/jMM/jDD"),
    time: moment().format("HH:mm"),
    reg_user_id: null,
    link: "",
  });
  const [allServices, setAllServices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();
  const params = useParams();

  const load = () => {
    let id = params.id;
    const url = "/invoices/" + id;
    getRequest("/services/get-services").then((data) => {
      setAllServices(data.data["services"]);
      setCustomers(data.data["customers"]);
      if (id !== undefined) {
        getRequest(url)
          .then((result) => {
            setState(result.data);
          })
          .catch(() => {
            toast.error("دریافت اطلاعات با خطا مواجح شد.");
          });
      }
    });
  };

  const saveData = (e) => {
    e.preventDefault();
    let req = null;
    if (params.id === undefined) {
      req = postRequest("/invoices", state);
    } else {
      req = patchRequest("/invoices/" + params.id, state);
    }

    req
      .then((data) => {
        if (data.length > 0) {
          data.forEach((value) => {
            toast.error(value.message);
          });
        }
        toast.success("اطلاعات با موفقیت ثبت شد");
        navigate("/invoices/index");
      })
      .catch((error) => {
        if (error.response.status === 422) {
          error.response.data.forEach((value) => {
            toast.info(value.message);
          });
        }
      });
  };

  useEffect(() => {
    load();
  }, []);

  const formatResult = (item) => {
    return (
      <>
        <span style={{ display: "block", textAlign: "right" }}>
          id: {item.id}
        </span>
        <span style={{ display: "block", textAlign: "right" }}>
          name: {item.name}
        </span>
      </>
    );
  };

  return (
    <Container>
      <h3>{"پیش فاکتور " + (state.id ? "شماره " + state.id : "")}</h3>
      <hr />
      <Form onSubmit={saveData}>
        <Row>
          <Col md={10}></Col>
          <Col md={2}>
            <label>تاریخ:&nbsp;</label>
            <label style={{ direction: "rtl" }}>{state.date}</label>
          </Col>
        </Row>
        <Row>
          <Col md={10}></Col>
          <Col md={2}>
            <label>ساعت:&nbsp;</label>
            <label style={{ direction: "rtl" }}>{state.time}</label>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="se">
              <Form.Label>{"طرف مقابل"}</Form.Label>
              <Typeahead
                id="basic-typeahead-single"
                labelKey="name"
                // onChange={() => {}}
                options={customers}
                placeholder="نام شرکت"
                // selected={singleSelections}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>{"نام سرویس"}</Form.Label>
              <select value={() => {}}>
                {allServices.map((item) => {
                  return <option value={item.id}>{item.name}</option>;
                })}
              </select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Button variant="primary" type="submit">
              ذخیره
            </Button>{" "}
            <Button
              variant="danger"
              onClick={() => {
                navigate("/invoices/index");
              }}
            >
              انصراف
            </Button>{" "}
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default CustomerForm;
