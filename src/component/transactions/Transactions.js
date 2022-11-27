import React, { useEffect, useState } from "react";
import { Button, Col, Modal, Row, Table } from "react-bootstrap";
import { ViewList } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import YiiGridView from "../grid-view/YiiGridView";
import { backend_url, getCookies, getRequest, numberWithCommas } from "../services/PlineTools";
import "./Tas.css";

const Transactions = () => {
  const [state, setState] = useState({ items: [] });
  const [sortParams, setSortParams] = useState({ sort: "" });
  const [searchParams] = useState({});
  const [show, setShow] = useState(false);
  const [tas, setTas] = useState([]);
  const columns = [
    {
      label: "ردیف",
      id: "#",
      search: false,
    },

    {
      label: "تاریخ",
      id: "date",
      search: true,
      sort: true,
    },
    {
      label: "ساعت",
      id: "time",
      search: true,
      sort: true,
    },
    {
      label: "شماره پیش فاکتور",
      id: "id",
      search: true,
      sort: true,
    },
    {
      label: "نام مشتری",
      id: "costumer_name",
      search: true,
      sort: true,
    },
    {
      label: "شرح خدمت",
      id: "service_name",
      search: true,
      sort: true,
    },
    {
      label: "مبلغ پیش فاکتور",
      id: "price",
      search: true,
      sort: true,
      value: (v) => {
        return numberWithCommas(v);
      }
    },
    {
      label: "موبایل",
      id: "mobile",
      search: true,
      sort: true,
    },
    {
      label: "ارزش افزوده",
      id: "with_tax",
      search: true,
      sort: true,
      filter: [
        { value: 1, label: "با ارزش افزوده" },
        { value: 0, label: "بدون ارزش افزوده" },
      ],
      value: (v) => {
        return v ? "با ارزش افزوده" : "بدون ارزش افزوده";
      }
    },
    {
      label: "وضعیت پرداخت",
      id: "status",
      search: true,
      sort: true,
      filter: [
        { value: "null", label: "پرداخت نشده" },
        { value: 1, label: "پرداخت موفق" },
        { value: 2, label: "پرداخت ناموفق" },
      ],
      value: (v) => {
        if (v == 1) {
          return "پرداخت موفق";
        } else if (v == 0 || v == null) {
          return "پرداخت نشده";
        }
        return "پرداخت ناموفق";
      }
    },
    {
      label: "ثبت کننده پیش فاکتور",
      id: "reg_name",
      search: true,
      sort: true,
    },
    {
      label: "جزییات",
      id: "id",
      value: (value) => {
        return (
          <p
            className="view"
            onClick={() => {
              view(value);
            }}
          >
            <ViewList />
          </p>
        );
      },
    },

  ];


  const view = (id) => {
    getRequest(`/tas/${id}`)
      .then((data) => {
        data = data.data;
        setTas(data);
        handleShow();
      })
      .catch((error) => {
        toast.error(
          "هنگام اجرای درخواست شما خطایی روی داد است. لطفا با مدیر سیستم تماس بگیرید\n" +
          error
        );
      });
  }

  const getData = (href = "") => {
    if (href === "") {
      href = "/invoices?";
    }
    let searchUrl = "&" + new URLSearchParams(searchParams).toString();
    if (searchUrl === "&") searchUrl = "";

    if (sortParams.sort.trim() !== "") searchUrl += `&sort=${sortParams.sort}`;

    getRequest(`${href}${searchUrl}`)
      .then((data) => {
        data = data.data;
        setState(data);
      })
      .catch((error) => {
        toast.error(
          "هنگام اجرای درخواست شما خطایی روی داد است. لطفا با مدیر سیستم تماس بگیرید\n" +
          error
        );
      });
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  useEffect(() => {
    getData();
  }, []);

  const export_xls = () => {
    window.open(backend_url() + "/tas/export?rnd=" + getCookies("user_id"), '_blank').focus();
  };

  const search = (f, v) => {
    searchParams["VwInvoicesSerach[" + f + "]"] = v;
    getData();
  };

  const sort = (f) => {
    setSortParams({ sort: f });
    getData();
  };

  return (
    <>
      <Modal dialogClassName="modal-90w"
        aria-labelledby="modal-styling-title"
        show={show} onHide={handleClose}>
        <Modal.Header closeButton id="modal-styling-title">
          <Modal.Title>جزییات تراکنش</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>تاریخ</th>
                <th>ساعت</th>
                <th>پیام سمت بانک</th>
                <th>توکن</th>
                <th>کد وضعیت</th>
                <th>شماره سفارش</th>
                <th>شماره ترمینال</th>
                <th>مبلغ</th>
                <th>شماره مرجع</th>
                <th>شماره کارت</th>
              </tr>
            </thead>
            <tbody>
              {tas.map((v, i) => {
                return (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td style={{ "direction": "ltr" }}>{v.t_date}</td>
                    <td style={{ "direction": "ltr" }}>{v.t_time}</td>
                    <td>{v.message}</td>
                    <td style={{ "direction": "ltr" }}>{v.token}</td>
                    <td style={{ "direction": "ltr" }}>{v.status}</td>
                    <td style={{ "direction": "ltr" }}>{v.order_id}</td>
                    <td style={{ "direction": "ltr" }}>{v.terminal_no}</td>
                    <td style={{ "direction": "ltr" }}>{numberWithCommas(v.amount)}</td>
                    <td style={{ "direction": "ltr" }}>{v.rrn}</td>
                    <td style={{ "direction": "ltr" }}>{v.card_number_masked}</td>
                  </tr>
                );
              })
              }
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            خروج
          </Button>
        </Modal.Footer>
      </Modal>

      <Row>
        <Col>
          <a className="btn btn-primary" href={backend_url() + "/tas/export?rnd=" + getCookies("user_id")} target="_blank" download>
            دانلود فایل تراکنش ها
          </a>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col>
          <h4>لیست پیش فاکتورها</h4>
        </Col>
      </Row>
      <Row>
        <Col>
          <YiiGridView
            Columns={columns}
            Data={state.items}
            Events={{
              first: () => {
                if (state._links.first?.href === undefined) return;
                getData(state._links.first?.href);
              },
              pre: () => {
                if (state._links.prev?.href === undefined) return;
                getData(state._links.prev?.href);
              },
              self: () => {
                if (state._links.self?.href === undefined) return;
                getData(state._links.self?.href);
              },
              next: () => {
                if (state._links.next?.href === undefined) return;
                getData(state._links.next?.href);
              },
              last: () => {
                if (state._links.last?.href === undefined) return;
                getData(state._links.last?.href);
              },
            }}
            Pagination={{
              totalCount: state._meta?.totalCount,
              pageCount: state._meta?.pageCount,
              currentPage: state._meta?.currentPage,
              perPage: state._meta?.perPage,
            }}
            SearchEvent={search}
            SortEvent={sort}
          />
        </Col>
      </Row>
    </>
  );
};
export default Transactions;
