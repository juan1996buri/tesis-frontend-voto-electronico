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
import { TipoInstitucionService } from "../service/TipoInstitucionService";

const TipoInstitucion = () => {
    const history = useHistory();
    let emptytipoInstitucion = {
        id: "",
        nombre: "",
        descripcion: "",
    };

    const [tipoInstitucions, setTipoInstitucions] = useState([]);
    const [tipoInstitucionDialog, setTipoInstitucionDialog] = useState(false);
    const [deleteTipoInstitucionDialog, setDeleteTipoInstitucionDialog] = useState(false);
    const [deleteTipoInstitucionsDialog, setDeleteTipoInstitucionsDialog] = useState(false);
    const [tipoInstitucion, setTipoInstitucion] = useState(emptytipoInstitucion);
    const [selectedTipoInstitucions, setSelectedTipoInstitucions] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    const data = JSON.parse(window.localStorage.getItem("institucion"));
    useEffect(() => {
        if (data) {
            const tipoInstitucionService = new TipoInstitucionService();
            tipoInstitucionService.getTiposInstituciones(setTipoInstitucions).then((res) => {
                if (res === 401) {
                    window.localStorage.removeItem("institucion");
                    history.push("/");
                }
            });
        } else {
            history.push("/");
        }
    }, []);

    const openNew = () => {
        setTipoInstitucion(emptytipoInstitucion);
        setSubmitted(false);
        setTipoInstitucionDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setTipoInstitucionDialog(false);
    };

    const hideDeleteTipoInstitucionDialog = () => {
        setDeleteTipoInstitucionDialog(false);
    };

    const hideDeleteTipoInstitucionsDialog = () => {
        setDeleteTipoInstitucionsDialog(false);
    };

    const saveTipoInstitucion = () => {
        setSubmitted(true);

        const tipoInstitucionService = new TipoInstitucionService();
        console.log(tipoInstitucion);

        if (tipoInstitucion.nombre.trim()) {
            let _tipoInstitucions = [...tipoInstitucions];
            let _tipoInstitucion = { ...tipoInstitucion };
            if (tipoInstitucion.id) {
                tipoInstitucionService.updateTipoInstitucion(tipoInstitucion).then((res) => {
                    if (res === 401) {
                        window.localStorage.removeItem("institucion");
                        history.push("/");
                    }
                });
                const index = findIndexById(tipoInstitucion.id);
                _tipoInstitucions[index] = _tipoInstitucion;
                toast.current.show({ severity: "success", summary: "Successful", detail: "tipoInstitucion Updated", life: 3000 });
            } else {
                tipoInstitucionService.postTipoInstitucion(tipoInstitucion).then((res) => {
                    if (res === 401) {
                        window.localStorage.removeItem("institucion");
                        history.push("/");
                    }
                });
                _tipoInstitucions.push(_tipoInstitucion);
                toast.current.show({ severity: "success", summary: "Successful", detail: "tipoInstitucion Created", life: 3000 });
            }

            setTipoInstitucions(_tipoInstitucions);
            setTipoInstitucionDialog(false);
            setTipoInstitucion(emptytipoInstitucion);
        }
    };

    const edittipoInstitucion = (tipoInstitucion) => {
        setTipoInstitucion({ ...tipoInstitucion });
        setTipoInstitucionDialog(true);
    };

    const confirmDeleteTipoInstitucion = (tipoInstitucion) => {
        setTipoInstitucion(tipoInstitucion);
        setDeleteTipoInstitucionDialog(true);
    };

    const deleteTipoInstitucion = () => {
        const tipoInstitucionService = new TipoInstitucionService();
        let _tipoInstitucions;
        tipoInstitucionService.deleteTipoInstitucion(tipoInstitucion.id).then((res) => {
            if (res === 500) {
                toast.current.show({ severity: "error", summary: "Error Message", detail: "tipoInstitucion no eliminada", life: 3000 });
            } else if (res === 401) {
                history.push("/");
                window.localStorage.removeItem("institucion");
            } else {
                _tipoInstitucions = tipoInstitucions.filter((val) => val.id !== tipoInstitucion.id);
                setTipoInstitucions(_tipoInstitucions);
                setTipoInstitucion(emptytipoInstitucion);
                toast.current.show({ severity: "success", summary: "Successful", detail: "tipoInstitucion eliminada", life: 3000 });
            }
        });
        setDeleteTipoInstitucionDialog(false);
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < tipoInstitucions.length; i++) {
            if (tipoInstitucions[i].id === id) {
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
        setDeleteTipoInstitucionsDialog(true);
    };

    const deleteSelectedTipoInstitucions = () => {
        const tipoInstitucionService = new TipoInstitucionService();
        let _tipoInstitucions;
        selectedTipoInstitucions.map((res) =>
            tipoInstitucionService.deleteTipoInstitucion(res.id).then((res) => {
                if (res === 500) {
                    toast.current.show({ severity: "error", summary: "Error Message", detail: "tipoInstitucions no eliminadas", life: 3000 });
                } else if (res === 401) {
                    window.localStorage.removeItem("institucion");
                    history.push("/");
                } else {
                    _tipoInstitucions = tipoInstitucions.filter((val) => !selectedTipoInstitucions.includes(val));
                    setTipoInstitucions(_tipoInstitucions);
                    setSelectedTipoInstitucions(null);
                    toast.current.show({ severity: "success", summary: "Successful", detail: "tipoInstitucions eliminadas", life: 3000 });
                }
            })
        );
        setDeleteTipoInstitucionsDialog(false);
    };

    const onNameChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _tipoInstitucion = { ...tipoInstitucion };
        _tipoInstitucion[`${name}`] = val;

        setTipoInstitucion(_tipoInstitucion);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedTipoInstitucions || !selectedTipoInstitucions.length} />
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
    const descripcionBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Descripcion</span>
                {rowData.descripcion}
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => edittipoInstitucion(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteTipoInstitucion(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage tipoInstitucions</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const tipoInstitucionDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveTipoInstitucion} />
        </>
    );
    const deleteTipoInstitucionDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteTipoInstitucionDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteTipoInstitucion} />
        </>
    );
    const deleteTipoInstitucionsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteTipoInstitucionsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedTipoInstitucions} />
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
                        value={tipoInstitucions}
                        selection={selectedTipoInstitucions}
                        onSelectionChange={(e) => setSelectedTipoInstitucions(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} tipoInstitucions"
                        globalFilter={globalFilter}
                        emptyMessage="No tipoInstitucions found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="id" header="id" sortable body={codeBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="nombre" header="Nombre" sortable body={nombreBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="descripcion" header="Descripcion" sortable body={descripcionBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>

                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={tipoInstitucionDialog} style={{ width: "450px" }} header="tipoInstitucion" modal className="p-fluid" footer={tipoInstitucionDialogFooter} onHide={hideDialog}>
                        {tipoInstitucion.image && <img src={`assets/demo/images/tipoInstitucion/${tipoInstitucion.image}`} alt={tipoInstitucion.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="nombre">Nombre</label>
                            <InputText id="nombre" value={tipoInstitucion.nombre} onChange={(e) => onNameChange(e, "nombre")} required autoFocus className={classNames({ "p-invalid": submitted && !tipoInstitucion.nombre })} />
                            {submitted && !tipoInstitucion.nombre && <small className="p-invalid">nombre es requerido</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="descripcion">Descipcion</label>
                            <InputText id="descripcion" value={tipoInstitucion.descripcion} onChange={(e) => onNameChange(e, "descripcion")} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteTipoInstitucionDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteTipoInstitucionDialogFooter} onHide={hideDeleteTipoInstitucionDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {tipoInstitucion && (
                                <span>
                                    ¿Está seguro que desea eliminar esta tipoInstitucion? <b>{tipoInstitucion.name}</b>
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteTipoInstitucionsDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteTipoInstitucionsDialogFooter} onHide={hideDeleteTipoInstitucionsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {tipoInstitucion && <span>¿Está seguro que desea eliminar las tipoInstitucions seleccionadas?</span>}
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

export default React.memo(TipoInstitucion, comparisonFn);
