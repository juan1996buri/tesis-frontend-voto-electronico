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
import { InstitucionService } from "../service/InstitucionService";
import { InputSwitch } from "primereact/inputswitch";
import { UserService } from "../service/UserService";
import { Image } from "primereact/image";
import Avatar from "../images/Avatar.jpeg";

const Institucion = () => {
    const history = useHistory();
    let emptyinstitucion = {
        id: "",
        correo: "",
        logo: "",
        nombre: "",
        ciudad: "",
        direccion: "charasol",
        telefono: "1234567889112",
        ruc: "ruc",
        tipoInstitucion: "",
        activo: "",
    };

    const [instituciones, setInstituciones] = useState([]);
    //const [usuarios, setUsuarios] = useState([]);
    const [institucionDialog, setInstitucionDialog] = useState(false);
    const [institucion, setInstitucion] = useState(emptyinstitucion);
    const [submitted, setSubmitted] = useState(false);
    const [active, setActive] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [logo, setLogo] = useState("");
    const toast = useRef(null);
    const dt = useRef(null);

    const data = JSON.parse(window.localStorage.getItem("institucion"));
    useEffect(() => {
        if (data) {
            const userService = new UserService();
            const institucionService = new InstitucionService();
            userService.getUsers().then((res) => {
                res.filter((f) => f.roles.nombre !== "ROLE_ADMIN").map((u) => {
                    institucionService.getInstitucion(u.ruc, setInstitucion).then((i) => {
                        setInstituciones((inst) => inst.concat(i));
                    });
                });
            });
        } else {
            history.push("/");
        }
    }, []);

    const hideDialog = () => {
        setSubmitted(false);
        setInstitucionDialog(false);
    };

    const saveInstitucion = () => {
        setSubmitted(true);
        if (active) {
            institucion.activo = true;
        } else {
            institucion.activo = false;
        }

        const institucioneservice = new InstitucionService();
        if (institucion.nombre.trim()) {
            let _instituciones = [...instituciones];
            let _institucion = { ...institucion };

            if (institucion.id) {
                institucioneservice.updateInstitucion(institucion).then((res) => {
                    if (res === 401) {
                        window.localStorage.removeItem("institucion");
                        history.push("/");
                    }
                });
                const index = findIndexById(institucion.id);
                _instituciones[index] = _institucion;
                toast.current.show({ severity: "success", summary: "Successful", detail: "institucion Updated", life: 3000 });
            }

            setInstituciones(_instituciones);
            setInstitucionDialog(false);
            setInstitucion(emptyinstitucion);
        }
    };

    const editInstitucion = (institucion) => {
        setLogo(institucion.logo);
        setActive(institucion.activo);
        setInstitucion({ ...institucion });
        setInstitucionDialog(true);
    };
    const activoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Estado</span>
                {rowData.activo ? <span style={{ backgroundColor: "red", borderRadius: "1rem", padding: "1rem", color: "white" }}>Activado</span> : <span style={{ backgroundColor: "green", borderRadius: "1rem", padding: "1rem", color: "white" }}>Desactivado</span>}
            </>
        );
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < instituciones.length; i++) {
            if (instituciones[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
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

    const rucBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.ruc}
            </>
        );
    };
    const correoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.correo}
            </>
        );
    };

    const ciudadProvinciaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.ciudad.provincia.nombre}-{rowData.ciudad.nombre}
            </>
        );
    };
    const direccionBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.direccion}
            </>
        );
    };

    const tipoInstitucionBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">tipoInstitucion</span>
                {rowData.tipoInstitucion.nombre}
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editInstitucion(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage instituciones</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const institucionDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveInstitucion} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={instituciones}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} instituciones"
                        globalFilter={globalFilter}
                        emptyMessage="No instituciones found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column field="id" header="id" sortable body={codeBodyTemplate} headerStyle={{ width: "14%", minWidth: "5rem" }}></Column>
                        <Column field="ruc" header="Ruc" sortable body={rucBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="correo" header="Correo" sortable body={correoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="direccion" header="Direccion" sortable body={direccionBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="provincia/ciudad" header="Provincia/Ciudad" sortable body={ciudadProvinciaBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="tipoInstitucion" header="Tipo Institucion" sortable body={tipoInstitucionBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="estado" header="Estado" sortable body={activoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>

                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={institucionDialog} style={{ width: "450px" }} header="Institucion" modal className="p-fluid" footer={institucionDialogFooter} onHide={hideDialog}>
                        {institucion.image && <img src={`assets/demo/images/institucion/${institucion.image}`} alt={institucion.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <h6 style={{ fontWeight: "bold" }}>Ruc</h6>
                            <h6>{institucion.ruc}</h6>
                        </div>
                        <div className="field">
                            <h6 style={{ fontWeight: "bold" }}>Nombre</h6>
                            <h6>{institucion.nombre}</h6>
                        </div>
                        <div className="field">
                            <h6 style={{ fontWeight: "bold" }}>E-mail</h6>
                            <h6>{institucion.correo}</h6>
                        </div>
                        <div className="field">
                            <h6 style={{ fontWeight: "bold" }}>Telefono</h6>
                            <h6>{institucion.telefono}</h6>
                        </div>
                        <div className="field ">
                            <h6 style={{ fontWeight: "bold" }}>Ubicación</h6>
                            <div className="flex">
                                <div>{institucion.ciudad.provincia?.nombre}-</div>
                                <div>{institucion.ciudad.nombre}</div>
                            </div>
                        </div>
                        <div className="field">
                            <h6 style={{ fontWeight: "bold" }}>Tipo Institucion</h6>
                            <h6>{institucion.tipoInstitucion.nombre}</h6>
                        </div>
                        <div className="field">
                            <Image src={logo === null ? Avatar : institucion.logo} width="200px" height="220px" />
                        </div>
                        <div className="field">
                            <InputSwitch checked={active} onChange={(e) => setActive(e.value)} color="primary" name="status" />
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

export default React.memo(Institucion, comparisonFn);
