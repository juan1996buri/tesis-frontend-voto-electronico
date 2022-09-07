import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/OpcionesInicioSesion.css";

const OpcionesInicioSesion = () => {
    const [user, setUser] = useState({ password: "", ruc: "" });
    const [submitted, setSubmitted] = useState(false);

    return (
        <div className="container">
            <div className="container_opcion">
                <div className="opcion">
                    <NavLink to={"/login-votante"}>
                        <div className="container_item_opcion">Ingresar como votante</div>
                    </NavLink>
                </div>
                <div className="opcion">
                    <NavLink to={"/login-institucion"}>
                        <div className="container_item_opcion">Ingresar como administrador</div>
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default OpcionesInicioSesion;
