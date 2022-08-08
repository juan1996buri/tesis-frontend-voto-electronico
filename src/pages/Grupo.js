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
import { useLocation } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import { GrupoService } from "../service/GrupoService";
import { JuntaService } from "../service/JuntaService";

const Grupo = () => {
    let emptygrupo = {
        id: "",
        nombre: "",
        junta: "",
    };

    const [grupos, setGrupos] = useState([]);
    const [juntas, setJuntas] = useState([]);
    const [grupoDialog, setGrupoDialog] = useState(false);
    const [deletegrupoDialog, setDeletegrupoDialog] = useState(false);
    const [deletegruposDialog, setDeletegruposDialog] = useState(false);
    const [grupo, setGrupo] = useState(emptygrupo);
    const [junta, setJunta] = useState({});
    const [selectedgrupos, setSelectedgrupos] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    const ubication = useLocation().state;
    useEffect(
        () => {
            if (ubication) {
                const { id } = ubication;
                const grupo = new GrupoService();
                grupo.getGrupos(id, setGrupos);
                const junta = new JuntaService();
                junta.getJuntas(id, setJuntas);
            }
        },
        [ubication],
        []
    );

    const openNew = () => {
        setGrupo(emptygrupo);
        setSubmitted(false);
        setGrupoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setGrupoDialog(false);
    };

    const hideDeletegrupoDialog = () => {
        setDeletegrupoDialog(false);
    };

    const hideDeletegruposDialog = () => {
        setDeletegruposDialog(false);
    };

    const savegrupo = () => {
        setSubmitted(true);

        grupo.junta = junta;

        if (grupo.nombre.trim()) {
            let _grupos = [...grupos];
            let _grupo = { ...grupo };
            if (grupo.id) {
                const object = new GrupoService();
                object.updateGrupo(grupo);
                const index = findIndexById(grupo.id);
                _grupos[index] = _grupo;
                toast.current.show({ severity: "success", summary: "Successful", detail: "grupo Updated", life: 3000 });
            } else {
                const object = new GrupoService();
                object.postGrupo(grupo);
                _grupos.push(_grupo);
                toast.current.show({ severity: "success", summary: "Successful", detail: "grupo Created", life: 3000 });
            }

            setGrupos(_grupos);
            setGrupoDialog(false);
            setGrupo(emptygrupo);
        }
    };

    const editGrupo = (grupo) => {
        setGrupo({ ...grupo });
        setGrupoDialog(true);
    };

    const confirmDeletegrupo = (grupo) => {
        setGrupo(grupo);
        setDeletegrupoDialog(true);
    };

    const deletegrupo = () => {
        const object = new GrupoService();
        object.deleteGrupo(grupo.id);
        let _grupos = grupos.filter((val) => val.id !== grupo.id);
        setGrupos(_grupos);
        setDeletegrupoDialog(false);
        setGrupo(emptygrupo);
        toast.current.show({ severity: "success", summary: "Successful", detail: "grupo Deleted", life: 3000 });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < grupos.length; i++) {
            if (grupos[i].id === id) {
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
        setDeletegruposDialog(true);
    };

    const deleteSelectedgrupos = () => {
        const object = new GrupoService();
        selectedgrupos.map((res) => object.deleteGrupo(res.id));

        let _grupos = grupos.filter((val) => !selectedgrupos.includes(val));
        setGrupos(_grupos);
        setDeletegruposDialog(false);
        setSelectedgrupos(null);
        toast.current.show({ severity: "success", summary: "Successful", detail: "grupos Deleted", life: 3000 });
    };

    const onNameChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _grupo = { ...grupo };
        _grupo[`${name}`] = val;

        setGrupo(_grupo);
    };

    const onCiudadChange = (e) => {
        setJunta(e.value);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedgrupos || !selectedgrupos.length} />
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

    const juntaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Junta</span>
                {rowData.junta.numero}
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editGrupo(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeletegrupo(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage grupos</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const grupoDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={savegrupo} />
        </>
    );
    const deletegrupoDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeletegrupoDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deletegrupo} />
        </>
    );
    const deletegruposDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeletegruposDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedgrupos} />
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
                        value={grupos}
                        selection={selectedgrupos}
                        onSelectionChange={(e) => setSelectedgrupos(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} grupos"
                        globalFilter={globalFilter}
                        emptyMessage="No grupos found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="id" header="id" sortable body={codeBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="nombre" header="Nombre" sortable body={nameBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="junta" header="Junta" sortable body={juntaBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>

                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={grupoDialog} style={{ width: "450px" }} header="Grupo" modal className="p-fluid" footer={grupoDialogFooter} onHide={hideDialog}>
                        {grupo.image && <img src={`assets/demo/images/grupo/${grupo.image}`} alt={grupo.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="nombre">Nombre</label>
                            <InputText id="nombre" value={grupo.nombre} onChange={(e) => onNameChange(e, "nombre")} required autoFocus className={classNames({ "p-invalid": submitted && !grupo.nombre })} />
                            {submitted && !grupo.nombre && <small className="p-invalid">Name is required.</small>}
                        </div>

                        <div>
                            <label htmlFor="junta">Junta</label>
                            <Dropdown id="junta" value={junta} onChange={(e) => onCiudadChange(e)} options={juntas} optionLabel="numero" placeholder="Select Junta"></Dropdown>
                        </div>
                    </Dialog>

                    <Dialog visible={deletegrupoDialog} style={{ width: "450px" }} header="Confirm" modal footer={deletegrupoDialogFooter} onHide={hideDeletegrupoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {grupo && (
                                <span>
                                    Are you sure you want to delete <b>{grupo.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deletegruposDialog} style={{ width: "450px" }} header="Confirm" modal footer={deletegruposDialogFooter} onHide={hideDeletegruposDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {grupo && <span>Are you sure you want to delete the selected grupos?</span>}
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

export default React.memo(Grupo, comparisonFn);
