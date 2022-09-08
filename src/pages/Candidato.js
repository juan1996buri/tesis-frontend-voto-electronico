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
import { CandidatoService } from "../service/CandidatoService";
import { ListaService } from "../service/ListaService";
import { VotanteService } from "../service/VotanteService";
import { ProcesoEleccionService } from "../service/ProcesoEleccionService";
import { TipoCandidatoService } from "../service/TipoCandidatoService";

const Candidato = () => {
    const history = useHistory();
    let emptycandidato = {
        id: "",
        votante: "",
        tipoCandidato: "",
        lista: "",
        procesoEleccion: "",
        imagen: "",
    };

    const [candidatos, setCandidatos] = useState([]);
    const [candidatoDialog, setCandidatoDialog] = useState(false);
    const [deleteCandidatoDialog, setDeleteCandidatoDialog] = useState(false);
    const [deleteCandidatosDialog, setDeleteCandidatosDialog] = useState(false);
    const [candidato, setCandidato] = useState(emptycandidato);
    const [procesoEleccion, setProcesoEleccion] = useState({});
    const [procesoElecciones, setProcesoElecciones] = useState([]);
    const [tipoCandidatos, setTiposCandidatos] = useState([]);
    const [lista, setLista] = useState({});
    const [tipoCandidato, setTipoCandidato] = useState({});
    const [listas, setListas] = useState([]);
    const [votante, setVotante] = useState({});
    const [votantes, setVotantes] = useState([]);
    const [selectedCandidatos, setSelectedCandidatos] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    const data = JSON.parse(window.localStorage.getItem("institucion"));
    useEffect(() => {
        if (data) {
            const candidatoService = new CandidatoService();
            candidatoService.getCandidatos(data.ruc, setCandidatos).then((res) => {
                if (res === 401) {
                    window.localStorage.removeItem("institucion");
                    history.push("/");
                }
            });
            const listaService = new ListaService();
            listaService.getListas(data.ruc, setListas);
            const votanteService = new VotanteService();
            votanteService.getVotantes(data.ruc, setVotantes);
            const procesoEleccionService = new ProcesoEleccionService();
            procesoEleccionService.getProcesosElecciones(data.ruc, setProcesoElecciones);
            const tipoCandidatoService = new TipoCandidatoService();
            tipoCandidatoService.getTipoCandidatos(data.ruc, setTiposCandidatos);
        } else {
            history.push("/");
        }
    }, []);

    const openNew = () => {
        setTipoCandidato(tipoCandidatos[0]);
        setVotante(votantes[0]);
        setLista(listas[0]);
        setProcesoEleccion(procesoElecciones[0]);
        setCandidato(emptycandidato);
        setSubmitted(false);
        setCandidatoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setCandidatoDialog(false);
    };

    const hideDeleteCandidatoDialog = () => {
        setDeleteCandidatoDialog(false);
    };

    const hideDeleteCandidatosDialog = () => {
        setDeleteCandidatosDialog(false);
    };

    const savecandidato = () => {
        setSubmitted(true);
        candidato.lista = lista;
        candidato.procesoEleccion = procesoEleccion;
        candidato.tipoCandidato = tipoCandidato;
        candidato.votante = votante;
        console.log(candidato);

        const candidatoService = new CandidatoService();
        if (candidato.votante.nombre.trim()) {
            let _candidatos = [...candidatos];
            let _candidato = { ...candidato };
            if (candidato.id) {
                candidatoService.updateCandidato(candidato).then((res) => {
                    if (res === 401) {
                        window.localStorage.removeItem("institucion");
                        history.push("/");
                    }
                });
                const index = findIndexById(candidato.id);
                _candidatos[index] = _candidato;
                toast.current.show({ severity: "success", summary: "Successful", detail: "candidato Updated", life: 3000 });
            } else {
                candidatoService.postCandidato(candidato).then((res) => {
                    if (res === 401) {
                        window.localStorage.removeItem("institucion");
                        history.push("/");
                    }
                });
                _candidatos.push(_candidato);
                toast.current.show({ severity: "success", summary: "Successful", detail: "candidato Created", life: 3000 });
            }

            setCandidatos(_candidatos);
            setCandidatoDialog(false);
            setCandidato(emptycandidato);
        }
    };

    const editcandidato = (candidato) => {
        setLista(candidato.lista);
        setVotante(candidato.votante);
        setTipoCandidato(candidato.tipoCandidato);
        setProcesoEleccion(candidato.procesoEleccion);
        setCandidato({ ...candidato });
        setCandidatoDialog(true);
    };

    const confirmDeleteCandidato = (candidato) => {
        setCandidato(candidato);
        setDeleteCandidatoDialog(true);
    };

    const deleteCandidato = () => {
        const candidatoService = new CandidatoService();
        let _candidatos;
        candidatoService.deleteCandidato(candidato.id).then((res) => {
            if (res === 500) {
                toast.current.show({ severity: "error", summary: "Error Message", detail: "candidato no eliminada", life: 3000 });
            } else if (res === 401) {
                history.push("/");
                window.localStorage.removeItem("institucion");
            } else {
                _candidatos = candidatos.filter((val) => val.id !== candidato.id);
                setCandidatos(_candidatos);
                setCandidato(emptycandidato);
                toast.current.show({ severity: "success", summary: "Successful", detail: "candidato eliminada", life: 3000 });
            }
        });
        setDeleteCandidatoDialog(false);
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < candidatos.length; i++) {
            if (candidatos[i].id === id) {
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
        setDeleteCandidatosDialog(true);
    };

    const onProcesoEleccion = (e) => {
        setProcesoEleccion(e.value);
    };

    const onLista = (e) => {
        setLista(e.value);
    };
    const onTipoCandidato = (e) => {
        setTipoCandidato(e.value);
    };

    const onVotante = (e) => {
        setVotante(e.value);
    };

    const deleteSelectedCandidatos = () => {
        const candidatoService = new CandidatoService();
        let _candidatos;
        selectedCandidatos.map((res) =>
            candidatoService.deleteCandidato(res.id).then((res) => {
                if (res === 500) {
                    toast.current.show({ severity: "error", summary: "Error Message", detail: "candidatos no eliminadas", life: 3000 });
                } else if (res === 401) {
                    window.localStorage.removeItem("institucion");
                    history.push("/");
                } else {
                    _candidatos = candidatos.filter((val) => !selectedCandidatos.includes(val));
                    setCandidatos(_candidatos);
                    setSelectedCandidatos(null);
                    toast.current.show({ severity: "success", summary: "Successful", detail: "candidatos eliminadas", life: 3000 });
                }
            })
        );
        setDeleteCandidatosDialog(false);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedCandidatos || !selectedCandidatos.length} />
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

    const procesoEleccionBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre del Proceso</span>
                {rowData.procesoEleccion.nombre}
            </>
        );
    };
    const listaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Lista</span>
                {rowData.lista.nombre}
            </>
        );
    };
    const tipoCandidatoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Cargo</span>
                {rowData.tipoCandidato.nombre}
            </>
        );
    };
    const candidatoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Cedula</span>
                {rowData.votante.cedula}
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editcandidato(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteCandidato(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage candidatos</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const candidatoDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={savecandidato} />
        </>
    );
    const deleteCandidatoDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteCandidatoDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteCandidato} />
        </>
    );
    const deleteCandidatosDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteCandidatosDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedCandidatos} />
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
                        value={candidatos}
                        selection={selectedCandidatos}
                        onSelectionChange={(e) => setSelectedCandidatos(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} candidatos"
                        globalFilter={globalFilter}
                        emptyMessage="No candidatos found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="id" header="id" sortable body={codeBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="procesoEleccion" header="Proceso Eleccion" sortable body={procesoEleccionBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="lista" header="Lista" sortable body={listaBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="candidato" header="Candidato" sortable body={candidatoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="Cargo" header="Cargo" sortable body={tipoCandidatoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>

                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={candidatoDialog} style={{ width: "450px" }} header="candidato" modal className="p-fluid" footer={candidatoDialogFooter} onHide={hideDialog}>
                        {candidato.image && <img src={`assets/demo/images/candidato/${candidato.image}`} alt={candidato.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="procesoElecction">Proceso Eleccion</label>
                            <Dropdown
                                id="procesoElecction"
                                name="nombre"
                                value={procesoEleccion}
                                onChange={(e) => onProcesoEleccion(e)}
                                options={procesoElecciones}
                                optionLabel="nombre"
                                placeholder="Seleccione un candidato"
                                required
                                autoFocus
                                className={classNames({ "p-invalid": submitted && !procesoEleccion.nombre })}
                            />
                            {submitted && !tipoCandidato.nombre && <small className="p-invalid">Cargo es requerido</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="provincia">Lista</label>
                            <Dropdown id="lista" name="lista" value={lista} onChange={(e) => onLista(e)} options={listas} optionLabel="nombre" placeholder="Seleccione un proceso eleccion" required autoFocus className={classNames({ "p-invalid": submitted && !lista.nombre })} />
                            {submitted && !procesoEleccion.nombre && <small className="p-invalid">Proceso eleccion es requerido</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="provincia">Candidato</label>
                            <Dropdown id="votante" name="votante" value={votante} onChange={(e) => onVotante(e)} options={votantes} optionLabel="nombre" placeholder="Seleccione un candidato" required autoFocus className={classNames({ "p-invalid": submitted && !votante.nombre })} />
                            {submitted && !votante.nombre && <small className="p-invalid">Candidato es requerido</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="tipoCandidato">Cargo</label>
                            <Dropdown
                                id="tipoCandidato"
                                name="nombre"
                                value={tipoCandidato}
                                onChange={(e) => onTipoCandidato(e)}
                                options={tipoCandidatos}
                                optionLabel="nombre"
                                placeholder="Seleccione un candidato"
                                required
                                autoFocus
                                className={classNames({ "p-invalid": submitted && !tipoCandidato.nombre })}
                            />
                            {submitted && !tipoCandidato.nombre && <small className="p-invalid">Cargo es requerido</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteCandidatoDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteCandidatoDialogFooter} onHide={hideDeleteCandidatoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {candidato && (
                                <span>
                                    ¿Está seguro que desea eliminar esta candidato? <b>{candidato.name}</b>
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteCandidatosDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteCandidatosDialogFooter} onHide={hideDeleteCandidatosDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {candidato && <span>¿Está seguro que desea eliminar las candidatos seleccionadas?</span>}
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

export default React.memo(Candidato, comparisonFn);
