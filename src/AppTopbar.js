import React from "react";
import { Link } from "react-router-dom";
import logo from "./images/logo.png";

export const AppTopbar = (props) => {
    return (
        <div className="layout-topbar">
            <Link to="/" className="layout-topbar-logo">
                <img src={logo} alt="logo" />
                <span>VOTO ELECTRONICO</span>
            </Link>

            <button type="button" className="p-link  layout-menu-button layout-topbar-button" onClick={props.onToggleMenuClick}>
                <i className="pi pi-bars" />
            </button>
        </div>
    );
};
