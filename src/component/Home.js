import React, { useState } from "react";
import { useEffect } from "react";
import { Alert, Col, Row, Table, TabPane } from "react-bootstrap";
import { getRequest } from "./services/PlineTools";

const Home = () => {
  const [state, setState] = useState([]);
  const [timeDate, setTimeDate] = useState({
    date: "",
    time: "",
  });

  useEffect(() => {
    return function cleanup() {};
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Alert key={0} variant={"primary"}>
            <h5>سامانه پرداخت انلاین بهینه کاوان</h5>
          </Alert>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
