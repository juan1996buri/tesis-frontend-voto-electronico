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
import { ListaService } from "../service/ListaService";
import { ProcesoEleccionService } from "../service/ProcesoEleccionService";
import { InputSwitch } from "primereact/inputswitch";
import { Image } from "primereact/image";
import Avatar from "../images/Avatar.jpeg";

const Lista = () => {
    const history = useHistory();
    let emptylista = {
        id: "",
        nombre: "",
        activo: false,
    };

    const [listas, setListas] = useState([]);
    const [listaDialog, setListaDialog] = useState(false);
    const [procesoEleccion, setProcesoEleccion] = useState({});
    const [procesoElecciones, setProcesoElecciones] = useState([]);
    const [deleteListaDialog, setDeleteListaDialog] = useState(false);
    const [deleteListasDialog, setDeleteListasDialog] = useState(false);
    const [lista, setLista] = useState(emptylista);
    const [selectedlistas, setSelectedlistas] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [active, setActive] = useState(false);
    const [logo, setLogo] = useState("");

    const toast = useRef(null);
    const dt = useRef(null);

    const data = JSON.parse(window.localStorage.getItem("institucion"));
    useEffect(() => {
        if (data) {
            const listaService = new ListaService();
            listaService.getListas(data.ruc, setListas).then((res) => {
                if (res === 401) {
                    window.localStorage.removeItem("institucion");
                    history.push("/");
                }
            });
            const procesoEleccionesService = new ProcesoEleccionService();
            procesoEleccionesService.getProcesosElecciones(data.ruc, setProcesoElecciones);
        } else {
            history.push("/");
        }
    }, []);

    const openNew = () => {
        setProcesoEleccion(procesoElecciones[0]);

        setLista(emptylista);
        setSubmitted(false);
        setListaDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setListaDialog(false);
    };

    const hideDeleteListaDialog = () => {
        setDeleteListaDialog(false);
    };

    const hideDeleteListasDialog = () => {
        setDeleteListasDialog(false);
    };

    const savelista = () => {
        setSubmitted(true);
        if (logo) {
            lista.logo = logo;
        }
        if (active) {
            lista.activo = true;
        } else {
            lista.activo = false;
        }
        lista.procesoEleccion = procesoEleccion;
        const listaService = new ListaService();
        if (lista.nombre.trim() && procesoEleccion.nombre.trim()) {
            let _listas = [...listas];
            let _lista = { ...lista };

            if (lista.id) {
                listaService.updateLista(lista).then((res) => {
                    if (res === 401) {
                        window.localStorage.removeItem("institucion");
                        history.push("/");
                    }
                });
                const index = findIndexById(lista.id);
                _listas[index] = _lista;
                toast.current.show({ severity: "success", summary: "Successful", detail: "lista Updated", life: 3000 });
            } else {
                console.log(lista);
                listaService.postLista(lista).then((res) => {
                    if (res === 401) {
                        window.localStorage.removeItem("institucion");
                        history.push("/");
                    }
                });

                _listas.push(_lista);
                toast.current.show({ severity: "success", summary: "Successful", detail: "lista Created", life: 3000 });
            }
            setListas(_listas);
            setListaDialog(false);
            setLista(emptylista);
        }
    };

    const editLista = (lista) => {
        setActive(lista.activo);
        setProcesoEleccion(lista.procesoEleccion);
        setLista({ ...lista });
        setListaDialog(true);
    };

    const confirmDeleteLista = (lista) => {
        setLista(lista);
        setDeleteListaDialog(true);
    };

    const deleteLista = () => {
        const listaService = new ListaService();
        let _listas;
        listaService.deleteLista(lista.id).then((res) => {
            if (res === 500) {
                toast.current.show({ severity: "error", summary: "Error Message", detail: "lista no eliminada", life: 3000 });
            } else if (res === 401) {
                history.push("/");
                window.localStorage.removeItem("institucion");
            } else {
                _listas = listas.filter((val) => val.id !== lista.id);
                setListas(_listas);
                setLista(emptylista);
                toast.current.show({ severity: "success", summary: "Successful", detail: "lista eliminada", life: 3000 });
            }
        });
        setDeleteListaDialog(false);
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < listas.length; i++) {
            if (listas[i].id === id) {
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
        setDeleteListasDialog(true);
    };
    const onProcesoEleccion = (e) => {
        const { value, name } = e.target;
        setProcesoEleccion({ ...procesoEleccion, [name]: value });
    };

    const deleteSelectedlistas = () => {
        const listaService = new ListaService();
        let _listas;
        selectedlistas.map((res) =>
            listaService.deleteLista(res.id).then((res) => {
                if (res === 500) {
                    toast.current.show({ severity: "error", summary: "Error Message", detail: "listas no eliminadas", life: 3000 });
                } else if (res === 401) {
                    window.localStorage.removeItem("institucion");
                    history.push("/");
                } else {
                    _listas = listas.filter((val) => !selectedlistas.includes(val));
                    setListas(_listas);
                    setSelectedlistas(null);
                    toast.current.show({ severity: "success", summary: "Successful", detail: "listas eliminadas", life: 3000 });
                }
            })
        );
        setDeleteListasDialog(false);
    };

    const onNameChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _lista = { ...lista };
        _lista[`${name}`] = val;

        setLista(_lista);
    };

    const onUpload = async (e) => {
        //e.options.props.customUpload = false;
        const file = e.files[0];
        const reader = new FileReader();

        let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
            const base64data = reader.result;
            setLogo(base64data);
        };
        toast.current.show({ severity: "info", summary: "Success", detail: "Imagen cargada" });
    };

    const onCancel = () => {
        setLogo("");
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedlistas || !selectedlistas.length} />
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
    const procesoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.procesoEleccion.nombre}
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editLista(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteLista(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage listas</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const listaDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={savelista} />
        </>
    );
    const deleteListaDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteListaDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteLista} />
        </>
    );
    const deleteListasDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteListasDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedlistas} />
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
                        value={listas}
                        selection={selectedlistas}
                        onSelectionChange={(e) => setSelectedlistas(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} listas"
                        globalFilter={globalFilter}
                        emptyMessage="No listas found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="id" header="id" sortable body={codeBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="nombre" header="Nombre" sortable body={nombreBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="proceso" header="Proceso" sortable body={procesoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>

                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={listaDialog} style={{ width: "450px" }} header="lista" modal className="p-fluid" footer={listaDialogFooter} onHide={hideDialog}>
                        {lista.image && <img src={`assets/demo/images/lista/${lista.image}`} alt={lista.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="nombre">Nombre</label>
                            <InputText id="nombre" value={lista.nombre} onChange={(e) => onNameChange(e, "nombre")} required autoFocus className={classNames({ "p-invalid": submitted && !lista.nombre })} />
                            {submitted && !lista.nombre && <small className="p-invalid">Numero es requerido</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="provincia">Proceso Elección</label>
                            <Dropdown
                                id="nombre"
                                name="nombre"
                                value={procesoEleccion}
                                onChange={(e) => onProcesoEleccion(e)}
                                options={procesoElecciones}
                                optionLabel="nombre"
                                placeholder="Seleccione un proceso eleccion"
                                required
                                autoFocus
                                className={classNames({ "p-invalid": submitted && !procesoEleccion.nombre })}
                            />
                            {submitted && !procesoEleccion.nombre && <small className="p-invalid">Proceso eleccion es requerido</small>}
                        </div>
                        <div className="field">
                            <Image src={logo === "" ? lista?.logo : logo} alt="Image Text" width="400px" />
                        </div>
                        <div className="field">
                            <FileUpload name="image" accept="image/*" customUpload={true} chooseLabel={"Cargar"} uploadLabel={"Subir"} cancelLabel={"cancelar"} uploadHandler={onUpload} maxFileSize={1000000} onClear={onCancel} onRemove={onCancel} emptyTemplate={<p className="m-0"></p>} />
                        </div>
                        <InputSwitch checked={active} onChange={(e) => setActive(e.value)} color="primary" name="status" />
                    </Dialog>

                    <Dialog visible={deleteListaDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteListaDialogFooter} onHide={hideDeleteListaDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {lista && (
                                <span>
                                    ¿Está seguro que desea eliminar esta lista? <b>{lista.name}</b>
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteListasDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteListasDialogFooter} onHide={hideDeleteListasDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {lista && <span>¿Está seguro que desea eliminar las listas seleccionadas?</span>}
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

export default React.memo(Lista, comparisonFn);
