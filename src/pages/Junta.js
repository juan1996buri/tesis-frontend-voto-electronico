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
import { JuntaService } from "../service/JuntaService";
import { RecintoService } from "../service/RecintoService";

const Junta = () => {
    let emptyjunta = {
        id: "",
        numero: "",
        recinto: "",
        presidente: "",
        vicePresidente: "",
        secretario: "",
    };

    const [juntas, setJuntas] = useState([]);
    const [recintos, setRecintos] = useState([]);
    const [juntaDialog, setJuntaDialog] = useState(false);
    const [deletejuntaDialog, setDeletejuntaDialog] = useState(false);
    const [deletejuntasDialog, setDeletejuntasDialog] = useState(false);
    const [junta, setJunta] = useState(emptyjunta);
    const [recinto, setRecinto] = useState({});
    const [selectedjuntas, setSelectedjuntas] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    const ubication = useLocation().state;
    useEffect(
        () => {
            if (ubication) {
                const { correo } = ubication;
                const junta = new JuntaService();
                junta.getJuntas(correo, setJuntas);
                const object = new RecintoService();
                object.getRecintos(correo, setRecintos);
            }
        },
        [ubication],
        []
    );

    const openNew = () => {
        setJunta(emptyjunta);
        setSubmitted(false);
        setJuntaDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setJuntaDialog(false);
    };

    const hideDeletejuntaDialog = () => {
        setDeletejuntaDialog(false);
    };

    const hideDeletejuntasDialog = () => {
        setDeletejuntasDialog(false);
    };

    const savejunta = () => {
        setSubmitted(true);

        junta.recinto = recinto;

        if (junta.numero.trim()) {
            let _juntas = [...juntas];
            let _junta = { ...junta };
            if (junta.id) {
                const object = new JuntaService();
                object.updateJunta(junta);
                const index = findIndexById(junta.id);
                _juntas[index] = _junta;
                toast.current.show({ severity: "success", summary: "Successful", detail: "junta Updated", life: 3000 });
            } else {
                const object = new JuntaService();
                object.postJunta(junta);
                _juntas.push(_junta);
                toast.current.show({ severity: "success", summary: "Successful", detail: "junta Created", life: 3000 });
            }

            setJuntas(_juntas);
            setJuntaDialog(false);
            setJunta(emptyjunta);
        }
    };

    const editJunta = (junta) => {
        setJunta({ ...junta });
        setJuntaDialog(true);
    };

    const confirmDeletejunta = (junta) => {
        setJunta(junta);
        setDeletejuntaDialog(true);
    };

    const deletejunta = () => {
        const object = new JuntaService();
        object.deleteJunta(junta.id);
        let _juntas = juntas.filter((val) => val.id !== junta.id);
        setJuntas(_juntas);
        setDeletejuntaDialog(false);
        setJunta(emptyjunta);
        toast.current.show({ severity: "success", summary: "Successful", detail: "junta Deleted", life: 3000 });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < juntas.length; i++) {
            if (juntas[i].id === id) {
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
        setDeletejuntasDialog(true);
    };

    const deleteSelectedjuntas = () => {
        const object = new JuntaService();
        selectedjuntas.map((res) => object.deleteJunta(res.id));

        let _juntas = juntas.filter((val) => !selectedjuntas.includes(val));
        setJuntas(_juntas);
        setDeletejuntasDialog(false);
        setSelectedjuntas(null);
        toast.current.show({ severity: "success", summary: "Successful", detail: "juntas Deleted", life: 3000 });
    };

    const onNameChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _junta = { ...junta };
        _junta[`${name}`] = val;

        setJunta(_junta);
    };
    const onDirectionChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _junta = { ...junta };
        _junta[`${name}`] = val;

        setJunta(_junta);
    };

    const onCiudadChange = (e) => {
        setRecinto(e.value);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedjuntas || !selectedjuntas.length} />
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

    const numberBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Numero</span>
                {rowData.numero}
            </>
        );
    };

    const vicePresidentBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">VicePresidente</span>
                {rowData.vicePresidente}
            </>
        );
    };
    const presidentBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Presidente</span>
                {rowData.presidente}
            </>
        );
    };
    const secretaryBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Secretario</span>
                {rowData.secretario}
            </>
        );
    };
    const recintoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Recinto</span>
                {rowData.recinto.nombre}
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editJunta(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeletejunta(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage juntas</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const juntaDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={savejunta} />
        </>
    );
    const deletejuntaDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeletejuntaDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deletejunta} />
        </>
    );
    const deletejuntasDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeletejuntasDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedjuntas} />
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
                        value={juntas}
                        selection={selectedjuntas}
                        onSelectionChange={(e) => setSelectedjuntas(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} juntas"
                        globalFilter={globalFilter}
                        emptyMessage="No juntas found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="id" header="id" sortable body={codeBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="numero" header="Numero" sortable body={numberBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="presidente" header="Presidente" sortable body={presidentBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="vicePresidente" header="VicePresidente" sortable body={vicePresidentBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="secretario" header="Secretario" sortable body={secretaryBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="recinto" header="Recinto" sortable body={recintoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>

                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={juntaDialog} style={{ width: "450px" }} header="junta" modal className="p-fluid" footer={juntaDialogFooter} onHide={hideDialog}>
                        {junta.image && <img src={`assets/demo/images/junta/${junta.image}`} alt={junta.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="numero">Numero</label>
                            <InputText id="numero" value={junta.numero} onChange={(e) => onNameChange(e, "numero")} required autoFocus className={classNames({ "p-invalid": submitted && !junta.numero })} />
                            {submitted && !junta.numero && <small className="p-invalid">Numero es requerido</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="presidente">Presidente</label>
                            <InputText id="presidente" value={junta.presidente} onChange={(e) => onDirectionChange(e, "presidente")} required autoFocus className={classNames({ "p-invalid": submitted && !junta.presidente })} />
                            {submitted && !junta.presidente && <small className="p-invalid">nombre es requerido</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="vicepresidente">Vice-presidente</label>
                            <InputText id="vicepresidente" value={junta.vicePresidente} onChange={(e) => onDirectionChange(e, "vicePresidente")} required autoFocus className={classNames({ "p-invalid": submitted && !junta.vicePresidente })} />
                            {submitted && !junta.vicePresidente && <small className="p-invalid">nombre es requerido</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="secretario">Secretario</label>
                            <InputText id="secretario" value={junta.secretario} onChange={(e) => onDirectionChange(e, "secretario")} required autoFocus className={classNames({ "p-invalid": submitted && !junta.secretario })} />
                            {submitted && !junta.secretario && <small className="p-invalid">nombre es requerido</small>}
                        </div>
                        <div>
                            <label htmlFor="recinto">Recinto</label>
                            <Dropdown id="recinto" value={recinto} onChange={(e) => onCiudadChange(e)} options={recintos} optionLabel="nombre" placeholder="Select Junta"></Dropdown>
                        </div>
                    </Dialog>

                    <Dialog visible={deletejuntaDialog} style={{ width: "450px" }} header="Confirm" modal footer={deletejuntaDialogFooter} onHide={hideDeletejuntaDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {junta && (
                                <span>
                                    Are you sure you want to delete <b>{junta.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deletejuntasDialog} style={{ width: "450px" }} header="Confirm" modal footer={deletejuntasDialogFooter} onHide={hideDeletejuntasDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {junta && <span>Are you sure you want to delete the selected juntas?</span>}
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

export default React.memo(Junta, comparisonFn);
