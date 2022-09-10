import classNames from "classnames";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { VotanteService } from "../service/VotanteService";
import { Toast } from "primereact/toast";
import "../styles/login.css";

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
                    toast.current.show({ severity: "error", summary: "Error Message", detail: "El Ruc o la contraseña son incorrectas", life: 3000 });
                } else {
                    history.push("/votante");
                }
            });
        }
    };
    return (
        <div className="container">
            <Toast ref={toast} />
            <div className="container_login_votante p-fluid">
                <div className="item">
                    <label htmlFor="password">Password</label>
                    <Password type={"number"} id="password" name="password" value={password} onChange={(e) => onInputChange(e)} toggleMask feedback={false} required autoFocus className={classNames({ "p-invalid ": submitted && !password })} />
                    {submitted && !password && <small className="p-invalid">Se requiere una contraseña</small>}
                </div>

                <div>
                    <Button label="Iniciar Sesión" icon="pi pi-check" className="p-button-blue" onClick={saveUser} />
                </div>
            </div>
        </div>
    );
};

export default LoginVotante;
