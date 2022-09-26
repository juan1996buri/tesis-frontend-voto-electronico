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
import { VotanteService } from "../service/VotanteService";
import { GrupoService } from "../service/GrupoService";
import { SexoService } from "../service/SexoService";
import { InputSwitch } from "primereact/inputswitch";
import { InstitucionService } from "../service/InstitucionService";

const Votante = () => {
    const history = useHistory();
    let emptyvotante = {
        activo: "",
        apellido: "",
        cedula: "",
        celular: "",
        codigo: "",
        correo: "",
        grupo: "",
        id: "",
        institucion: "",
        nombre: "",
        sexo: "",
    };

    const [votantes, setVotantes] = useState([]);
    const [grupo, setGrupo] = useState({ nombre: "" });
    const [institucion, setInstitucion] = useState({});
    const [grupos, setGrupos] = useState([]);
    const [sexo, setSexo] = useState({ nombre: "" });
    const [sexos, setSexos] = useState([]);
    const [codigo, setCodigo] = useState("");
    const [votanteDialog, setVotanteDialog] = useState(false);
    const [deleteVotanteDialog, setDeleteVotanteDialog] = useState(false);
    const [deleteVotantesDialog, setDeleteVotantesDialog] = useState(false);
    const [votante, setVotante] = useState(emptyvotante);
    const [selectedvotantes, setSelectedvotantes] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [activo, setActivo] = useState(false);
    const [activeCedula, setActiveCedula] = useState(true);
    const toast = useRef(null);
    const dt = useRef(null);

    const data = JSON.parse(window.localStorage.getItem("institucion"));
    useEffect(() => {
        if (data) {
            const votanteService = new VotanteService();
            votanteService.getVotantes(data.ruc, setVotantes).then((res) => {
                if (res === 401) {
                    window.localStorage.removeItem("institucion");
                    history.push("/");
                }
            });
            const institucionService = new InstitucionService();
            institucionService.getInstitucion(data.ruc, setInstitucion);
            const grupoService = new GrupoService();
            grupoService.getGrupos(data.ruc, setGrupos);
            const sexoService = new SexoService();
            sexoService.getSexos(setSexos);
        } else {
            history.push("/");
        }
    }, []);

    const openNew = () => {
        handleCodigo();
        setActiveCedula(true);
        setGrupo({ ...grupo, ...grupos[0] });
        setSexo({ ...sexo, ...sexos[0] });
        setVotante(emptyvotante);
        setSubmitted(false);
        setVotanteDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setVotanteDialog(false);
    };

    const hideDeleteVotanteDialog = () => {
        setDeleteVotanteDialog(false);
    };

    const hideDeleteVotantesDialog = () => {
        setDeleteVotantesDialog(false);
    };

    const savevotante = () => {
        setSubmitted(true);

        const votanteService = new VotanteService();
        votante.institucion = institucion;
        votante.activo = activo;
        votante.grupo = grupo;
        votante.sexo = sexo;
        votante.codigo = codigo;

        if (votante.nombre.trim() && votante.apellido.trim() && grupo.nombre.trim() && sexo.nombre.trim()) {
            let _votantes = [...votantes];
            let _votante = { ...votante };
            if (votante.id) {
                console.log(votante);
                votanteService.updateVotante(votante).then((res) => {
                    if (res === 401) {
                        window.localStorage.removeItem("institucion");
                        history.push("/");
                    }
                });
                const index = findIndexById(votante.id);
                _votantes[index] = _votante;
                toast.current.show({ severity: "success", summary: "Successful", detail: "Votante actualizado", life: 3000 });
                setVotantes(_votantes);
            } else {
                votanteService.postVotante(votante).then((res) => {
                    if (res === 401) {
                        window.localStorage.removeItem("institucion");
                        history.push("/");
                    } else {
                        _votantes.push({ ...res });
                        setVotantes(_votantes);
                    }
                });

                toast.current.show({ severity: "success", summary: "Successful", detail: "Votante creado", life: 3000 });
            }

            setCodigo("");

            setVotanteDialog(false);
            setVotante(emptyvotante);
        }
    };

    const editVotante = (votante) => {
        if (votante.id) {
            setActiveCedula(false);
        } else {
            setActiveCedula(true);
        }
        setCodigo(votante.codigo);
        setActiveCedula(false);
        setGrupo(votante.grupo);
        setSexo(votante.sexo);
        setActivo(votante.activo);
        setVotante({ ...votante });
        setVotanteDialog(true);
    };

    const confirmDeleteVotante = (votante) => {
        setVotante(votante);
        setDeleteVotanteDialog(true);
    };

    const deleteVotante = () => {
        const votanteService = new VotanteService();
        let _votantes;
        votanteService.deleteVotante(votante.id).then((res) => {
            if (res === 500) {
                toast.current.show({ severity: "error", summary: "Error Message", detail: "Votante no eliminado", life: 3000 });
            } else if (res === 401) {
                history.push("/");
                window.localStorage.removeItem("institucion");
            } else {
                _votantes = votantes.filter((val) => val.id !== votante.id);
                setVotantes(_votantes);
                setVotante(emptyvotante);
                toast.current.show({ severity: "success", summary: "Successful", detail: "Votante eliminado", life: 3000 });
            }
        });
        setDeleteVotanteDialog(false);
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < votantes.length; i++) {
            if (votantes[i].id === id) {
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
        setDeleteVotantesDialog(true);
    };

    const deleteSelectedvotantes = () => {
        const votanteService = new VotanteService();
        let _votantes;
        selectedvotantes.map((res) =>
            votanteService.deleteVotante(res.id).then((res) => {
                if (res === 500) {
                    toast.current.show({ severity: "error", summary: "Error Message", detail: "Votantes no eliminados", life: 3000 });
                } else if (res === 401) {
                    window.localStorage.removeItem("institucion");
                    history.push("/");
                } else {
                    _votantes = votantes.filter((val) => !selectedvotantes.includes(val));
                    setVotantes(_votantes);
                    setSelectedvotantes(null);
                    toast.current.show({ severity: "success", summary: "Successful", detail: "Votantes eliminados", life: 3000 });
                }
            })
        );
        setDeleteVotantesDialog(false);
    };

    const onNameChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _votante = { ...votante };
        _votante[`${name}`] = val;

        setVotante(_votante);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="Eliminar" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedvotantes || !selectedvotantes.length} />
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

    const onGrupoChange = (e) => {
        setGrupo(e.value);
    };
    const onSexoChange = (e) => {
        setSexo(e.value);
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

    const apellidoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.apellido}
            </>
        );
    };
    const cedulaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Cedula</span>
                {rowData.cedula}
            </>
        );
    };
    const celularBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Celular</span>
                {rowData.celular}
            </>
        );
    };
    const sexoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Sexo</span>
                {rowData.sexo.nombre}
            </>
        );
    };
    const codigoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Codigo</span>
                {rowData.codigo}
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

    const handleCodigo = () => {
        const votanteService = new VotanteService();
        votanteService.getCodigo(institucion.id).then((res) => setCodigo(res));
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editVotante(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteVotante(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Votantes</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const votanteDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={savevotante} />
        </>
    );
    const deleteVotanteDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteVotanteDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteVotante} />
        </>
    );
    const deleteVotantesDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteVotantesDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedvotantes} />
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
                        value={votantes}
                        selection={selectedvotantes}
                        onSelectionChange={(e) => setSelectedvotantes(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} votantes"
                        globalFilter={globalFilter}
                        emptyMessage="No existe votantes"
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="id" header="id" sortable body={codeBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="cedula" header="Cedula/Pasaporte" sortable body={cedulaBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="nombre" header="Nombre" sortable body={nombreBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="apellido" header="Apellido" sortable body={apellidoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="celular" header="Celular" sortable body={celularBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="sexo" header="Sexo" sortable body={sexoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="codigo" header="Codigo" sortable body={codigoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="estado" header="Estado" sortable body={activoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>

                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={votanteDialog} style={{ width: "450px" }} header="Votante" modal className="p-fluid" footer={votanteDialogFooter} onHide={hideDialog}>
                        {votante.image && <img src={`assets/demo/images/votante/${votante.image}`} alt={votante.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="cedula">Cedula o Pasaporte</label>
                            {activeCedula === true ? <InputText id="cedula" value={votante.cedula} onChange={(e) => onNameChange(e, "cedula")} required autoFocus className={classNames({ "p-invalid": submitted && !votante.cedula })} /> : <h5 style={{ marginTop: "-0.001rem" }}>{votante.cedula}</h5>}
                            {submitted && !votante.cedula && <small className="p-invalid">Cedula es requerido</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="nombre">Nombre</label>
                            <InputText id="nombre" value={votante.nombre} onChange={(e) => onNameChange(e, "nombre")} required autoFocus className={classNames({ "p-invalid": submitted && !votante.nombre })} />
                            {submitted && !votante.nombre && <small className="p-invalid">Nombre es requerido</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="apellido">Apellido</label>
                            <InputText id="apellido" value={votante.apellido} onChange={(e) => onNameChange(e, "apellido")} required autoFocus className={classNames({ "p-invalid": submitted && !votante.apellido })} />
                            {submitted && !votante.apellido && <small className="p-invalid">Apellido es requerido</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="celular">Celular</label>
                            <InputText id="celular" value={votante.celular} onChange={(e) => onNameChange(e, "celular")} required autoFocus className={classNames({ "p-invalid": submitted && !votante.celular })} />
                            {submitted && !votante.celular && <small className="p-invalid">Celular es requerido</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="grupo">Grupo</label>
                            <Dropdown id="grupo" value={grupo} onChange={(e) => onGrupoChange(e)} options={grupos} optionLabel="nombre" placeholder="Seleccione un grupo" required autoFocus className={classNames({ "p-invalid": submitted && !grupo.nombre })} />
                            {submitted && !grupo.nombre && <small className="p-invalid">Grupo es requerido</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="sexo">Sexo</label>
                            <Dropdown id="sexo" value={sexo} onChange={(e) => onSexoChange(e)} options={sexos} optionLabel="nombre" placeholder="Seleccione un sexo" required autoFocus className={classNames({ "p-invalid": submitted && !sexo.nombre })} />
                            {submitted && !sexo.nombre && <small className="p-invalid">Sexo no requerido</small>}
                        </div>
                        <div className="field flex " style={{ alignItems: "center", gap: "0.4rem" }}>
                            <Button icon="pi pi-sync" className="p-button-rounded p-button-success mr-2" onClick={handleCodigo} />

                            <label htmlFor="codigo">{codigo}</label>
                        </div>
                        <div className="field">
                            <InputSwitch checked={activo} onChange={(e) => setActivo(e.value)} color="primary" name="status" />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteVotanteDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteVotanteDialogFooter} onHide={hideDeleteVotanteDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {votante && (
                                <span>
                                    ¿Está seguro que desea eliminar este votante? <b>{votante.name}</b>
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteVotantesDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteVotantesDialogFooter} onHide={hideDeleteVotantesDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {votante && <span>¿Está seguro que desea eliminar las votantes seleccionados?</span>}
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

export default React.memo(Votante, comparisonFn);
