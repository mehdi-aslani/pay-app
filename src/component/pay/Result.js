import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Alert, Button, Col, ListGroup, Row, Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getRequest } from "../services/PlineTools";

const Result = () => {
  const [state, setState] = useState({
    id: null,
    t_date: "",
    t_time: "",
    message: "",
    token: "",
    status: null,
    order_id: "",
    terminal_no: "",
    amount: "",
    rrn: "",
    card_number_masked: null,
    id_costumer: 1,
    id_service: 1,
    refer_code: "",
    price: 0,
    mobile: "",
    inv_date: "",
    inv_time: "",
    reg_user_id: 0,
    with_tax: 0,
    link: "",
    costumer_name: "",
    service_name: "",
    reg_name: "",
    inv_id: 0
  });
  const params = useParams();

  const load = () => {
    let id = params.id;
    if (id !== undefined) {
      const url = "/tas/get-tas?id=" + id;
      getRequest(url)
        .then((result) => {
          setState(result.data);
        })
        .catch(() => {
          toast.error("دریافت اطلاعات با خطا مواجح شد.");
        });
    }
  };

  useEffect(() => {
    load();
  }, []);

  const print = () => {
    let mywindow = window.open("", "PRINT", "height=748,width=1024");
    mywindow.document.write(
      "<html><head><title>" + document.title + "</title>"
    );
    mywindow.document.write('</head><body style="direction:rtl;">');
    mywindow.document.write("<h1>" + document.title + "</h1>");
    mywindow.document.write(document.getElementById("divcontents").innerHTML);
    mywindow.document.write("</body></html>");
    mywindow.document.close();
    mywindow.focus();
    mywindow.print();
    mywindow.close();
    return true;
  };

  const param = useParams();
  return (
    <div id="divcontents">
      <Row>
        <Col md={8} className={"offset-2"}>
          <Row>
            <Col style={{ textAlign: "center" }} className={"mt-3"}>
              <Alert key={"dark"} variant={"dark"}>
                شرکت بهینه کاوان کیفیت
              </Alert>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <label className={"mt-3"}>
                پیش فاکتور شماره: <b>{state.inv_id}</b>
              </label>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col md={12}>
              <label className={"mt-1"}>
                خدمت ارائه شده: <b>{state.service_name}</b>
              </label>
            </Col>
          </Row>
          <Row>
            <Col>
              <label className={"mt-2"}>
                نام شخص حقیقی/حقوقی: <b>{state.costumer_name}</b>
              </label>
            </Col>
          </Row>
          <div className={"mt-3"}></div>
          <Row>
            <Col md={12}>
              <Alert
                key={"dark"}
                variant={state.status == 0 ? "success" : "danger"}
              >
                وضعیت پرداخت: <b>{state.status == 0 ? "موفق" : "ناموفق"}</b>
              </Alert>
              <Table
                style={{ textAlign: "right" }}
                className={"table-striped table-bordered detail-view"}
              >
                <tbody>
                  <tr>
                    <th>زمان تراکنش</th>
                    <td style={{ direction: "ltr" }}>
                      {state.t_date + " - " + state.t_time}
                    </td>
                  </tr>
                  <tr>
                    <th>وضعیت عملیات (Status)</th>
                    <td style={{ direction: "ltr" }}>
                      {state.status == 0 ? "پرداخت موفق" : "پرداخت ناموفق"}
                    </td>
                  </tr>
                  <tr>
                    <th>شماره مرجع (RRN)</th>
                    <td style={{ direction: "ltr" }}>{state.rrn}</td>
                  </tr>
                  <tr>
                    <th>شماره کارت (Card Number Masked)</th>
                    <td style={{ direction: "ltr" }}>
                      {state.card_number_masked}
                    </td>
                  </tr>
                  <tr>
                    <th>توکن (Token)</th>
                    <td style={{ direction: "ltr" }}>{state.token}</td>
                  </tr>
                  <tr>
                    <th>مبلغ</th>
                    <td style={{ direction: "ltr" }}>{state.amount}</td>
                  </tr>
                  <tr>
                    <th>شماره سفارش </th>
                    <td style={{ direction: "ltr" }}>{state.order_id}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
          <Row>
            <Col className={"mt-3"} md={12}>
              <Button onClick={print}>چاپ فرم</Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Result;
