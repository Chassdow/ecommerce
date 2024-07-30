import React from "react";
import '../../../../src/App.css';

const Card = ({ title, image, categorie, content, price,  }) => {
    return (
      <div className="card">
        <h2>{title}</h2>
        <h4>{categorie}</h4>
        <image>{image}</image>
        <p>{content}</p>
        <p>{price}</p>
      </div>
    );
  };
  
export default Card;