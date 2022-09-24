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
import { TipoCandidatoService } from "../service/TipoCandidatoService";
import { InstitucionService } from "../service/InstitucionService";

const TipoCandidato = () => {
    const history = useHistory();
    let emptytipoCandidato = {
        id: "",
        nombre: "",
    };

    const [tipoCandidatos, setTipoCandidatos] = useState([]);
    const [institucion, setInstitucion] = useState({});
    const [tipoCandidatoDialog, setTipoCandidatoDialog] = useState(false);
    const [deleteTipoCandidatoDialog, setDeleteTipoCandidatoDialog] = useState(false);
    const [deleteTipoCandidatosDialog, setDeleteTipoCandidatosDialog] = useState(false);
    const [tipoCandidato, setTipoCandidato] = useState(emptytipoCandidato);
    const [selectedTipoCandidatos, setSelectedTipoCandidatos] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    const data = JSON.parse(window.localStorage.getItem("institucion"));
    useEffect(() => {
        if (data) {
            const tipoCandidatoService = new TipoCandidatoService();
            tipoCandidatoService.getTipoCandidatos(data.ruc, setTipoCandidatos).then((res) => {
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
        setTipoCandidato(emptytipoCandidato);
        setSubmitted(false);
        setTipoCandidatoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setTipoCandidatoDialog(false);
    };

    const hideDeleteTipoCandidatoDialog = () => {
        setDeleteTipoCandidatoDialog(false);
    };

    const hideDeleteTipoCandidatosDialog = () => {
        setDeleteTipoCandidatosDialog(false);
    };

    const savetipoCandidato = () => {
        setSubmitted(true);
        tipoCandidato.institucion = institucion;
        const tipoCandidatoService = new TipoCandidatoService();
        if (tipoCandidato.nombre.trim()) {
            let _tipoCandidatos = [...tipoCandidatos];
            let _tipoCandidato = { ...tipoCandidato };
            if (tipoCandidato.id) {
                tipoCandidatoService.updateTipoCandidato(tipoCandidato).then((res) => {
                    if (res === 401) {
                        window.localStorage.removeItem("institucion");
                        history.push("/");
                    }
                });
                const index = findIndexById(tipoCandidato.id);
                _tipoCandidatos[index] = _tipoCandidato;
                toast.current.show({ severity: "success", summary: "Successful", detail: "Cargo actualizado", life: 3000 });
                setTipoCandidatos(_tipoCandidatos);
            } else {
                tipoCandidatoService.postTipoCandidato(tipoCandidato).then((res) => {
                    if (res === 401) {
                        window.localStorage.removeItem("institucion");
                        history.push("/");
                    } else {
                        _tipoCandidatos.push({ ...res });
                        setTipoCandidatos(_tipoCandidatos);
                    }
                });
                toast.current.show({ severity: "success", summary: "Successful", detail: "Cargo creado", life: 3000 });
            }

            setTipoCandidatoDialog(false);
            setTipoCandidato(emptytipoCandidato);
        }
    };

    const editTipoCandidato = (tipoCandidato) => {
        setTipoCandidato({ ...tipoCandidato });
        setTipoCandidatoDialog(true);
    };

    const confirmDeleteTipoCandidato = (tipoCandidato) => {
        setTipoCandidato(tipoCandidato);
        setDeleteTipoCandidatoDialog(true);
    };

    const deleteTipoCandidato = () => {
        const tipoCandidatoService = new TipoCandidatoService();
        let _tipoCandidatos;
        tipoCandidatoService.deleteTipoCandidato(tipoCandidato.id).then((res) => {
            if (res === 500) {
                toast.current.show({ severity: "error", summary: "Error Message", detail: "Cargo no eliminado", life: 3000 });
            } else if (res === 401) {
                history.push("/");
                window.localStorage.removeItem("institucion");
            } else {
                _tipoCandidatos = tipoCandidatos.filter((val) => val.id !== tipoCandidato.id);
                setTipoCandidatos(_tipoCandidatos);
                setTipoCandidato(emptytipoCandidato);
                toast.current.show({ severity: "success", summary: "Successful", detail: "Cargo eliminado", life: 3000 });
            }
        });
        setDeleteTipoCandidatoDialog(false);
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < tipoCandidatos.length; i++) {
            if (tipoCandidatos[i].id === id) {
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
        setDeleteTipoCandidatosDialog(true);
    };

    const deleteSelectedTipoCandidatos = () => {
        const tipoCandidatoService = new TipoCandidatoService();
        let _tipoCandidatos;
        selectedTipoCandidatos.map((res) =>
            tipoCandidatoService.deleteTipoCandidato(res.id).then((res) => {
                if (res === 500) {
                    toast.current.show({ severity: "error", summary: "Error Message", detail: "Cargos no eliminados", life: 3000 });
                } else if (res === 401) {
                    window.localStorage.removeItem("institucion");
                    history.push("/");
                } else {
                    _tipoCandidatos = tipoCandidatos.filter((val) => !selectedTipoCandidatos.includes(val));
                    setTipoCandidatos(_tipoCandidatos);
                    setSelectedTipoCandidatos(null);
                    toast.current.show({ severity: "success", summary: "Successful", detail: "Cargos eliminados", life: 3000 });
                }
            })
        );
        setDeleteTipoCandidatosDialog(false);
    };

    const onNameChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _tipoCandidato = { ...tipoCandidato };
        _tipoCandidato[`${name}`] = val;

        setTipoCandidato(_tipoCandidato);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="Eliminar" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedTipoCandidatos || !selectedTipoCandidatos.length} />
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

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editTipoCandidato(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteTipoCandidato(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Cargos</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const tipoCandidatoDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={savetipoCandidato} />
        </>
    );
    const deleteTipoCandidatoDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteTipoCandidatoDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteTipoCandidato} />
        </>
    );
    const deleteTipoCandidatosDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteTipoCandidatosDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedTipoCandidatos} />
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
                        value={tipoCandidatos}
                        selection={selectedTipoCandidatos}
                        onSelectionChange={(e) => setSelectedTipoCandidatos(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} tipoCandidatos"
                        globalFilter={globalFilter}
                        emptyMessage="No existe cargos"
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="id" header="id" sortable body={codeBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="nombre" header="Nombre" sortable body={nombreBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>

                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={tipoCandidatoDialog} style={{ width: "450px" }} header="Cargo" modal className="p-fluid" footer={tipoCandidatoDialogFooter} onHide={hideDialog}>
                        {tipoCandidato.image && <img src={`assets/demo/images/tipoCandidato/${tipoCandidato.image}`} alt={tipoCandidato.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="nombre">Nombre</label>
                            <InputText id="nombre" value={tipoCandidato.nombre} onChange={(e) => onNameChange(e, "nombre")} required autoFocus className={classNames({ "p-invalid": submitted && !tipoCandidato.nombre })} />
                            {submitted && !tipoCandidato.nombre && <small className="p-invalid">Nombre es requerido</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteTipoCandidatoDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteTipoCandidatoDialogFooter} onHide={hideDeleteTipoCandidatoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {tipoCandidato && (
                                <span>
                                    ¿Está seguro que desea eliminar este cargo? <b>{tipoCandidato.name}</b>
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteTipoCandidatosDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteTipoCandidatosDialogFooter} onHide={hideDeleteTipoCandidatosDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {tipoCandidato && <span>¿Está seguro que desea eliminar los cargos seleccionados?</span>}
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

export default React.memo(TipoCandidato, comparisonFn);
