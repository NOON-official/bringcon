import React from "react";
import "./Progress.css";
import PropTypes from "prop-types";
import { CircularProgress } from "@material-ui/core";

const Progress = ({ percentage }) => {
  return (
    <div className="container">
      <CircularProgress variant="determinate" value={percentage} size="100px" />
      <div className="text">{percentage}%</div>
    </div>
  );
};

Progress.propTypes = {
  percentage: PropTypes.number.isRequired,
};

export default Progress;
