import { Button } from "primereact/button";
import React, { useState } from "react";
import { Password } from "primereact/password";

const PasswordModificacionDatosInstitucion = () => {
    const [value3, setValue3] = useState("");
    return (
        <div className="grid">
            <div className="col-12 md:col-6">
                <div className="card p-fluid">
                    <h5>Datos de la institución</h5>
                    <div className="field">
                        <label htmlFor="ruc">Contraseña actual</label>
                        <Password value={value3} onChange={(e) => setValue3(e.target.value)} toggleMask />
                    </div>
                    <div className="field">
                        <label htmlFor="correo">Nueva contraseña</label>
                        <Password value={value3} onChange={(e) => setValue3(e.target.value)} toggleMask />
                    </div>

                    <div className="field">
                        <label htmlFor="nombre">Escriba nuevamente la contraseña</label>
                        <Password value={value3} onChange={(e) => setValue3(e.target.value)} toggleMask />
                    </div>
                    <div className="field"></div>
                    <div className="field"></div>
                    <Button label="ACTUALIZAR"></Button>
                </div>
            </div>
        </div>
    );
};

export default PasswordModificacionDatosInstitucion;
