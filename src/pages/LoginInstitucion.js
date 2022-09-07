import React, { useState, useRef } from "react";
import classNames from "classnames";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";

import { NavLink, useHistory } from "react-router-dom";
import { UserService } from "../service/UserService";
import "../styles/login.css";

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
                    toast.current.show({ severity: "error", summary: "Error Message", detail: "El Ruc o la contraseña son incorrectas", life: 3000 });
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
        <div className="container">
            <Toast ref={toast} />
            <div className="container_login p-fluid">
                <div className="item">
                    <label htmlFor="ruc">Ruc</label>
                    <InputText id="ruc" name="ruc" onChange={(e) => onInputChange(e)} required autoFocus className={classNames({ "p-invalid ": submitted && !user.ruc })} />
                    {submitted && !user.ruc && <small className="p-invalid">Se requiere un nombre</small>}
                </div>
                <div className="item">
                    <label htmlFor="password">Password</label>
                    <Password id="password" name="password" value={user?.password} onChange={(e) => onInputChange(e)} feedback={false} toggleMask required autoFocus className={classNames({ "p-invalid ": submitted && !user.password })} />
                    {submitted && !user.password && <small className="p-invalid">Se requiere una contraseña</small>}
                </div>
                <div className="item">
                    <NavLink to={"/registrar"}>
                        <label id="registrarse">Registrarse</label>
                    </NavLink>
                </div>
                <div>
                    <Button label="Iniciar Sesión" icon="pi pi-check" className="p-button-blue" onClick={saveUser} />
                </div>
            </div>
        </div>
    );
};

export default LoginInstitucion;
