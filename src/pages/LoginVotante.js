import classNames from "classnames";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import React, { useState } from "react";
import { UserService } from "../service/UserService";
import "../styles/login.css";

const LoginVotante = () => {
    const [user, setUser] = useState({ password: "", ruc: "" });
    const [submitted, setSubmitted] = useState(false);

    const onInputChange = (e) => {
        const { value, name } = e.target;
        setUser({ ...user, [name]: value });
    };
    const saveUser = () => {
        setSubmitted(true);
        if (user.password.trim() && user.ruc.trim()) {
            const userService = new UserService();
            userService.postUserLogin(user);
        }
    };
    return (
        <div className="container">
            <div className="container_login_votante p-fluid">
                <div className="item">
                    <label htmlFor="password">Password</label>
                    <Password id="password" name="password" value={user?.password} onChange={(e) => onInputChange(e)} toggleMask feedback={false} required autoFocus className={classNames({ "p-invalid ": submitted && !user.password })} />
                    {submitted && !user.password && <small className="p-invalid">Se requiere una contraseña</small>}
                </div>

                <div>
                    <Button label="Iniciar Sesión" icon="pi pi-check" className="p-button-blue" onClick={saveUser} />
                </div>
            </div>
        </div>
    );
};

export default LoginVotante;
