import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

import { Dropdown } from "primereact/dropdown";
import { useHistory } from "react-router-dom";
import { CiudadService } from "../service/CiudadService";
import { FileUpload } from "primereact/fileupload";
import { ProvinciaService } from "../service/ProvinciaService";

const Ciudad = () => {
    const history = useHistory();
    let emptyciudad = {
        id: "",
        nombre: "",
        provincia: "",
    };

    const [ciudades, setCiudades] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [provincia, setProvincia] = useState({ nombre: "" });
    const [ciudadDialog, setCiudadDialog] = useState(false);
    const [deleteciudadDialog, setDeleteciudadDialog] = useState(false);
    const [deleteciudadesDialog, setDeleteciudadesDialog] = useState(false);
    const [ciudad, setCiudad] = useState(emptyciudad);
    const [selectedciudades, setSelectedciudades] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    const data = JSON.parse(window.localStorage.getItem("institucion"));
    useEffect(() => {
        if (data) {
            const ciudadeservice = new CiudadService();
            ciudadeservice.getCiudades(setCiudades).then((res) => {
                if (res === 401) {
                    window.localStorage.removeItem("institucion");
                    history.push("/");
                }
            });
            const provinciaService = new ProvinciaService();
            provinciaService.getProvincias(setProvincias);
        } else {
            history.push("/");
        }
    }, []);

    const openNew = () => {
        setProvincia({ ...provincias[0] });
        setCiudad(emptyciudad);
        setSubmitted(false);
        setCiudadDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setCiudadDialog(false);
    };

    const hideDeleteciudadDialog = () => {
        setDeleteciudadDialog(false);
    };

    const hideDeleteciudadesDialog = () => {
        setDeleteciudadesDialog(false);
    };

    const saveciudad = () => {
        setSubmitted(true);

        const ciudadeservice = new CiudadService();

        if (ciudad.nombre.trim() && provincia.nombre.trim()) {
            ciudad.provincia = provincia;
            let _ciudades = [...ciudades];
            let _ciudad = { ...ciudad };
            if (ciudad.id) {
                ciudadeservice.updateCiudad(ciudad).then((res) => {
                    if (res === 401) {
                        window.localStorage.removeItem("institucion");
                        history.push("/");
                    }
                });
                const index = findIndexById(ciudad.id);
                _ciudades[index] = _ciudad;
                toast.current.show({ severity: "success", summary: "Successful", detail: "ciudad Updated", life: 3000 });
                setCiudades(_ciudades);
            } else {
                ciudadeservice.postCiudad(ciudad).then((res) => {
                    if (res === 401) {
                        window.localStorage.removeItem("institucion");
                        history.push("/");
                    } else {
                        _ciudades.push({ ...res });
                        setCiudades(_ciudades);
                    }
                });

                toast.current.show({ severity: "success", summary: "Successful", detail: "ciudad Created", life: 3000 });
            }

            setCiudadDialog(false);
            setCiudad(emptyciudad);
        }
    };

    const editciudad = (ciudad) => {
        setCiudad({ ...ciudad });
        setCiudadDialog(true);
    };

    const confirmDeleteciudad = (ciudad) => {
        setCiudad(ciudad);
        setDeleteciudadDialog(true);
    };

    const deleteciudad = () => {
        const ciudadeservice = new CiudadService();
        let _ciudades;
        ciudadeservice.deleteCiudad(ciudad.id).then((res) => {
            if (res === 500) {
                toast.current.show({ severity: "error", summary: "Error Message", detail: "ciudad no eliminada", life: 3000 });
            } else if (res === 401) {
                history.push("/");
                window.localStorage.removeItem("institucion");
            } else {
                _ciudades = ciudades.filter((val) => val.id !== ciudad.id);
                setCiudades(_ciudades);
                setCiudad(emptyciudad);
                toast.current.show({ severity: "success", summary: "Successful", detail: "ciudad eliminada", life: 3000 });
            }
        });
        setDeleteciudadDialog(false);
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

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteciudadesDialog(true);
    };

    const deleteSelectedciudades = () => {
        const ciudadeservice = new CiudadService();
        let _ciudades;
        selectedciudades.map((res) =>
            ciudadeservice.deleteCiudad(res.id).then((res) => {
                if (res === 500) {
                    toast.current.show({ severity: "error", summary: "Error Message", detail: "ciudades no eliminadas", life: 3000 });
                } else if (res === 401) {
                    window.localStorage.removeItem("institucion");
                    history.push("/");
                } else {
                    _ciudades = ciudades.filter((val) => !selectedciudades.includes(val));
                    setCiudades(_ciudades);
                    setSelectedciudades(null);
                    toast.current.show({ severity: "success", summary: "Successful", detail: "ciudades eliminadas", life: 3000 });
                }
            })
        );
        setDeleteciudadesDialog(false);
    };

    const onNameChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _ciudad = { ...ciudad };
        _ciudad[`${name}`] = val;

        setCiudad(_ciudad);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedciudades || !selectedciudades.length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const codeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id}
            </>
        );
    };

    const onProvinciaChange = (e) => {
        setProvincia(e.value);
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
                <span className="p-column-title">Nombre</span>
                {rowData.provincia.nombre}
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editciudad(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteciudad(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Administrador de ciudades</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const ciudadDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveciudad} />
        </>
    );
    const deleteciudadDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteciudadDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteciudad} />
        </>
    );
    const deleteciudadesDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteciudadesDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedciudades} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={ciudades}
                        selection={selectedciudades}
                        onSelectionChange={(e) => setSelectedciudades(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} ciudades"
                        globalFilter={globalFilter}
                        emptyMessage="No se encuentran ciudades"
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="id" header="id" sortable body={codeBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="nombre" header="Nombre" sortable body={nombreBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="provincia" header="Provincia" sortable body={provinciaBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>

                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={ciudadDialog} style={{ width: "450px" }} header="ciudad" modal className="p-fluid" footer={ciudadDialogFooter} onHide={hideDialog}>
                        {ciudad.image && <img src={`assets/demo/images/ciudad/${ciudad.image}`} alt={ciudad.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="nombre">Nombre</label>
                            <InputText id="nombre" value={ciudad.nombre} onChange={(e) => onNameChange(e, "nombre")} required autoFocus className={classNames({ "p-invalid": submitted && !ciudad.nombre })} />
                            {submitted && !ciudad.nombre && <small className="p-invalid">Numero es requerido</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="provincia">Provincia</label>
                            <Dropdown
                                id="provincia"
                                name="provincia"
                                value={provincia}
                                onChange={(e) => onProvinciaChange(e)}
                                options={provincias}
                                optionLabel="nombre"
                                placeholder="Seleccione una provincia"
                                required
                                autoFocus
                                className={classNames({ "p-invalid": submitted && !provincia.nombre })}
                            />
                            {submitted && !provincia.nombre && <small className="p-invalid">provincia es requerido</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteciudadDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteciudadDialogFooter} onHide={hideDeleteciudadDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {ciudad && (
                                <span>
                                    ¿Está seguro que desea eliminar esta ciudad? <b>{ciudad.name}</b>
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteciudadesDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteciudadesDialogFooter} onHide={hideDeleteciudadesDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {ciudad && <span>¿Está seguro que desea eliminar las ciudades seleccionadas?</span>}
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
