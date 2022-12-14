import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { RecintoService } from "../service/RecintoService";
import { Dropdown } from "primereact/dropdown";
import { ProvinciaService } from "../service/ProvinciaService";
import { CiudadService } from "../service/CiudadService";
import { InstitucionService } from "../service/InstitucionService";
import { useHistory } from "react-router-dom";

const Recinto = () => {
    const history = useHistory();
    let emptyRecinto = {
        id: "",
        nombre: "",
        direccion: "",
        celular: "",
        ciudad: "",
        institucion: "",
    };

    const [recintos, setRecintos] = useState([]);
    const [ciudades, setCiudades] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [recintoDialog, setRecintoDialog] = useState(false);
    const [deleterecintoDialog, setDeleterecintoDialog] = useState(false);
    const [deleterecintosDialog, setDeleterecintosDialog] = useState(false);
    const [recinto, setRecinto] = useState(emptyRecinto);
    const [ciudad, setCiudad] = useState({ nombre: "" });
    const [provincia, setProvincia] = useState({ nombre: "" });
    const [selectedRecintos, setSelectedRecintos] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [institucion, setInstitucion] = useState({});
    const toast = useRef(null);
    const dt = useRef(null);

    const data = JSON.parse(window.localStorage.getItem("institucion"));

    useEffect(() => {
        if (data) {
            const recintoService = new RecintoService();
            recintoService.getRecintos(data?.ruc, setRecintos).then((res) => {
                if (res === 401) {
                    history.push("/");
                    window.localStorage.removeItem("institucion");
                }
            });
            const institucionService = new InstitucionService();
            institucionService.getInstitucion(data?.ruc, setInstitucion);
            const provinciaService = new ProvinciaService();
            provinciaService.getProvincias(setProvincias);
            const ciudadService = new CiudadService();
            ciudadService.getCiudades(setCiudades);
        } else {
            history.push("/");
        }
    }, []);

    const openNew = () => {
        setProvincia({ ...provincia, ...provincias[0] });
        setCiudad({ ...ciudad, ...ciudades.find((item) => item.provincia.id === provincias[0].id) });
        setRecinto(emptyRecinto);
        setSubmitted(false);
        setRecintoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setRecintoDialog(false);
    };

    const hideDeleterecintoDialog = () => {
        setDeleterecintoDialog(false);
    };

    const hideDeleterecintosDialog = () => {
        setDeleterecintosDialog(false);
    };

    const saveRecinto = () => {
        setSubmitted(true);
        const recintoService = new RecintoService();
        recinto.ciudad = ciudad;
        recinto.institucion = institucion;
        if (recinto.nombre.trim() && recinto.direccion.trim() && recinto.celular.trim()) {
            let _recintos = [...recintos];
            let _recinto = { ...recinto };
            if (recinto.id) {
                recintoService.updateRecinto(recinto).then((res) => {
                    if (res === 401) {
                        history.push("/");
                        window.localStorage.removeItem("institucion");
                    }
                });
                const index = findIndexById(recinto.id);
                _recintos[index] = _recinto;
                toast.current.show({ severity: "success", summary: "Successful", detail: "Recinto actualizado", life: 3000 });
                setRecintos(_recintos);
            } else {
                recintoService.postRecinto(recinto).then((res) => {
                    if (res === 401) {
                        history.push("/");
                        window.localStorage.removeItem("institucion");
                    } else {
                        _recintos.push({ ...res });
                        setRecintos(_recintos);
                    }
                });

                toast.current.show({ severity: "success", summary: "Successful", detail: "Recinto creado", life: 3000 });
            }

            setRecintoDialog(false);
            setRecinto(emptyRecinto);
        }
    };

    const editrecinto = (recinto) => {
        setRecinto({ ...recinto });
        setProvincia({ ...recinto.ciudad.provincia });
        setCiudad({ ...recinto.ciudad });
        setRecintoDialog(true);
    };

    const confirmDeleterecinto = (recinto) => {
        setRecinto(recinto);
        setDeleterecintoDialog(true);
    };

    const deleterecinto = () => {
        let _recintos;
        const object = new RecintoService();
        object.deleteRecinto(recinto.id).then((res) => {
            if (res === 500) {
                toast.current.show({ severity: "error", summary: "Error Message", detail: "Recinto no eliminado", life: 3000 });
            } else if (res === 401) {
                history.push("/");
                window.localStorage.removeItem("institucion");
            } else {
                _recintos = recintos.filter((val) => val.id !== recinto.id);
                setRecintos(_recintos);
                setRecinto(emptyRecinto);
                toast.current.show({ severity: "success", summary: "Successful", detail: "Recinto eliminado", life: 3000 });
            }
        });
        setDeleterecintoDialog(false);
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < recintos.length; i++) {
            if (recintos[i].id === id) {
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
        setDeleterecintosDialog(true);
    };

    const deleteSelectedRecintos = () => {
        const object = new RecintoService();
        let _recintos;
        selectedRecintos.map((res) =>
            object.deleteRecinto(res.id).then((res) => {
                if (res === 500) {
                    toast.current.show({ severity: "error", summary: "Error Message", detail: "Recintos no eliminados", life: 3000 });
                } else if (res === 401) {
                    history.push("/");
                    window.localStorage.removeItem("institucion");
                } else {
                    _recintos = recintos.filter((val) => !selectedRecintos.includes(val));
                    setRecintos(_recintos);
                    setDeleterecintosDialog(false);
                    setSelectedRecintos(null);
                    toast.current.show({ severity: "success", summary: "Successful", detail: "recintos eliminados", life: 3000 });
                }
            })
        );

        setDeleterecintosDialog(false);
    };

    const onNameChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _recinto = { ...recinto };
        _recinto[`${name}`] = val;

        setRecinto(_recinto);
    };
    const onDirectionChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _recinto = { ...recinto };
        _recinto[`${name}`] = val;

        setRecinto(_recinto);
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

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="Eliminar" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedRecintos || !selectedRecintos.length} />
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

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.nombre}
            </>
        );
    };

    const directionBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Direccion</span>
                {rowData.direccion}
            </>
        );
    };
    const cityBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Ciudad</span>
                {rowData.ciudad.provincia.nombre}-{rowData.ciudad.nombre} <br />
            </>
        );
    };
    const phoneBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Celular</span>
                {rowData.celular}
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editrecinto(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleterecinto(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Recintos</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const recintoDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveRecinto} />
        </>
    );
    const deleterecintoDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleterecintoDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleterecinto} />
        </>
    );
    const deleterecintosDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleterecintosDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedRecintos} />
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
                        value={recintos}
                        selection={selectedRecintos}
                        onSelectionChange={(e) => setSelectedRecintos(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} recintos"
                        globalFilter={globalFilter}
                        emptyMessage="No se encuentra ningun recinto"
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="id" header="id" sortable body={codeBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="nombre" header="Nombre" sortable body={nameBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="ciudad" header="Provincia/Ciudad" sortable body={cityBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="direccion" header="Direcci??n" sortable body={directionBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="celular" header="Celular" sortable body={phoneBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>

                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={recintoDialog} style={{ width: "450px" }} header="Recinto" modal className="p-fluid" footer={recintoDialogFooter} onHide={hideDialog}>
                        {recinto.image && <img src={`assets/demo/images/recinto/${recinto.image}`} alt={recinto.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="nombre">Nombre</label>
                            <InputText id="nombre" value={recinto.nombre} onChange={(e) => onNameChange(e, "nombre")} required autoFocus className={classNames({ "p-invalid": submitted && !recinto.nombre })} />
                            {submitted && !recinto.nombre && <small className="p-invalid">Nombre es requerido</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="direccion">Direcci??n</label>
                            <InputText id="direccion" value={recinto.direccion} onChange={(e) => onDirectionChange(e, "direccion")} required autoFocus className={classNames({ "p-invalid": submitted && !recinto.direccion })} />
                            {submitted && !recinto.direccion && <small className="p-invalid">Direccion es requerido</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="celular">Celular</label>
                            <InputText id="celular" value={recinto.celular} onChange={(e) => onDirectionChange(e, "celular")} required autoFocus className={classNames({ "p-invalid": submitted && !recinto.celular })} />
                            {submitted && !recinto.celular && <small className="p-invalid">Celular es requiredo</small>}
                        </div>
                        <div>
                            <label htmlFor="provincia">Provincia</label>
                            <Dropdown id="provincia" value={provincia} onChange={(e) => onProvinciaChange(e)} options={provincias} optionLabel="nombre" placeholder="Selecione una provincia" required autoFocus className={classNames({ "p-invalid": submitted && !provincia.nombre })} />
                            {submitted && !provincia.nombre && <small className="p-invalid">Provincia es requiredo</small>}
                        </div>
                        <div>
                            <label htmlFor="ciudad">Ciudad</label>
                            <Dropdown
                                id="ciudad"
                                value={ciudad}
                                name={"ciudad"}
                                onChange={(e) => onCiudadChange(e)}
                                options={ciudades?.filter((resp) => resp.provincia.id === provincia.id)}
                                optionLabel="nombre"
                                placeholder="Seleccione una ciudad"
                                required
                                autoFocus
                                className={classNames({ "p-invalid": submitted && !ciudad.nombre })}
                            />
                            {submitted && !ciudad.nombre && <small className="p-invalid">Ciudad es requerido</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleterecintoDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleterecintoDialogFooter} onHide={hideDeleterecintoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {recinto && (
                                <span>
                                    ??Est?? seguro que desea eliminar el recinto seleccionado? <b>{recinto.name}</b>
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleterecintosDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleterecintosDialogFooter} onHide={hideDeleterecintosDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {recinto && <span>??Est?? seguro que desea eliminar los recintos seleccionados?</span>}
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

export default React.memo(Recinto, comparisonFn);
