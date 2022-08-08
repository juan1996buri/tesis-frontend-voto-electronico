import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { createCiudad, eliminarCiudad, getCiudades, updateCiudad } from "../service/CiudadService";
import { getProvincias } from "../service/ProvinciaService";
import { Dropdown } from "primereact/dropdown";
const Ciudad = () => {
    let emptyCiudad = {
        id: "",
        nombre: "",
        provincia: "",
    };

    const [ciudades, setCiudades] = useState([]);
    const [provincias, setProvincias] = useState(null);
    const [ciudadDialog, setCiudadDialog] = useState(false);
    const [deleteciudadDialog, setDeleteCiudadDialog] = useState(false);
    const [deleteciudadesDialog, setDeleteCiudadesDialog] = useState(false);
    const [ciudad, setCiudad] = useState(emptyCiudad);
    const [provincia, setProvincia] = useState({});
    const [selectedciudades, setselectedCiudades] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [submittedProvincia, setSubmittedProvincia] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        getCiudades(setCiudades);
        getProvincias(setProvincias);
    }, []);

    const openNew = () => {
        setCiudad(emptyCiudad);
        setProvincia({});
        setSubmitted(false);
        setSubmittedProvincia(false);
        setCiudadDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setSubmittedProvincia(false);
        setCiudadDialog(false);
    };

    const hideDeleteciudadDialog = () => {
        setDeleteCiudadDialog(false);
    };

    const hideDeleteCiudadesDialog = () => {
        setDeleteCiudadesDialog(false);
    };

    const saveCiudad = () => {
        setSubmitted(true);
        setSubmittedProvincia(true);

        if (ciudad.nombre.trim()) {
            ciudad.provincia = provincia;
            let _ciudades = [...ciudades];
            let _ciudad = { ...ciudad };
            if (ciudad.id) {
                updateCiudad(ciudad);
                const index = findIndexById(ciudad.id);
                _ciudades[index] = _ciudad;
                toast.current.show({ severity: "success", summary: "Successful", detail: "ciudad Updated", life: 3000 });
            } else {
                createCiudad(ciudad);
                _ciudades.push(_ciudad);
                toast.current.show({ severity: "success", summary: "Successful", detail: "ciudad Created", life: 3000 });
                window.location.reload();
            }
            setCiudades(_ciudades);
            setCiudadDialog(false);
            setCiudad(emptyCiudad);
        }
    };

    const editCiudad = (ciudad) => {
        setProvincia({ ...ciudad.provincia });
        setCiudad({ ...ciudad });
        setCiudadDialog(true);
    };

    const confirmdeleteCiudad = (ciudad) => {
        setCiudad(ciudad);
        setDeleteCiudadDialog(true);
    };

    const deleteCiudad = () => {
        eliminarCiudad(ciudad.id);
        let _ciudades = ciudades.filter((val) => val.id !== ciudad.id);
        setCiudades(_ciudades);
        setDeleteCiudadDialog(false);
        setCiudad(emptyCiudad);
        toast.current.show({ severity: "success", summary: "Successful", detail: "ciudad Deleted", life: 3000 });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < ciudades.length; i++) {
            if (ciudades[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const deleteselectedCiudad = () => {
        let _ciudades = ciudades.filter((val) => !selectedciudades.includes(val));
        setCiudades(_ciudades);
        setDeleteCiudadesDialog(false);
        setselectedCiudades(null);
        toast.current.show({ severity: "success", summary: "Successful", detail: "ciudades Deleted", life: 3000 });
    };

    const onInputChange = (e, nombre) => {
        const val = (e.target && e.target.value) || "";
        let _ciudad = { ...ciudad };
        _ciudad[`${nombre}`] = val;

        setCiudad(_ciudad);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                </div>
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id}
            </>
        );
    };

    const nombreBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.nombre}
            </>
        );
    };

    const provinciaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Provincia</span>
                {rowData.provincia.nombre}
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editCiudad(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmdeleteCiudad(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Ciudad</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const ciudadDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveCiudad} />
        </>
    );
    const deleteciudadDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteciudadDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteCiudad} />
        </>
    );
    const deleteciudadesDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteCiudadesDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteselectedCiudad} />
        </>
    );

    const onProvinciaChange = (e) => {
        setProvincia(e.value);
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={ciudades}
                        selection={selectedciudades}
                        onSelectionChange={(e) => setselectedCiudades(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} ciudades"
                        globalFilter={globalFilter}
                        emptyMessage="No ciudades found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column field="id" header="Id" sortable body={idBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="nombre" header="Nombre" sortable body={nombreBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="provincia" header="Provincia" sortable body={provinciaBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={ciudadDialog} style={{ width: "450px" }} header="Ciudad" modal className="p-fluid" footer={ciudadDialogFooter} onHide={hideDialog}>
                        {ciudad.image && <img src={`assets/demo/images/provincia/${ciudad.image}`} alt={ciudad.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="name">Nombre</label>
                            <InputText id="name" value={ciudad.nombre} onChange={(e) => onInputChange(e, "nombre")} required autoFocus className={classNames({ "p-invalid": submitted && !ciudad.name })} />
                            {submitted && !ciudad.name && <small className="p-invalid">Se requiere un nombre </small>}
                        </div>
                        <div>
                            <Dropdown id="name" value={provincia} required options={provincias} onChange={onProvinciaChange} optionLabel="nombre" placeholder="Select a City" className={classNames({ "p-invalid": submittedProvincia && !provincia.name })} />
                            {submittedProvincia && !provincia.name && <small className="p-invalid">Se requiere un nombre </small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteciudadDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteciudadDialogFooter} onHide={hideDeleteciudadDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {ciudad && (
                                <span>
                                    ¿Estás segura de que quieres eliminar?<b>{ciudad.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteciudadesDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteciudadesDialogFooter} onHide={hideDeleteCiudadesDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {ciudad && <span>Are you sure you want to delete the selected ciudades?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Ciudad, comparisonFn);
