import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import YiiGridView from "../grid-view/YiiGridView";
import { deleteRequest, getRequest, numberWithCommas } from "../services/PlineTools";

const Invoices = () => {
  const [state, setState] = useState({ items: [] });
  const [sortParams, setSortParams] = useState({ sort: "" });
  const [searchParams] = useState({});
  const navigate = useNavigate();
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
      label: "ویرایش",
      id: "id",
      value: (value) => {
        return (
          <p
            className="edit"
            onClick={() => {
              Edit(value);
            }}
          >
            <PencilSquare />
          </p>
        );
      },
    },
    {
      label: "حذف",
      id: "id",
      value: (value) => {
        return (
          <p
            className="delete"
            variant="danger"
            onClick={() => {
              Delete(value);
            }}
          >
            <Trash />
          </p>
        );
      },
    },
  ];
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

  const Delete = (id) => {
    if (window.confirm("برای حذف این پیش فاکتور مطمئن هستید؟")) {
      deleteRequest("/invoices/" + id)
        .then((result) => {
          toast.success("پیش فاکتور مورد نظر حذف شد.");
          getData();
        })
        .catch((error) => {
          if (error.response.status === 422) {
            error.response.data.forEach((value) => {
              toast.error(value.message);
            });
          }
        });
    }
  };

  const Edit = (id) => {
    navigate("/invoices/edit/" + id);
  };

  useEffect(() => {
    getData();
  }, []);

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
      <Row>
        <Col>
          <Button as={Link} to="/invoices/create">
            ایجاد پیش فاکتور
          </Button>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col>
          <h4>لیست پیش فاکتور ها</h4>
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
export default Invoices;
