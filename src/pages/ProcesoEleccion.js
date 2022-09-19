import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useHistory } from "react-router-dom";
import { FileUpload } from "primereact/fileupload";
import { Dropdown } from "primereact/dropdown";
import { ProcesoEleccionService } from "../service/ProcesoEleccionService";
import { DateTimePicker } from "@mui/x-date-pickers";
import { TextField } from "@mui/material";
import moment from "moment";
import { InstitucionService } from "../service/InstitucionService";
import { InputSwitch } from "primereact/inputswitch";

const ProcesoEleccion = () => {
    const history = useHistory();
    let emptyprocesoEleccion = {
        id: "",
        nombre: "",
        activo: false,
    };

    const [procesoElecciones, setProcesoElecciones] = useState([]);
    const [procesoEleccionDialog, setProcesoEleccionDialog] = useState(false);
    const [institucion, setInstitucion] = useState({});
    const [deleteProcesoEleccionDialog, setDeleteProcesoEleccionDialog] = useState(false);
    const [deleteProcesoEleccionesDialog, setDeleteProcesoEleccionesDialog] = useState(false);
    const [procesoEleccion, setProcesoEleccion] = useState(emptyprocesoEleccion);
    const [selectedProcesoElecciones, setSelectedProcesoElecciones] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [fechaInicio, setFechaInicio] = useState(new Date());
    const [activo, setActivo] = useState(false);

    const [fechaFinal, setFechaFinal] = useState(new Date());
    const toast = useRef(null);
    const dt = useRef(null);

    const data = JSON.parse(window.localStorage.getItem("institucion"));
    useEffect(() => {
        if (data) {
            const procesoEleccioneservice = new ProcesoEleccionService();
            procesoEleccioneservice.getProcesosElecciones(data.ruc, setProcesoElecciones).then((res) => {
                if (res === 401) {
                    window.localStorage.removeItem("institucion");
                    history.push("/");
                }
            });
            const institucionService = new InstitucionService();
            institucionService.getInstitucion(data.ruc, setInstitucion);
        } else {
            history.push("/");
        }
    }, []);

    const openNew = () => {
        setProcesoEleccion(emptyprocesoEleccion);
        setSubmitted(false);
        setProcesoEleccionDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProcesoEleccionDialog(false);
    };

    const hideDeleteProcesoEleccionDialog = () => {
        setDeleteProcesoEleccionDialog(false);
    };

    const hideDeleteProcesoEleccionesDialog = () => {
        setDeleteProcesoEleccionesDialog(false);
    };

    const saveprocesoEleccion = () => {
        setSubmitted(true);

        const procesoEleccioneservice = new ProcesoEleccionService();
        const FI = moment(fechaInicio).format("YYYY-MM-DDTHH:mm:ss").toString();
        const FF = moment(fechaFinal).format("YYYY-MM-DDTHH:mm:ss").toString();

        procesoEleccion.fechainicio = FI;
        procesoEleccion.fechafinal = FF;
        procesoEleccion.institucion = institucion;
        procesoEleccion.activo = activo;

        if (procesoEleccion.nombre.trim()) {
            let _procesoElecciones = [...procesoElecciones];
            let _procesoEleccion = { ...procesoEleccion };
            if (procesoEleccion.id) {
                procesoEleccioneservice.updateProcesoEleccion(procesoEleccion).then((res) => {
                    if (res === 401) {
                        window.localStorage.removeItem("institucion");
                        history.push("/");
                    }
                });
                const index = findIndexById(procesoEleccion.id);
                _procesoElecciones[index] = _procesoEleccion;
                toast.current.show({ severity: "success", summary: "Successful", detail: "procesoEleccion Updated", life: 3000 });
                setProcesoElecciones(_procesoElecciones);
            } else {
                procesoEleccioneservice.postProcesoEleccion(procesoEleccion).then((res) => {
                    if (res === 401) {
                        window.localStorage.removeItem("institucion");
                        history.push("/");
                    } else {
                        _procesoElecciones.push({ ...res });
                        setProcesoElecciones(_procesoElecciones);
                    }
                });

                toast.current.show({ severity: "success", summary: "Successful", detail: "procesoEleccion Created", life: 3000 });
            }

            setProcesoEleccionDialog(false);
            setProcesoEleccion(emptyprocesoEleccion);
        }
    };

    const editProcesoEleccion = (procesoEleccion) => {
        setActivo(procesoEleccion.activo);
        setFechaInicio(procesoEleccion.fechainicio);
        setProcesoEleccion({ ...procesoEleccion });
        setProcesoEleccionDialog(true);
    };

    const confirmDeleteProcesoEleccion = (procesoEleccion) => {
        setProcesoEleccion(procesoEleccion);
        setDeleteProcesoEleccionDialog(true);
    };

    const deleteProcesoEleccion = () => {
        const procesoEleccioneservice = new ProcesoEleccionService();
        let _procesoElecciones;
        procesoEleccioneservice.deleteProcesoEleccion(procesoEleccion.id).then((res) => {
            if (res === 500) {
                toast.current.show({ severity: "error", summary: "Error Message", detail: "proceso de elección no eliminada", life: 3000 });
            } else if (res === 401) {
                history.push("/");
                window.localStorage.removeItem("institucion");
            } else {
                _procesoElecciones = procesoElecciones.filter((val) => val.id !== procesoEleccion.id);
                setProcesoElecciones(_procesoElecciones);
                setProcesoEleccion(emptyprocesoEleccion);
                toast.current.show({ severity: "success", summary: "Successful", detail: "proceso de eleccion no eliminada", life: 3000 });
            }
        });
        setDeleteProcesoEleccionDialog(false);
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < procesoElecciones.length; i++) {
            if (procesoElecciones[i].id === id) {
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
        setDeleteProcesoEleccionesDialog(true);
    };

    const deleteSelectedProcesoElecciones = () => {
        const procesoEleccioneservice = new ProcesoEleccionService();
        let _procesoElecciones;
        selectedProcesoElecciones.map((res) =>
            procesoEleccioneservice.deleteProcesoEleccion(res.id).then((res) => {
                if (res === 500) {
                    toast.current.show({ severity: "error", summary: "Error Message", detail: "procesoElecciones no eliminadas", life: 3000 });
                } else if (res === 401) {
                    window.localStorage.removeItem("institucion");
                    history.push("/");
                } else {
                    _procesoElecciones = procesoElecciones.filter((val) => !selectedProcesoElecciones.includes(val));
                    setProcesoElecciones(_procesoElecciones);
                    setSelectedProcesoElecciones(null);
                    toast.current.show({ severity: "success", summary: "Successful", detail: "procesoElecciones eliminadas", life: 3000 });
                }
            })
        );
        setDeleteProcesoEleccionesDialog(false);
    };

    const onNameChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _procesoEleccion = { ...procesoEleccion };
        _procesoEleccion[`${name}`] = val;

        setProcesoEleccion(_procesoEleccion);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedProcesoElecciones || !selectedProcesoElecciones.length} />
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

    const nombreBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.nombre}
            </>
        );
    };
    const fechaInicioBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.fechainicio}
            </>
        );
    };
    const fechaFinBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">FechaFin</span>
                {rowData.fechafinal}
            </>
        );
    };

    const activoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Estado</span>
                {rowData.activo ? <span style={{ backgroundColor: "green", borderRadius: "1rem", padding: "1rem", color: "white" }}>Activado</span> : <span style={{ backgroundColor: "red", borderRadius: "1rem", padding: "1rem", color: "white" }}>Desactivado</span>}
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProcesoEleccion(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteProcesoEleccion(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage procesoElecciones</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const procesoEleccionDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveprocesoEleccion} />
        </>
    );
    const deleteProcesoEleccionDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProcesoEleccionDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProcesoEleccion} />
        </>
    );
    const deleteProcesoEleccionesDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProcesoEleccionesDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProcesoElecciones} />
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
                        value={procesoElecciones}
                        selection={selectedProcesoElecciones}
                        onSelectionChange={(e) => setSelectedProcesoElecciones(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} procesoElecciones"
                        globalFilter={globalFilter}
                        emptyMessage="No procesoElecciones found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="id" header="id" sortable body={codeBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="nombre" header="Nombre" sortable body={nombreBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="fechaInicio" header="Fecha Inicio" sortable body={fechaInicioBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="fechaFin" header="Fecha Fin" sortable body={fechaFinBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="estado" header="Estado" sortable body={activoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>

                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={procesoEleccionDialog} style={{ width: "450px" }} header="Proceso Elección" modal className="p-fluid" footer={procesoEleccionDialogFooter} onHide={hideDialog}>
                        {procesoEleccion.image && <img src={`assets/demo/images/procesoEleccion/${procesoEleccion.image}`} alt={procesoEleccion.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="nombre">Nombre</label>
                            <InputText id="nombre" value={procesoEleccion.nombre} onChange={(e) => onNameChange(e, "nombre")} required autoFocus className={classNames({ "p-invalid": submitted && !procesoEleccion.nombre })} />
                            {submitted && !procesoEleccion.nombre && <small className="p-invalid">Nombre es requerido</small>}
                        </div>
                        <div className="field" style={{ display: "flex", flexDirection: "column" }}>
                            <label htmlFor="fechaInicio">Fecha inicio</label>
                            <DateTimePicker
                                label="fecha hora"
                                value={fechaInicio}
                                onChange={(newValue) => {
                                    setFechaInicio(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </div>
                        <div className="field" style={{ display: "flex", flexDirection: "column" }}>
                            <label htmlFor="fechaInicio">Fecha fin</label>
                            <DateTimePicker
                                label="fecha-hora"
                                value={fechaFinal}
                                onChange={(newValue) => {
                                    setFechaFinal(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </div>
                        <InputSwitch checked={activo} onChange={(e) => setActivo(e.value)} color="primary" name="status" />
                    </Dialog>

                    <Dialog visible={deleteProcesoEleccionDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProcesoEleccionDialogFooter} onHide={hideDeleteProcesoEleccionDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {procesoEleccion && (
                                <span>
                                    ¿Está seguro que desea eliminar este proceso de elección? <b>{procesoEleccion.name}</b>
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProcesoEleccionesDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProcesoEleccionesDialogFooter} onHide={hideDeleteProcesoEleccionesDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {procesoEleccion && <span>¿Está seguro que desea eliminar los procesos de elecciones seleccionadas?</span>}
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

export default React.memo(ProcesoEleccion, comparisonFn);
