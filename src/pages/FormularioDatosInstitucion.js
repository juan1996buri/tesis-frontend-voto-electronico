import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useLocation } from "react-router-dom";
import { TipoInstitucionService } from "../service/TipoInstitucionService";
import { Dropdown } from "primereact/dropdown";
import { CiudadService } from "../service/CiudadService";
import { ProvinciaService } from "../service/ProvinciaService";
import { classNames } from "primereact/utils";
import { InstitucionService } from "../service/InstitucionService";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import { Image } from "primereact/image";

const FormularioDatosInstitucion = () => {
    const [institucion, setInstitucion] = useState({});
    const [tipoInstitucion, setTipoInstitucion] = useState({});
    const [tipoInstituciones, setTipoInstituciones] = useState([]);
    const [ciudad, setCiudad] = useState({});
    const [ciudades, setCiudades] = useState([]);
    const [provincia, setProvincia] = useState({});
    const [provincias, setProvincias] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [logo, setLogo] = useState("");
    const toast = useRef(null);

    const data = JSON.parse(window.localStorage.getItem("institucion"));

    useEffect(() => {
        const institucionService = new InstitucionService();
        institucionService.getInstitucion(data.ruc, setInstitucion).then((resp) => {
            setProvincia(resp.ciudad.provincia);
            setCiudad(resp.ciudad);
            setTipoInstitucion(resp.tipoInstitucion);
        });
        const tipoInstitucionService = new TipoInstitucionService();
        tipoInstitucionService.getTiposInstituciones(setTipoInstituciones);
        const provinciaService = new ProvinciaService();
        provinciaService.getProvincias(setProvincias);
        const ciudadService = new CiudadService();
        ciudadService.getCiudades(setCiudades);
    }, []);

    const onNameChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _institucion = { ...institucion };
        _institucion[`${name}`] = val;
        setInstitucion(_institucion);
    };
    const onTipoInstitucionChange = (e) => {
        const { name, value } = e.target;
        setTipoInstitucion(value);
        setInstitucion({ ...institucion, [name]: value });
    };
    const onProvinciaChange = (e) => {
        setProvincia(e.value);
        setCiudad(ciudades.find((item) => item.provincia.id === e.value.id));
        const object = new CiudadService();
        object.getCiudades(setCiudades);
    };
    const onCiudadChange = (e) => {
        setCiudad(e.value);
    };
    const savegrupo = () => {
        setSubmitted(true);
        if (institucion.id) {
            institucion.ciudad = ciudad;
            institucion.ciudad.provincia = provincia;
            institucion.logo = logo;
            const object = new InstitucionService();
            object.updateInstitucion(institucion);

            toast.current.show({ severity: "success", summary: "Successful", detail: "Institucion actualizado", life: 3000 });
        }
    };

    const onUpload = async (e) => {
        //e.options.props.customUpload = false;
        const file = e.files[0];
        const reader = new FileReader();

        let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
            const base64data = reader.result;
            setLogo(base64data);
        };
        toast.current.show({ severity: "info", summary: "Success", detail: "Imagen cargada" });
    };

    const onCancel = () => {
        setLogo("");
    };

    return (
        <div className="grid">
            <div className="col-12 md:col-6">
                <div className="card p-fluid">
                    <Toast ref={toast} />
                    <h5>Datos de la institución</h5>
                    <div className="field">
                        <label htmlFor="ruc">Ruc</label>
                        <br />
                        <label>{institucion?.ruc}</label>
                    </div>
                    <div className="field">
                        <label htmlFor="correo">Email</label>
                        <InputText id="nombre" value={institucion?.correo} type="text" onChange={(e) => onNameChange(e, "correo")} required autoFocus className={classNames({ "p-invalid": submitted && !institucion.correo })} />
                        {submitted && !institucion && <small className="p-invalid">Email es requerido</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="nombre">Nombre</label>
                        <InputText id="nombre" value={institucion?.nombre} type="text" onChange={(e) => onNameChange(e, "nombre")} required autoFocus className={classNames({ "p-invalid": submitted && !institucion.nombre })} />
                        {submitted && !institucion.nombre && <small className="p-invalid">Nombre es requerido</small>}
                    </div>
                    <div className="field">
                        <Image src={logo === "" ? institucion?.logo : logo} alt="Image Text" width="400px" />
                    </div>
                    <div className="field">
                        <FileUpload name="image" accept="image/*" customUpload={true} chooseLabel={"Cargar"} uploadLabel={"Subir"} cancelLabel={"cancelar"} uploadHandler={onUpload} maxFileSize={1000000} onClear={onCancel} onRemove={onCancel} emptyTemplate={<p className="m-0"></p>} />
                    </div>

                    <div className="field">
                        <label htmlFor="telefono">Telefono</label>
                        <InputText id="telefono" value={institucion?.telefono} type="text" onChange={(e) => onNameChange(e, "telefono")} required autoFocus className={classNames({ "p-invalid": submitted && !institucion.telefono })} />
                        {submitted && !institucion.telefono && <small className="p-invalid">Telefono es requerido</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="direccion">Direccion</label>
                        <InputText id="direccion" value={institucion?.direccion} type="text" onChange={(e) => onNameChange(e, "direccion")} required autoFocus className={classNames({ "p-invalid": submitted && !institucion.direccion })} />
                        {submitted && !institucion.direccion && <small className="p-invalid">Direccion es requerido</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="tipoInsitucion">Tipo de institucion</label>
                        <Dropdown id="tipoInsitucion" value={tipoInstitucion} onChange={onTipoInstitucionChange} name="tipoInstitucion" options={tipoInstituciones} optionLabel="nombre" placeholder="seleccionar tipo de institucion"></Dropdown>
                    </div>
                    <div>
                        <label htmlFor="provincia">Provincia</label>
                        <Dropdown id="provincia" value={provincia} onChange={(e) => onProvinciaChange(e)} options={provincias} optionLabel="nombre" placeholder="Selecione provincia"></Dropdown>
                    </div>
                    <div>
                        <label htmlFor="ciudad">Ciudad</label>
                        <Dropdown id="ciudad" value={ciudad} onChange={(e) => onCiudadChange(e)} options={ciudades?.filter((resp) => resp.provincia.id === provincia.id)} optionLabel="nombre" placeholder="Seleccione ciudad"></Dropdown>
                    </div>
                    <Button label="ACTUALIZAR" onClick={savegrupo}></Button>
                </div>
            </div>
        </div>
    );
};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(FormularioDatosInstitucion, comparisonFn);
