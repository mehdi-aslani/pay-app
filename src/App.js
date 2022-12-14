import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import Home from "./component/Home";
import Footer from "./component/layout/Footer";
import NotFound from "./component/errors/NotFound";
import { ToastContainer } from "react-toastify";
import Login from "./component/login/Login";
import React, { useState, useEffect } from "react";
import PrivateRoute from "./component/private-route/PrivateRoute";
import ChangePassword from "./component/users/ChangePassword";

import {
  getCookies,
  removeCookies,
  setCookies,
} from "./component/services/PlineTools";
import Users from "./component/users/Users";
import UserForm from "./component/users/UserForm";
import IsqiService from "./component/Isqi-service/IsqiServices";
import IsqiServiceForm from "./component/Isqi-service/IsqiServiceForm";
import Invoices from "./component/invoice/Invoices";
import InvoiceForm from "./component/invoice/InvoiceForm";
import Pay from "./component/pay/Pay";
import Result from "./component/pay/Result";
import Customers from "./component/customer/Customers";
import CustomerForm from "./component/customer/CustomerForm";
import Transactions from "./component/transactions/Transactions";

const App = () => {
  const navigate = useNavigate();
  const [, setState] = useState({ menuHide: false });

  useEffect(() => {
    setState({ menuHide: getCookies("isAuth") });
  }, []);

  const login = (result) => {
    setCookies("auth", true);
    setCookies("username", result.username);
    setCookies("user_id", result.user_id);
    setCookies("token", result.token);
    setCookies("role", result.role);
    setState({});
    navigate("/");
  };

  const logout = () => {
    removeCookies("auth");
    removeCookies("username");
    removeCookies("token");
    removeCookies("user_id");

    setCookies("name", "");
    setCookies("username", "");
    setCookies("token", "");
    setCookies("user_id", "");
    setCookies("role", "");

    setState({});
    navigate("/login");
  };

  return (
    <div dir="rtl">
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
        Row
        theme="colored"
      />
      <Container style={{ paddingBottom: "3.5vw" }}>
        <Routes>
          <Route path="/notfound" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/notfound" />} />
        </Routes>
        <Footer />
      </Container>
    </div>
  );
};

export default App;
