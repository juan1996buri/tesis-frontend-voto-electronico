import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "./images/logo.png";
import { useHistory } from "react-router-dom";

export const AppTopbar = (props) => {
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

                    <button type="button" className="p-link  layout-menu-button layout-topbar-button" onClick={props.onToggleMenuClick}>
                        <i className="pi pi-bars" />
                    </button>
                </div>

                <div style={{ marginLeft: "auto" }}>
                    <img src={logo} alt="logo" style={{ width: "3rem", marginRight: "2.5rem", cursor: "pointer" }} onClick={() => setActive(!active)} />
                    {active && (
                        <div style={{ position: "fixed", right: "0.5rem", textAlign: "center", background: "white", width: "12rem", borderRadius: "0.5rem", paddingTop: "0.5rem" }}>
                            <div style={{ textDecoration: "none" }}>
                                <Link to={`${props.url}/datosInstitucion`} style={{ color: "blue" }}>
                                    <h4 onClick={() => setActive(!active)}>Perfil</h4>
                                </Link>
                                <Link to={`${props.url}/passwordModificacionDatosInstitucion`} style={{ color: "blue" }}>
                                    <h4 onClick={() => setActive(!active)}>Cambiar contraseña</h4>
                                </Link>
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
