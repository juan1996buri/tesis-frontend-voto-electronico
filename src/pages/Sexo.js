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
import { SexoService } from "../service/SexoService";

const Sexo = () => {
    const history = useHistory();
    let emptysexo = {
        id: "",
        nombre: "",
    };

    const [sexos, setSexos] = useState([]);
    const [sexoDialog, setSexoDialog] = useState(false);
    const [deleteSexoDialog, setDeleteSexoDialog] = useState(false);
    const [deleteSexosDialog, setDeleteSexosDialog] = useState(false);
    const [sexo, setSexo] = useState(emptysexo);
    const [selectedSexos, setSelectedSexos] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    const data = JSON.parse(window.localStorage.getItem("institucion"));
    useEffect(() => {
        if (data) {
            const sexoService = new SexoService();
            sexoService.getSexos(setSexos).then((res) => {
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
        setSexo(emptysexo);
        setSubmitted(false);
        setSexoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setSexoDialog(false);
    };

    const hideDeleteSexoDialog = () => {
        setDeleteSexoDialog(false);
    };

    const hideDeleteSexosDialog = () => {
        setDeleteSexosDialog(false);
    };

    const savesexo = () => {
        setSubmitted(true);

        const sexoService = new SexoService();
        if (sexo.nombre.trim()) {
            let _sexos = [...sexos];
            let _sexo = { ...sexo };
            if (sexo.id) {
                sexoService.updateSexo(sexo).then((res) => {
                    if (res === 401) {
                        window.localStorage.removeItem("institucion");
                        history.push("/");
                    } else if (res === 500) {
                        return toast.current.show({ severity: "error", summary: "Error Message", detail: "El sexo ya existe", life: 3000 });
                    }
                });
                const index = findIndexById(sexo.id);
                _sexos[index] = _sexo;
                setSexos(_sexos);
                toast.current.show({ severity: "success", summary: "Successful", detail: "Sexo actualizado", life: 3000 });
            } else {
                sexoService.postSexo(sexo).then((res) => {
                    if (res === 401) {
                        window.localStorage.removeItem("institucion");
                        history.push("/");
                    } else if (res === 500) {
                        return toast.current.show({ severity: "error", summary: "Error Message", detail: "El sexo ya existe", life: 3000 });
                    } else {
                        toast.current.show({ severity: "success", summary: "Successful", detail: "Sexo creado", life: 3000 });
                        _sexos.push(res);
                        setSexos(_sexos);
                    }
                });
            }

            setSexoDialog(false);
            setSexo(emptysexo);
        }
    };

    const editsexo = (sexo) => {
        setSexo({ ...sexo });
        setSexoDialog(true);
    };

    const confirmDeleteSexo = (sexo) => {
        setSexo(sexo);
        setDeleteSexoDialog(true);
    };

    const deleteSexo = () => {
        const sexoService = new SexoService();
        let _sexos;
        sexoService.deleteSexo(sexo.id).then((res) => {
            if (res === 500) {
                toast.current.show({ severity: "error", summary: "Error Message", detail: "Sexo no eliminado", life: 3000 });
            } else if (res === 401) {
                history.push("/");
                window.localStorage.removeItem("institucion");
            } else {
                _sexos = sexos.filter((val) => val.id !== sexo.id);
                setSexos(_sexos);
                setSexo(emptysexo);
                toast.current.show({ severity: "success", summary: "Successful", detail: "Sexo eliminado", life: 3000 });
            }
        });
        setDeleteSexoDialog(false);
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < sexos.length; i++) {
            if (sexos[i].id === id) {
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
        setDeleteSexosDialog(true);
    };

    const deleteSelectedSexos = () => {
        const sexoService = new SexoService();
        let _sexos;
        selectedSexos.map((res) =>
            sexoService.deleteSexo(res.id).then((res) => {
                if (res === 500) {
                    toast.current.show({ severity: "error", summary: "Error Message", detail: "Sexos no eliminados", life: 3000 });
                } else if (res === 401) {
                    window.localStorage.removeItem("institucion");
                    history.push("/");
                } else {
                    _sexos = sexos.filter((val) => !selectedSexos.includes(val));
                    setSexos(_sexos);
                    setSelectedSexos(null);
                    toast.current.show({ severity: "success", summary: "Successful", detail: "Sexos eliminados", life: 3000 });
                }
            })
        );
        setDeleteSexosDialog(false);
    };

    const onNameChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _sexo = { ...sexo };
        _sexo[`${name}`] = val;

        setSexo(_sexo);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="Eliminar" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedSexos || !selectedSexos.length} />
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editsexo(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteSexo(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Sexos</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const sexoDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={savesexo} />
        </>
    );
    const deleteSexoDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteSexoDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteSexo} />
        </>
    );
    const deleteSexosDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteSexosDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedSexos} />
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
                        value={sexos}
                        selection={selectedSexos}
                        onSelectionChange={(e) => setSelectedSexos(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} sexos"
                        globalFilter={globalFilter}
                        emptyMessage="No existe los sexos"
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="id" header="id" sortable body={codeBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="nombre" header="Nombre" sortable body={numberBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>

                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={sexoDialog} style={{ width: "450px" }} header="Sexo" modal className="p-fluid" footer={sexoDialogFooter} onHide={hideDialog}>
                        {sexo.image && <img src={`assets/demo/images/sexo/${sexo.image}`} alt={sexo.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="nombre">Nombre</label>
                            <InputText id="nombre" value={sexo.nombre} onChange={(e) => onNameChange(e, "nombre")} required autoFocus className={classNames({ "p-invalid": submitted && !sexo.nombre })} />
                            {submitted && !sexo.nombre && <small className="p-invalid">Numero es requerido</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteSexoDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteSexoDialogFooter} onHide={hideDeleteSexoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {sexo && (
                                <span>
                                    ¿Está seguro que desea eliminar esta sexo? <b>{sexo.name}</b>
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteSexosDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteSexosDialogFooter} onHide={hideDeleteSexosDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {sexo && <span>¿Está seguro que desea eliminar las sexos seleccionadas?</span>}
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

export default React.memo(Sexo, comparisonFn);
