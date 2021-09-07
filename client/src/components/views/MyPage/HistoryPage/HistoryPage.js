import React, { useState } from "react";
import axios from "axios";
import { Col, Checkbox } from "antd";
import VerticalMenu from "../VerticalMenu/VerticalMenu";
import HistoryInfo from "./Section/HistotyInfo";
// import {CaretRightOutlined} from '@ant-design/icons';
// import HistorySearchFeature from './HistorySearchFeature';
import "./HistoryPage.css";

function HistoryPage(props) {
  return (
    <div
      id="body"
      style={{ paddingTop: "50px", maxWidth: "100vw", margin: "auto" }}
    >
      <Col style={{ float: "left", marginLeft: "84px", marginRight: 0 }}>
        <VerticalMenu />
      </Col>
      <HistoryInfo user={props.user} />
    </div>
  );
}

export default HistoryPage;
