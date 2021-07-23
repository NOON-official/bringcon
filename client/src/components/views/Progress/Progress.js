import React from 'react';
import './Progress.css';
import PropTypes from 'prop-types';

const Progress = ({percentage}) => {
    return (
        <div className="container">
            <div className="text">{percentage}%</div>
            <div className="progress">
            <div className="bar"
                role="progressbar"
                style={{width: `${percentage}%`}}>
            {percentage}%
            </div>
        </div>
        </div>
    );
};

Progress.propTypes = {
    percentage: PropTypes.number.isRequired
  };
  
export default Progress;
