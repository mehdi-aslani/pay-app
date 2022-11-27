import React, { useEffect, useState } from "react";
import { Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getRequest,
  numberWithCommas,
  patchRequest,
  setPersianNumberToEnglish,
} from "../services/PlineTools";

const Pay = () => {
  const params = useParams();
  const [isload, setIsload] = useState(false);
  const [state, setState] = useState({
    id: null,
    name: "",
    economicalـnumber: null,
    nuique_id: null,
    post_code: null,
    city: null,
    province: null,
    address: null,
    tel_fax: null,
    mobile: null,
    is_personal: 0,
  });
  const [inv, setInv] = useState({
    price: 0,
    service_name: "",
    pay_arzesh_afzodeh: 0,
    id: 0,
    with_tax: 0,
    owner: "",
    status: 0,
  });

  const load = () => {
    let id = params.id;
    if (id !== undefined) {
      const url = "/invoices/pay-info?id=" + id;
      getRequest(url)
        .then((result) => {
          setState(result.data["custom"]);
          setInv(result.data["inv"]);
        })
        .catch(() => {
          toast.error(
            "پیش فاکتوری جهت پرداخت یافت نشد. لطفا با واحد پشتیبانی تماس بگیرید"
          );
        });
    }
  };

  const saveData = (e) => {
    e.preventDefault();
    setIsload(true);

    let tmp = { ...state };
    tmp.link = params.id;
    tmp.owner = inv.owner;
    patchRequest("/customers/save?id=" + state.id, tmp)
      .then((data) => {
        const result = data.data;
        if (result.error) {
          toast.error(result.message);
        } else {
          toast.success(
            "اطلاعات با موفقیت ثبت شد. لطفا کمی صبر کنید تا به درگاه بانک متصل شوید",
            { autoClose: false, position: "top-center" }
          );
          window.location = result.redirect;
        }
        setIsload(false);
      })
      .catch((error) => {
        if (error.response?.status === 422) {
          error.response.data.forEach((value) => {
            toast.info(value.message);
          });
        }
        setIsload(false);
      });
  };

  useEffect(() => {
    load();
  }, []);
  return (
    <>
      <Row>
        <Col style={{ textAlign: "center" }} className="mt-3">
          <Alert key={"dark"} variant={"dark"}>
            شرکت بهینه کاوان کیفیت
          </Alert>
        </Col>
      </Row>
      <Row>
        <Col>
          {inv.status === 1 && (
            <Alert key={"success"} variant={"success"}>
              این پیش فاکتور قبلا پرداخت شده است
            </Alert>
          )}
        </Col>
      </Row>
      {state.id != null && (
        <Form onSubmit={saveData}>
          <Row>
            <Col md={12}>
              <label className={"mt-3"}>
                پیش فاکتور شماره: <b>{inv.id}</b>
              </label>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col md={12}>
              <label className={"mt-1"}>
                خدمت ارائه شده: <b>{inv.service_name}</b>
              </label>
            </Col>
          </Row>
          <Row>
            <Col>
              <label className={"mt-2"}>
                نام شخص حقیقی/حقوقی: <b>{state.name}</b>
              </label>
            </Col>
          </Row>
          <hr />
          <div className={"mt-3"}></div>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="is_personal">
                <Form.Label>{"ماهیت مشتری"}</Form.Label>
                <select
                  value={state.is_personal}
                  className={"form-select"}
                  onChange={(e) => {
                    setState({ ...state, is_personal: e.target.value });
                  }}
                >
                  {[
                    { id: 0, name: "حقوقی" },
                    { id: 1, name: "حقیقی" },
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
            <Col>
              <Form.Group className="mb-3" controlId="owner">
                <Form.Label>{"نام خدمت گیرنده/نام نمایندگی"}</Form.Label>
                <Form.Control
                  type="text"
                  required={true}
                  onChange={(e) => {
                    setInv({ ...inv, owner: e.target.value });
                  }}
                  defaultValue={inv.owner}
                  autoComplete={"off"}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="economicalـnumber">
                <Form.Label>{"کد اقتصادی"}</Form.Label>
                <Form.Control
                  style={{ direction: "ltr" }}
                  type="text"
                  required={false}
                  onChange={(e) => {
                    let tmp = { ...state };
                    tmp.economicalـnumber = setPersianNumberToEnglish(
                      e.target.value
                    );
                    setState(tmp);
                  }}
                  defaultValue={state.economicalـnumber}
                  autoComplete={"off"}
                  maxLength={20}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="nuique_id">
                <Form.Label>
                  {state.is_personal == 1 ? "کد ملی" : "شناسه ملی"}
                </Form.Label>
                <Form.Control
                  style={{ direction: "ltr" }}
                  type="text"
                  required={false}
                  onChange={(e) => {
                    let tmp = { ...state };
                    tmp.nuique_id = setPersianNumberToEnglish(e.target.value);
                    setState(tmp);
                  }}
                  defaultValue={state.nuique_id}
                  autoComplete={"off"}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="province">
                <Form.Label>{"استان"}</Form.Label>
                <Form.Control
                  type="text"
                  required={true}
                  onChange={(e) => {
                    let tmp = { ...state };
                    tmp.province = e.target.value;
                    setState(tmp);
                  }}
                  defaultValue={state.province}
                  autoComplete={"off"}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="city">
                <Form.Label>{"شهر"}</Form.Label>
                <Form.Control
                  type="text"
                  required={true}
                  onChange={(e) => {
                    let tmp = { ...state };
                    tmp.city = e.target.value;
                    setState(tmp);
                  }}
                  defaultValue={state.city}
                  autoComplete={"off"}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="post_code">
                <Form.Label>{"کد پستی"}</Form.Label>
                <Form.Control
                  style={{ direction: "ltr" }}
                  type="text"
                  required={true}
                  onChange={(e) => {
                    let tmp = { ...state };
                    tmp.post_code = setPersianNumberToEnglish(e.target.value);
                    setState(tmp);
                  }}
                  defaultValue={state.post_code}
                  autoComplete={"off"}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="tel_fax">
                <Form.Label>{"فکس/تلفن"}</Form.Label>
                <Form.Control
                  type="text"
                  style={{ direction: "ltr" }}
                  required={true}
                  onChange={(e) => {
                    let tmp = { ...state };
                    tmp.tel_fax = setPersianNumberToEnglish(e.target.value);
                    setState(tmp);
                  }}
                  defaultValue={state.tel_fax}
                  autoComplete={"off"}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="address">
                <Form.Label>{"آدرس"}</Form.Label>
                <Form.Control
                  type="text"
                  required={true}
                  onChange={(e) => {
                    let tmp = { ...state };
                    tmp.address = e.target.value;
                    setState(tmp);
                  }}
                  defaultValue={state.address}
                  autoComplete={"off"}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="mobile">
                <Form.Label>{"موبایل"}</Form.Label>
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
                  autoComplete={"off"}
                  maxLength={11}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <ul>
                <li>
                  <label className="mt-2">
                    مبلغ پیش فاکتور: <b>{numberWithCommas(inv.price)}</b> ریال
                  </label>
                </li>
                <li>
                  <label className="mt-2">
                    مبلغ ارزش افزوده:{" "}
                    <b>{numberWithCommas(inv.pay_arzesh_afzodeh)}</b> ریال
                    {inv.with_tax == 0 && (
                      <>
                        &nbsp;
                        <lable style={{ color: "red" }}>
                          (پیش فاکتور بدون ارزش افزوده صادر شده است)
                        </lable>
                      </>
                    )}
                  </label>
                </li>
                <li>
                  <label className="mt-2">
                    مبلغ قابل پرداخت:{" "}
                    <b>
                      {numberWithCommas(inv.price + inv.pay_arzesh_afzodeh)}
                    </b>{" "}
                    ریال
                  </label>
                </li>
              </ul>
            </Col>
          </Row>
          <hr />
          {inv.status !== 1 && (
            <Row>
              <Col className="mb-3" md={12}>
                <Button variant="primary" type="submit" disabled={isload}>
                  تایید اطلاعات و پرداخت{" "}
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    hidden={!isload}
                  />
                </Button>{" "}
              </Col>
            </Row>
          )}
        </Form>
      )}
    </>
  );
};

export default Pay;
