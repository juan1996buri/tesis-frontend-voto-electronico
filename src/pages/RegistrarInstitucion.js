import classNames from "classnames";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { CiudadService } from "../service/CiudadService";
import { InstitucionService } from "../service/InstitucionService";
import { ProvinciaService } from "../service/ProvinciaService";
import { TipoInstitucionService } from "../service/TipoInstitucionService";
import "../styles/register.css";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import { UserService } from "../service/UserService";

const RegistrarInstitucion = () => {
    const history = useHistory();
    const toast = useRef(null);
    const [user, setUser] = useState({ ruc: "", password: "" });
    const [submitted, setSubmitted] = useState(false);
    const [tipoInstitucion, setTipoInstitucion] = useState({});
    const [tiposInstituciones, setTipoInstituciones] = useState({});
    const [provincia, setProvincia] = useState({});
    const [provincias, setProvincias] = useState([]);
    const [ciudad, setCiudad] = useState({});
    const [ciudades, setCiudades] = useState([]);
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [institucion, setInstitucion] = useState({
        correo: "",
        nombre: "",
        ciudad: "",
        direccion: "",
        ruc: "",
        tipoInstitucion: "",
    });

    useEffect(() => {
        const provinciaService = new ProvinciaService();
        provinciaService.getProvincias(setProvincias).then((item) => setProvincia(item[0]));
        const ciudadService = new CiudadService();
        ciudadService.getCiudades(setCiudades).then((c) => {
            provinciaService.getProvincias(setProvincias).then((p) => setCiudad(c.find((item) => item.provincia.id === p[0].id)));
        });
        const tipoInstitucionService = new TipoInstitucionService();
        tipoInstitucionService.getTiposInstituciones(setTipoInstituciones).then((item) => setTipoInstitucion(item[0]));
        setSubmitted(false);
    }, []);

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _institucion = { ...institucion };
        _institucion[`${name}`] = val;
        setInstitucion(_institucion);
    };

    const saveUser = () => {
        setSubmitted(true);
        if (password !== repeatPassword) {
            return toast.current.show({ severity: "error", summary: "Error Message", detail: "Las contraseñas no coinciden", life: 3000 });
        } else {
            if (institucion.ruc.trim() && institucion.nombre.trim() && password.trim() && institucion.correo.trim()) {
                institucion.ciudad = ciudad;
                institucion.tipoInstitucion = tipoInstitucion;
                user.password = password;
                user.ruc = institucion.ruc;

                const userService = new UserService();
                const institucionService = new InstitucionService();
                userService.postUser(user).then((res) =>
                    res === 500
                        ? toast.current.show({ severity: "error", summary: "Error Message", detail: "El RUC ya se encuentra en uso", life: 3000 })
                        : (toast.current.show({ severity: "success", summary: "Successful", detail: "recinto registrado", life: 3000 }),
                          institucionService.postInstitucion(institucion),
                          setTimeout(function () {
                              history.push("/login-institucion");
                          }, 1000))
                );
            }
        }
    };

    const onCiudadChange = (e) => {
        setCiudad(e.value);
    };
    const onProvinciaChange = (e) => {
        setProvincia(e.value);
        setCiudad(ciudades.find((item) => item.provincia.id === e.value.id));
        const object = new CiudadService();
        object.getCiudades(setCiudades);
    };
    const onTipoInstitucionChange = (e) => {
        const { value } = e.target;
        setTipoInstitucion(value);
    };

    return (
        <div className="container">
            <Toast ref={toast} />
            <div className="container_register p-fluid">
                <div className="item field">
                    <label htmlFor="ruc">Ruc</label>
                    <InputText id="ruc" onChange={(e) => onInputChange(e, "ruc")} required autoFocus className={classNames({ "p-invalid ": submitted && !institucion.ruc })} />
                    {submitted && !institucion.ruc && <small className="p-invalid">Se requiere un nombre</small>}
                </div>
                <div className="item field">
                    <label htmlFor="correo">E-mail</label>
                    <InputText id="correo" type={"email"} onChange={(e) => onInputChange(e, "correo")} required autoFocus className={classNames({ "p-invalid ": submitted && !institucion.correo })} />
                    {submitted && !institucion.correo && <small className="p-invalid">Se requiere un nombre</small>}
                </div>
                <div className="item">
                    <label htmlFor="nombre">Nombre</label>
                    <InputText id="nombre" onChange={(e) => onInputChange(e, "nombre")} required autoFocus className={classNames({ "p-invalid ": submitted && !institucion.nombre })} />
                    {submitted && !institucion.nombre && <small className="p-invalid">Se requiere un nombre</small>}
                </div>
                <div className="item">
                    <label htmlFor="password">Contraseña</label>
                    <Password id="password" value={password} onChange={(e) => setPassword(e.target.value)} toggleMask required autoFocus className={classNames({ "p-invalid ": submitted && !user.password })} />
                </div>
                <div className="item">
                    <label htmlFor="password">Verificar contraseña</label>
                    <Password id="password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} toggleMask required autoFocus className={classNames({ "p-invalid ": submitted && !user.password })} />
                </div>

                <div className="item">
                    <label htmlFor="provincia">Provincia</label>
                    <Dropdown id="provincia" value={provincia} onChange={(e) => onProvinciaChange(e)} options={provincias} optionLabel="nombre" placeholder="Selecione provincia"></Dropdown>
                </div>
                <div className="item">
                    <label htmlFor="ciudad">Ciudad</label>
                    <Dropdown id="ciudad" value={ciudad} onChange={(e) => onCiudadChange(e)} options={ciudades?.filter((resp) => resp.provincia.id === provincia.id)} optionLabel="nombre" placeholder="Seleccione ciudad"></Dropdown>
                </div>
                <div className="item">
                    <label htmlFor="tipoInstitucion">Tipo Institucion</label>
                    <Dropdown id="tipoInstitucion" value={tipoInstitucion} onChange={(e) => onTipoInstitucionChange(e)} options={tiposInstituciones} optionLabel="nombre" placeholder="Seleccione tipo de institucion"></Dropdown>
                </div>
                <div className="actions">
                    <Button label="Registrarse" icon="pi pi-check" className="p-button-blue " onClick={saveUser} />
                </div>
            </div>
        </div>
    );
};

export default RegistrarInstitucion;
