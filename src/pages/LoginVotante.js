import classNames from "classnames";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { VotanteService } from "../service/VotanteService";
import { Toast } from "primereact/toast";
import "../styles/LoginVotante.css";
import logo from "../images/logo.png";

const LoginVotante = () => {
    const history = useHistory();
    const [password, setPassword] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);

    const onInputChange = (e) => {
        const { value } = e.target;
        setPassword(value);
    };
    const saveUser = () => {
        setSubmitted(true);
        if (password.trim()) {
            const votanteService = new VotanteService();
            votanteService.getLogin(password).then((res) => {
                if (res === 500) {
                    toast.current.show({ severity: "error", summary: "Error Message", detail: "El codigo es incorrecto", life: 3000 });
                } else {
                    history.push("/votante");
                }
            });
        }
    };
    return (
        <div className="container_login__">
            <Toast ref={toast} />
            <div className="container_login_votante p-fluid">
                <div className="container_login_votante_header">
                    <img src={logo} style={{ width: "17rem" }} alt="logo" />
                </div>
                <div className="item">
                    <label htmlFor="password" style={{ fontSize: "1.5rem" }}>
                        Código
                    </label>
                    <Password style={{ height: "4rem" }} type={"number"} id="password" name="password" value={password} onChange={(e) => onInputChange(e)} toggleMask feedback={false} required autoFocus className={classNames({ "p-invalid ": submitted && !password })} />
                    {submitted && !password && (
                        <small style={{ fontSize: "1rem" }} className="p-invalid">
                            Se requiere un código
                        </small>
                    )}
                </div>

                <div>
                    <Button label="Iniciar sesión" style={{ fontSize: "1.5rem" }} className="p-button-blue" onClick={saveUser} />
                </div>
            </div>
        </div>
    );
};

export default LoginVotante;
