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

const Provincia = () => {
    let emptyProvincia = {
        id: "",
        nombre: "",
    };

    const [provincias, setProvincias] = useState([]);
    const [provinciaDialog, setProvinciaDialog] = useState(false);
    const [active, setActive] = useState(false);
    const [deleteProvinciaDialog, setDeleteProvinciaDialog] = useState(false);
    const [provincia, setProvincia] = useState(emptyProvincia);
    const [selectedProvincias, setselectedProvincias] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const provincia = new ProvinciaService();
        provincia.getProvincias(setProvincias);
    }, []);

    const openNew = () => {
        setProvincia(emptyProvincia);
        setSubmitted(false);
        setProvinciaDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProvinciaDialog(false);
    };

    const hideDeleteprovinciaDialog = () => {
        setDeleteProvinciaDialog(false);
    };

    const saveprovincia = () => {
        setSubmitted(true);

        if (provincia.nombre.trim()) {
            let _provincias = [...provincias];
            let _provincia = { ...provincia };
            if (provincia.id) {
                const object = new ProvinciaService();
                object.updateProvincia(provincia);
                const index = findIndexById(provincia.id);
                _provincias[index] = _provincia;
                toast.current.show({ severity: "success", summary: "Successful", detail: "provincia Updated", life: 3000 });
            } else {
                const object = new ProvinciaService();
                object.createProvince(provincia);
                _provincias.push(_provincia);
                toast.current.show({ severity: "success", summary: "Successful", detail: "provincia Created", life: 3000 });
                window.location.reload();
            }
            setProvincias(_provincias);
            setProvinciaDialog(false);
            setProvincia(emptyProvincia);
        }
    };

    const editprovincia = (provincia) => {
        setProvincia({ ...provincia });
        setProvinciaDialog(true);
    };

    const confirmDeleteprovincia = (provincia) => {
        setProvincia(provincia);
        setDeleteProvinciaDialog(true);
    };

    const deleteprovincia = () => {
        const object = new ProvinciaService();
        object.deleteProvincia(provincia.id, setActive);
        if (active) {
            let _provincias = provincias.filter((val) => val.id !== provincia.id);
            setProvincias(_provincias);
            setDeleteProvinciaDialog(false);
            setProvincia(emptyProvincia);
            toast.current.show({ severity: "success", summary: "Successful", detail: "provincia Deleted", life: 3000 });
        } else {
        }

        toast.current.show({ severity: "success", summary: "Successful", detail: "denegado", life: 3000 });
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

    const onInputChange = (e, nombre) => {
        const val = (e.target && e.target.value) || "";
        let _provincia = { ...provincia };
        _provincia[`${nombre}`] = val;

        setProvincia(_provincia);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                </div>
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

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editprovincia(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteprovincia(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Provincia</h5>
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
    const deleteprovinciaDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteprovinciaDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteprovincia} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={provincias}
                        selection={selectedProvincias}
                        onSelectionChange={(e) => setselectedProvincias(e.value)}
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
                        <Column field="id" header="Id" sortable body={codeBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="nombre" header="Nombre" sortable body={nameBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>

                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={provinciaDialog} style={{ width: "450px" }} header="Provincia" modal className="p-fluid" footer={provinciaDialogFooter} onHide={hideDialog}>
                        {provincia.image && <img src={`assets/demo/images/provincia/${provincia.image}`} alt={provincia.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="name">Nombre</label>
                            <InputText id="name" value={provincia.nombre} onChange={(e) => onInputChange(e, "nombre")} required autoFocus className={classNames({ "p-invalid": submitted && !provincia.name })} />
                            {submitted && !provincia.name && <small className="p-invalid">Se requiere un nombre</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProvinciaDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteprovinciaDialogFooter} onHide={hideDeleteprovinciaDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {provincia && (
                                <span>
                                    ¿Estás segura de que quieres eliminar? <b>{provincia.name}</b>?
                                </span>
                            )}
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
