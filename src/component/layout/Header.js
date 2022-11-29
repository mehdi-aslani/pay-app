import React from "react";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getCookies, postRequest } from "../services/PlineTools";
import "./Header.css";

const Header = (props) => {
  const navDropdownTitle = (
    <>
      <PersonCircle /> {props.UserName}
    </>
  );

  return (
    <header className="header">
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/home">
            داشبورد
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {getCookies("role") == 1 && (
                <>
                  <NavDropdown title="مدیریت کاربران" id="basic-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/users/index">
                      تعریف کاربر
                    </NavDropdown.Item>
                  </NavDropdown>

                  <NavDropdown title="تعاریف" id="basic-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/services/index">
                      معرفی خدمات
                    </NavDropdown.Item>
                  </NavDropdown>
                </>)}
              <NavDropdown title="لیست مشتریان" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/customers/index">
                  صدور پیش فاکتور
                </NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="پیش فاکتور ها" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/invoices/index">
                  صدور پیش فاکتور
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/tas/index">
                  وضعیت پرداخت پیش فاکتور
                </NavDropdown.Item>
              </NavDropdown>

            </Nav>

            <Nav className="ml-auto">
              <NavDropdown title={navDropdownTitle} id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/user/change-password">
                  تغییر کلمه عبور
                </NavDropdown.Item>
                {/* <NavDropdown.Divider /> */}
              </NavDropdown>
              <Nav.Link onClick={props.LogoutAction}>خروج</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
