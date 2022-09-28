import { Button } from "primereact/button";
import React, { useState } from "react";
import { Password } from "primereact/password";
import { UserService } from "../service/UserService";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import { classNames } from "primereact/utils";

const PasswordModificacionDatosInstitucion = () => {
    const history = useHistory();
    const [contrasenaActual, setContrasenaActual] = useState("");
    const [contrasenaNueva, setContrasenaNueva] = useState("");
    const [constrasenaRepetida, setContrasenaRepetida] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const cambiarPassword = {
        ruc: "",
        antiguoPassword: "",
        nuevoPassword: "",
    };

    const data = JSON.parse(window.localStorage.getItem("institucion"));

    const savePassword = () => {
        setSubmitted(true);
        if (contrasenaActual.trim() && contrasenaNueva.trim() && constrasenaRepetida.trim()) {
            if (contrasenaNueva === constrasenaRepetida) {
                cambiarPassword.antiguoPassword = contrasenaActual;
                cambiarPassword.nuevoPassword = constrasenaRepetida;
                cambiarPassword.ruc = data.ruc;
                const userService = new UserService();
                userService.postCambiarPassword(cambiarPassword).then((res) => {
                    if (res === 401) {
                        window.localStorage.removeItem("institucion");
                        history.push("/");
                    } else if (res === 200) {
                        setSubmitted(false);
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Contraseña cambiada desea reiniciar",
                            confirmButtonText: "SALIR",
                            showConfirmButton: true,
                        }).then((res) => {
                            if (res.isConfirmed) {
                                window.localStorage.removeItem("institucion");
                                history.push("/");
                            }
                        });
                    } else if (res === 404) {
                        setSubmitted(false);
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: "La contraseña actual no es la correcta",
                            confirmButtonText: "SALIR",
                            showConfirmButton: true,
                        });
                    }
                });
            } else {
                setSubmitted(false);
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "No coinciden las contraseñas",
                    confirmButtonText: "SALIR",
                    showConfirmButton: true,
                });
            }
        }
    };
    return (
        <div className="grid">
            <div className="col-12 md:col-6">
                <div className="card p-fluid">
                    <h5>Datos de la institución</h5>
                    <div className="field">
                        <label htmlFor="ruc">Contraseña actual</label>
                        <Password value={contrasenaActual} onChange={(e) => setContrasenaActual(e.target.value)} toggleMask required autoFocus className={classNames({ "p-invalid": submitted && !contrasenaActual })} />
                        {submitted && !contrasenaActual && <small className="p-invalid">Contraseña actual es requerido</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="correo">Nueva contraseña</label>
                        <Password maxLength={6} mediumLabel={"escribir"} value={contrasenaNueva} onChange={(e) => setContrasenaNueva(e.target.value)} toggleMask required autoFocus className={classNames({ "p-invalid": submitted && !contrasenaNueva })} />
                        {submitted && !contrasenaNueva && <small className="p-invalid">Contraseña nueva es requerido</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="nombre">Escriba nuevamente la contraseña</label>
                        <Password value={constrasenaRepetida} onChange={(e) => setContrasenaRepetida(e.target.value)} toggleMask required autoFocus className={classNames({ "p-invalid": submitted && !constrasenaRepetida })} />
                        {submitted && !constrasenaRepetida && <small className="p-invalid">Contraseña nueva es requerido</small>}
                    </div>
                    <div className="field"></div>
                    <div className="field"></div>
                    <Button label="ACTUALIZAR" onClick={savePassword}></Button>
                </div>
            </div>
        </div>
    );
};

export default PasswordModificacionDatosInstitucion;
