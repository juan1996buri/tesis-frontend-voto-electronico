import React from "react";
import "../styles/NotFound.css";
import Error from "../images/Error.png";

const NotFound = () => {
    return (
        <div className="container_notFound">
            <img className="logo_error" src={Error} alt="error" />
            <div className="text_error">Error 404</div>
        </div>
    );
};

export default NotFound;
