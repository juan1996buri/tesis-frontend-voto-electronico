import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useLocation } from "react-router-dom";
import { TipoInstitucionService } from "../service/TipoInstitucionService";
import { Dropdown } from "primereact/dropdown";
import { CiudadService } from "../service/CiudadService";
import { ProvinciaService } from "../service/ProvinciaService";

const FormularioDatosInstitucion = () => {
    const ubication = useLocation().state;
    const [institucion, setInstitucion] = useState({});
    const [tipoInstitucion, setTipoInstitucion] = useState({});
    const [tipoInstituciones, setTipoInstituciones] = useState([]);
    const [ciudad, setCiudad] = useState({});
    const [ciudades, setCiudades] = useState([]);
    const [provincia, setProvincia] = useState({});
    const [provincias, setProvincias] = useState([]);
    useEffect(() => {
        if (ubication) {
            setInstitucion({ ...ubication });
            setTipoInstitucion({ ...ubication.tipoinstitucion });
            const tipoInstitucionService = new TipoInstitucionService();
            tipoInstitucionService.getTiposInstituciones(setTipoInstituciones);

            const provincia = new ProvinciaService();
            provincia.getProvincias(setProvincias);
            const ciudad = new CiudadService();
            ciudad.getCiudades(setCiudades);
            setProvincia(ubication.ciudad.provincia);
            setCiudad(ubication.ciudad);
        }
    }, []);
    const onNameChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _institucion = { ...institucion };
        _institucion[`${name}`] = val;
        setInstitucion(_institucion);
    };
    const onTipoInstitucionChange = (e) => {
        setTipoInstitucion(e.value);
    };
    const onProvinciaChange = (e) => {
        const id = e.value.id;
        setProvincia(e.value);
        setCiudad(ciudades.find((item) => item.provincia.id === e.value.id));
        const object = new CiudadService();
        object.getCiudades(setCiudades);
        //getCiudades(setCiudades, id);

        //setCiudades(ciudades.filter((item) => item.provincia.id === id));
    };
    const onCiudadChange = (e) => {
        setCiudad(e.value);
    };
    return (
        <div className="grid">
            <div className="col-12 md:col-6">
                <div className="card p-fluid">
                    <h5>Datos de la institución</h5>
                    <div className="field">
                        <label htmlFor="ruc">Ruc</label>
                        <br />
                        <label>{institucion?.ruc}</label>
                    </div>
                    <div className="field">
                        <label htmlFor="correo">Email</label>
                        <InputText id="nombre" value={institucion?.correo} type="text" onChange={(e) => onNameChange(e, "correo")} />
                    </div>

                    <div className="field">
                        <label htmlFor="nombre">Nombre</label>
                        <InputText id="nombre" value={institucion?.nombre} type="text" onChange={(e) => onNameChange(e, "nombre")} />
                    </div>
                    <div className="field">
                        <label htmlFor="telefono">Telefono</label>
                        <InputText id="telefono" value={institucion?.telefono} type="text" onChange={(e) => onNameChange(e, "telefono")} />
                    </div>
                    <div className="field">
                        <label htmlFor="direccion">Direcion</label>
                        <InputText id="direccion" value={institucion?.direccion} type="text" onChange={(e) => onNameChange(e, "direccion")} />
                    </div>
                    <div className="field">
                        <label htmlFor="tipoInsitucion">Tipo de institucion</label>
                        <Dropdown id="tipoInsitucion" value={tipoInstitucion} onChange={(e) => onTipoInstitucionChange(e)} options={tipoInstituciones} optionLabel="nombre" placeholder="seleccionar tipo de institucion"></Dropdown>
                    </div>
                    <div>
                        <label htmlFor="provincia">Provincia</label>
                        <Dropdown id="provincia" value={provincia} onChange={(e) => onProvinciaChange(e)} options={provincias} optionLabel="nombre" placeholder="Selecione provincia"></Dropdown>
                    </div>
                    <div>
                        <label htmlFor="ciudad">Ciudad</label>
                        <Dropdown id="ciudad" value={ciudad} onChange={(e) => onCiudadChange(e)} options={ciudades?.filter((resp) => resp.provincia.id === provincia.id)} optionLabel="nombre" placeholder="Seleccione ciudad"></Dropdown>
                    </div>
                    <Button label="ACTUALIZAR"></Button>
                </div>
            </div>

            <div className="col-12 md:col-6">
                <div className="card p-fluid">
                    <h5>Horizontal</h5>
                    <div className="field grid">
                        <label htmlFor="name3" className="col-12 mb-2 md:col-2 md:mb-0">
                            Name
                        </label>
                        <div className="col-12 md:col-10">
                            <InputText id="name3" type="text" />
                        </div>
                    </div>
                    <div className="field grid">
                        <label htmlFor="email3" className="col-12 mb-2 md:col-2 md:mb-0">
                            Email
                        </label>
                        <div className="col-12 md:col-10">
                            <InputText id="email3" type="text" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(FormularioDatosInstitucion, comparisonFn);
