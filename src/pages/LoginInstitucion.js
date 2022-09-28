import React, { useState, useRef } from "react";
import classNames from "classnames";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import logo from "../images/logo.png";

import { NavLink, useHistory } from "react-router-dom";
import { UserService } from "../service/UserService";
import "../styles/LoginInstitucion.css";

const LoginInstitucion = () => {
    const history = useHistory();
    const [user, setUser] = useState({ password: "", ruc: "" });
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);

    const onInputChange = (e) => {
        const { value, name } = e.target;
        setUser({ ...user, [name]: value });
    };
    const saveUser = () => {
        setSubmitted(true);
        if (user.password.trim() && user.ruc.trim()) {
            const userService = new UserService();
            userService.postUserLogin(user);

            userService.postUserLogin(user).then((res) => {
                if (res === 404) {
                    toast.current.show({ severity: "error", summary: "Error Message", detail: "El Usuario o la contraseña son incorrectas", life: 3000 });
                } else if (res.token && res.roles) {
                    if (res.roles.nombre === "ROLE_ADMIN") {
                        history.push("/administrador");
                    } else if (res.roles.nombre === "ROLE_INSTITUTE") {
                        history.push("/institucion");
                    }
                }
            });
        }
    };
    return (
        <div className="container_login_institucion">
            <Toast ref={toast} />
            <div className="container_login___ p-fluid">
                <div className="container_login_institucion_header">
                    <img src={logo} style={{ width: "17rem" }} alt="logo" />
                </div>
                <div className="item">
                    <label htmlFor="ruc" style={{ fontSize: "1.5rem" }}>
                        Usuario
                    </label>
                    <InputText style={{ fontSize: "1.5rem" }} id="ruc" name="ruc" onChange={(e) => onInputChange(e)} required autoFocus className={classNames({ "p-invalid ": submitted && !user.ruc })} />
                    {submitted && !user.ruc && <small className="p-invalid">Se requiere un nombre</small>}
                </div>
                <div className="item">
                    <label htmlFor="password" style={{ fontSize: "1.5rem" }}>
                        Contraseña
                    </label>
                    <Password
                        inputStyle={{ fontSize: "1.5rem" }}
                        style={{ fontSize: "1.5rem" }}
                        size={"12rem"}
                        id="password"
                        name="password"
                        value={user?.password}
                        onChange={(e) => onInputChange(e)}
                        feedback={false}
                        toggleMask
                        required
                        autoFocus
                        className={classNames({ "p-invalid ": submitted && !user.password })}
                    />
                    {submitted && !user.password && <small className="p-invalid">Se requiere una contraseña</small>}
                </div>
                <div className="item">
                    <NavLink to={"/registrar"}>
                        <label id="registrarse" style={{ fontSize: "1.5rem", cursor: "pointer" }}>
                            Registrarse
                        </label>
                    </NavLink>
                </div>
                <div>
                    <Button style={{ fontSize: "1.5rem" }} label="Iniciar Sesión" className="p-button-blue" onClick={saveUser} />
                </div>
            </div>
        </div>
    );
};

export default LoginInstitucion;
