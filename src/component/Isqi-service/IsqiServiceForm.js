import React, { useEffect, useState } from 'react'
import { Container, Col, Form, Row, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getRequest, patchRequest, postRequest } from '../services/PlineTools';

const IsqiServiceForm = () => {
  const [state, setState] = useState({
    name: "",
    enable: true,
    id: null,
  });
  const navigate = useNavigate();
  const params = useParams();

  const load = () => {
    let id = params.id;
    if (id !== undefined) {
      const url = "/services/" + id;
      getRequest(url)
        .then((result) => {
          setState(result.data);
        })
        .catch(() => {
          toast.error("دریافت اطلاعات با خطا مواجح شد.");
        });
    }
  };

  const saveData = (e) => {
    e.preventDefault();
    let req = null;
    if (params.id === undefined) {
      req = postRequest("/services", state);
    } else {
      req = patchRequest("/services/" + params.id, state);
    }

    req
      .then((data) => {
        if (data.length > 0) {
          data.forEach((value) => {
            toast.error(value.message);
          });
        }
        toast.success("اطلاعات با موفقیت ثبت شد");
        navigate("/services/index");
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

  return (
    <Container>
      <h3>سرویس</h3>
      <hr />
      <Form onSubmit={saveData}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="enable">
              <Form.Check
                label={"فعال/غیرفعال"}
                checked={state.enable}
                onChange={(e) => {
                  let tmp = { ...state };
                  tmp.enable = e.target.checked;
                  setState(tmp);
                }}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>{"نام سرویس"}</Form.Label>
              <Form.Control
                type="text"
                required={true}
                onChange={(e) => {
                  setState({ ...state, name: e.target.value });
                }}
                defaultValue={state.name}
              />
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
                navigate("/services/index");
              }}
            >
              انصراف
            </Button>{" "}
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default IsqiServiceForm