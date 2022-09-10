import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ProvinciaService } from "../service/ProvinciaService";
import { useHistory } from "react-router-dom";
import { FileUpload } from "primereact/fileupload";

const Provincia = () => {
    const history = useHistory();
    let emptyprovincia = {
        id: "",
        nombre: "",
    };

    const [provincias, setProvincias] = useState([]);
    const [provinciaDialog, setProvinciaDialog] = useState(false);
    const [deleteProvinciaDialog, setDeleteProvinciaDialog] = useState(false);
    const [deleteProvinciasDialog, setDeleteProvinciasDialog] = useState(false);
    const [provincia, setProvincia] = useState(emptyprovincia);
    const [selectedprovincias, setSelectedprovincias] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    const data = JSON.parse(window.localStorage.getItem("institucion"));
    useEffect(() => {
        if (data) {
            const provinciaService = new ProvinciaService();
            provinciaService.getProvincias(setProvincias).then((res) => {
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
        setProvincia(emptyprovincia);
        setSubmitted(false);
        setProvinciaDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProvinciaDialog(false);
    };

    const hideDeleteProvinciaDialog = () => {
        setDeleteProvinciaDialog(false);
    };

    const hideDeleteProvinciasDialog = () => {
        setDeleteProvinciasDialog(false);
    };

    const saveprovincia = () => {
        setSubmitted(true);

        const provinciaService = new ProvinciaService();
        if (provincia.nombre.trim()) {
            let _provincias = [...provincias];
            let _provincia = { ...provincia };
            if (provincia.id) {
                provinciaService.updateProvincia(provincia).then((res) => {
                    if (res === 401) {
                        window.localStorage.removeItem("institucion");
                        history.push("/");
                    }
                });
                const index = findIndexById(provincia.id);
                _provincias[index] = _provincia;
                toast.current.show({ severity: "success", summary: "Successful", detail: "provincia Updated", life: 3000 });
                setProvincias(_provincias);
            } else {
                provinciaService.postProvince(provincia).then((res) => {
                    if (res === 401) {
                        window.localStorage.removeItem("institucion");
                        history.push("/");
                    } else {
                        _provincias.push({ ...res });
                        setProvincias(_provincias);
                    }
                });

                toast.current.show({ severity: "success", summary: "Successful", detail: "provincia Created", life: 3000 });
            }

            setProvinciaDialog(false);
            setProvincia(emptyprovincia);
        }
    };

    const editprovincia = (provincia) => {
        setProvincia({ ...provincia });
        setProvinciaDialog(true);
    };

    const confirmDeleteProvincia = (provincia) => {
        setProvincia(provincia);
        setDeleteProvinciaDialog(true);
    };

    const deleteProvincia = () => {
        const provinciaService = new ProvinciaService();
        let _provincias;
        provinciaService.deleteProvincia(provincia.id).then((res) => {
            if (res === 500) {
                toast.current.show({ severity: "error", summary: "Error Message", detail: "provincia no eliminada", life: 3000 });
            } else if (res === 401) {
                history.push("/");
                window.localStorage.removeItem("institucion");
            } else {
                _provincias = provincias.filter((val) => val.id !== provincia.id);
                setProvincias(_provincias);
                setProvincia(emptyprovincia);
                toast.current.show({ severity: "success", summary: "Successful", detail: "provincia eliminada", life: 3000 });
            }
        });
        setDeleteProvinciaDialog(false);
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < provincias.length; i++) {
            if (provincias[i].id === id) {
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
        setDeleteProvinciasDialog(true);
    };

    const deleteSelectedprovincias = () => {
        const provinciaService = new ProvinciaService();
        let _provincias;
        selectedprovincias.map((res) =>
            provinciaService.deleteProvincia(res.id).then((res) => {
                if (res === 500) {
                    toast.current.show({ severity: "error", summary: "Error Message", detail: "provincias no eliminadas", life: 3000 });
                } else if (res === 401) {
                    window.localStorage.removeItem("institucion");
                    history.push("/");
                } else {
                    _provincias = provincias.filter((val) => !selectedprovincias.includes(val));
                    setProvincias(_provincias);
                    setSelectedprovincias(null);
                    toast.current.show({ severity: "success", summary: "Successful", detail: "provincias eliminadas", life: 3000 });
                }
            })
        );
        setDeleteProvinciasDialog(false);
    };

    const onNameChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _provincia = { ...provincia };
        _provincia[`${name}`] = val;

        setProvincia(_provincia);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedprovincias || !selectedprovincias.length} />
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
                <span className="p-column-title">Nombre</span>
                {rowData.nombre}
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editprovincia(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteProvincia(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage provincias</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const provinciaDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveprovincia} />
        </>
    );
    const deleteProvinciaDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProvinciaDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProvincia} />
        </>
    );
    const deleteProvinciasDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProvinciasDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedprovincias} />
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
                        value={provincias}
                        selection={selectedprovincias}
                        onSelectionChange={(e) => setSelectedprovincias(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} provincias"
                        globalFilter={globalFilter}
                        emptyMessage="No provincias found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="id" header="id" sortable body={codeBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="nombre" header="Nombre" sortable body={numberBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>

                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={provinciaDialog} style={{ width: "450px" }} header="provincia" modal className="p-fluid" footer={provinciaDialogFooter} onHide={hideDialog}>
                        {provincia.image && <img src={`assets/demo/images/provincia/${provincia.image}`} alt={provincia.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="nombre">Nombre</label>
                            <InputText id="nombre" value={provincia.nombre} onChange={(e) => onNameChange(e, "nombre")} required autoFocus className={classNames({ "p-invalid": submitted && !provincia.nombre })} />
                            {submitted && !provincia.nombre && <small className="p-invalid">Numero es requerido</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProvinciaDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProvinciaDialogFooter} onHide={hideDeleteProvinciaDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {provincia && (
                                <span>
                                    ¿Está seguro que desea eliminar esta provincia? <b>{provincia.name}</b>
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProvinciasDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProvinciasDialogFooter} onHide={hideDeleteProvinciasDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {provincia && <span>¿Está seguro que desea eliminar las provincias seleccionadas?</span>}
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

export default React.memo(Provincia, comparisonFn);
