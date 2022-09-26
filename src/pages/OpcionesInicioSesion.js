import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/OpcionesInicioSesion.css";
import logo from "../images/logo.png";
const OpcionesInicioSesion = () => {
    return (
        <div className="container_">
            <div className="container_opcion">
                <div className="container_header">
                    <img src={logo} style={{ width: "17rem" }} alt="logo" />
                    <h2 style={{ fontStyle: "initial", fontSize: "4rem" }}>Voto electrónico</h2>
                </div>
                <div className="opcion">
                    <NavLink to={"/login-votante"}>
                        <div className="container_item_opcion_">Ingresar como votante</div>
                    </NavLink>
                </div>
                <div className="opcion">
                    <NavLink to={"/login-institucion"}>
                        <div className="container_item_opcion_">Ingresar como administrador</div>
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default OpcionesInicioSesion;
