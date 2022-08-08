import React from "react";
import logo from "./images/logo.png";

export const AppFooter = (props) => {
    return (
        <div className="layout-footer">
            <img src={logo} alt="Logo" height="20" className="mr-2" />
            by
            <span className="font-medium ml-2">IST Luis Rogerio Gonzalez</span>
        </div>
    );
};
