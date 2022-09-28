import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "./images/logo.png";
import { useHistory } from "react-router-dom";
import Tuerca from "../src/images/Tuerca.png";

export const AppTopbarVotante = (props) => {
    const history = useHistory();

    const [active, setActive] = useState(false);
    const actionProp = () => {
        window.localStorage.removeItem("institucion");
        history.push("/");
    };
    return (
        <div>
            <div className="layout-topbar" style={{ width: "100%" }}>
                <div style={{ display: "flex" }}>
                    <Link to="/" className="layout-topbar-logo">
                        <img src={logo} alt="logo" />
                        <span>VOTO ELECTRONICO</span>
                    </Link>
                </div>

                <div style={{ marginLeft: "auto" }}>
                    <img src={Tuerca} alt="logo" style={{ width: "3rem", marginRight: "2.5rem", cursor: "pointer" }} onClick={() => setActive(!active)} />
                    {active && (
                        <div style={{ position: "fixed", right: "0.5rem", textAlign: "center", background: "white", width: "12rem", borderRadius: "0.5rem", paddingTop: "0.5rem" }}>
                            <div style={{ textDecoration: "none" }}>
                                <h4 onClick={actionProp} style={{ color: "blue", cursor: "pointer" }}>
                                    Cerrar sesión
                                </h4>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
