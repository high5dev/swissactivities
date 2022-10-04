import React from "react";

const Breadcrumb = ({ array, children }) => {
  return <div className="breadcrumb-container">
    <div className="container" style={{ alignItems: 'baseline' }}>
      {
        array.map((el, index) => 
          <div key={`breadcrumb-item-${index}`} className="breadcrumb-item">{el}</div>
        )
      }
      {children}
    </div>
  </div>;
};

export default Breadcrumb;
