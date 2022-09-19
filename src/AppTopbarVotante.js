import React from "react";
import { Link } from "react-router-dom";
import logo from "./images/logo.png";

export const AppTopbarVotante = (props) => {
    return (
        <div>
            <div className="layout-topbar" style={{ width: "100%" }}>
                <div style={{ display: "flex" }}>
                    <Link to="/" className="layout-topbar-logo">
                        <img src={logo} alt="logo" />
                        <span>VOTO ELECTRONICO</span>
                    </Link>
                </div>

                <div style={{ marginLeft: "auto" }}></div>
            </div>
        </div>
    );
};
