import moment from "moment-jalaali";
import React, { useEffect, useState } from "react";
import { Container, Col, Form, Row, Button, Spinner } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getRequest, patchRequest, postRequest, setPersianNumberToEnglish } from "../services/PlineTools";

const InvoiceForm = () => {
  const [state, setState] = useState({
    id: null,
    id_costumer: null,
    name_costumer: null,
    id_service: 1,
    refer_code: "",
    price: "",
    mobile: "",
    date: moment().format("jYYYY/jMM/jDD"),
    time: moment().format("HH:mm"),
    with_tax: 1,
  });
  const [isload, setIsload] = useState(false);
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
    setIsload(true);
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
        setIsload(false);
        if (data.data.length > 0) {
          data.data.forEach((value) => {
            toast.info(value.message);
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
        setIsload(false);
      });
  };

  const findName = () => {
    if (customers.length > 0) {
      return customers.find((c) => {
        return c.id == state.id_costumer;
      })?.name;
    }
    return "";
  };

  useEffect(() => {
    load();
  }, []);

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
            {params.id == null && (
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>{"نام مشتری"}</Form.Label>
                <Typeahead
                  id="name"
                  labelKey="name"
                  onChange={(e) => {
                    let tmp = { ...state };
                    if (e.length === 0) {
                      tmp.id_costumer = null;
                    } else {
                      tmp.id_costumer = e[0].id;
                    }
                    setState(tmp);
                  }}
                  onInputChange={(e) => {
                    let tmp = { ...state };
                    tmp.name_costumer = e;
                    setState(tmp);
                  }}
                  options={customers}
                  placeholder="نام شخص/شرکت"
                  emptyLabel="نام شخص/شرکت مشابه یافت نشد"
                  autoComplete={"off"}
                />
              </Form.Group>
            )}
            {params.id != null && (
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>{"نام مشتری"}</Form.Label>
                <Form.Control readOnly defaultValue={findName()} />
              </Form.Group>
            )}
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>{"شرح خدمت"}</Form.Label>
              <select
                value={state.id_service}
                className={"form-select"}
                onChange={(e) => {
                  let tmp = { ...state };
                  tmp.id_service = e.target.value;
                  setState(tmp);
                }}
              >
                {allServices.map((item) => {
                  return (
                    <option key={"opt" + item.id} value={item.id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="refer_code">
              <Form.Label>{"کد معرف"}</Form.Label>
              <Form.Control
                style={{ direction: "ltr" }}
                type="text"
                required={false}
                onChange={(e) => {
                  let tmp = { ...state };
                  tmp.refer_code = e.target.value;
                  setState(tmp);
                }}
                defaultValue={state.refer_code}
                autoComplete={"off"}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="price">
              <Form.Label>{"مبلغ پیش فاکتور (ریال)"}</Form.Label>
              <Form.Control
                type="number"
                required={true}
                onChange={(e) => {
                  let tmp = { ...state };
                  tmp.price = setPersianNumberToEnglish(e.target.value);
                  setState(tmp);
                }}
                min={0}
                max={999999999999}
                defaultValue={state.price}
                autoComplete={"off"}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="refer_code">
              <Form.Label>{"شماره موبایل"}</Form.Label>
              <Form.Control
                style={{ direction: "ltr" }}
                type="text"
                required={true}
                onChange={(e) => {
                  let tmp = { ...state };
                  tmp.mobile = setPersianNumberToEnglish(e.target.value);
                  setState(tmp);
                }}
                defaultValue={state.mobile}
                minLength={11}
                maxLength={11}
                autoComplete={"off"}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="with_tax">
              <Form.Label>{" نحوه محاسبات"}</Form.Label>
              <select
                value={state.with_tax}
                className={"form-select"}
                onChange={(e) => {
                  setState({ ...state, with_tax: e.target.value });
                }}
              >
                {[
                  { id: 1, name: "به رقم پیش فاکتور ارزش افزوده اضافه گردد" },
                  { id: 0, name: "به رقم پیش فاکتور ارزش افزوده اضافه نگردد" },
                ].map((item) => {
                  return (
                    <option key={"opt" + item.id} value={item.id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Button variant="primary" type="submit" disabled={isload}>
              ذخیره{" "}
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                hidden={!isload}
              />
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

export default InvoiceForm;
