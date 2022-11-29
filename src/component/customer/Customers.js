import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import YiiGridView from "../grid-view/YiiGridView";
import { deleteRequest, getRequest } from "../services/PlineTools";

// 'id_costumer' => $this->integer()->notNull(),
// 'id_service' => $this->integer()->notNull(),
// 'refer_code' => $this->string(255),
// 'price' => $this->bigInteger()->notNull(),
// 'mobile' => $this->string(11)->notNull(),
// 'date' => $this->string(10)->notNull(),
// 'time' => $this->string(5)->notNull(),
// 'reg_user_id' => $this->integer()->notNull(),
// 'link' => $this->string(255),

const Customers = () => {
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
      label: "نام مشتری",
      id: "name",
      search: true,
      sort: true,
    },
    {
      label: "ماهیت",
      id: "is_personal",
      search: true,
      sort: true,
      filter: [
        { value: 1, label: "حقیقی" },
        { value: 0, label: "حقوقی" },
      ],
      value: (v) => {
        return v ? "حقیقی" : "حقوقی";
      }
    },
    {
      label: "کد اقتصادی",
      id: "economicalـnumber",
      search: true,
      sort: true,
    },

    {
      label: "کد ملی/شناسه ملی",
      id: "nuique_id",
      search: true,
      sort: true,
    },
    {
      label: "کدپستی",
      id: "post_code",
      search: true,
      sort: true,
    },
    {
      label: "استان",
      id: "province",
      search: true,
      sort: true,
    },
    {
      label: "شهر",
      id: "city",
      search: true,
      sort: true,
    },
    {
      label: "آدرس",
      id: "address",
      search: true,
      sort: true,
    },
    {
      label: "تلفن/فکس",
      id: "tel_fax",
      search: true,
      sort: true,
    },
    // {
    //   label: "ویرایش",
    //   id: "id",
    //   value: (value) => {
    //     return (
    //       <p
    //         className="edit"
    //         onClick={() => {
    //           Edit(value);
    //         }}
    //       >
    //         <PencilSquare />
    //       </p>
    //     );
    //   },
    // },
    // {
    //   label: "حذف",
    //   id: "id",
    //   value: (value) => {
    //     return (
    //       <p
    //         className="delete"
    //         variant="danger"
    //         onClick={() => {
    //           Delete(value);
    //         }}
    //       >
    //         <Trash />
    //       </p>
    //     );
    //   },
    // },
  ];
  const getData = (href = "") => {
    if (href === "") {
      href = "/customers?";
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
    if (window.confirm("برای حذف این مشتری مطمئن هستید؟")) {
      deleteRequest("/customers/" + id)
        .then((result) => {
          toast.success("مشتری مورد نظر حذف شد.");
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
    navigate("/customers/edit/" + id);
  };

  useEffect(() => {
    getData();
  }, []);

  const search = (f, v) => {
    searchParams["TblCustomersSearch[" + f + "]"] = v;
    getData();
  };

  const sort = (f) => {
    setSortParams({ sort: f });
    getData();
  };

  return (
    <>
      {/* <Row>
        <Col>
          <Button as={Link} to="/customers/create">
            ایجاد مشتری
          </Button>
        </Col>
      </Row>
      <hr /> */}
      <Row>
        <Col>
          <h4>لیست مشتریان</h4>
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
export default Customers;
