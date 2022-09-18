import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { useHistory } from "react-router-dom";
import { VotanteService } from "../service/VotanteService";
import { Dropdown } from "primereact/dropdown";
import { ProcesoEleccionService } from "../service/ProcesoEleccionService";
import { VotoService } from "../service/VotoService";
import { GrupoService } from "../service/GrupoService";

const Ausentes = () => {
    const history = useHistory();
    const [procesoElecciones, setProcesoElecciones] = useState([]);
    const [procesoEleccion, setProcesoEleccion] = useState({ id: "", nombre: "" });
    const [grupos, setGrupos] = useState([]);
    const [votantes, setVotantes] = useState([]);
    const [activo, setActivo] = useState(false);
    const toast = useRef(null);
    const dt = useRef(null);

    const data = JSON.parse(window.localStorage.getItem("institucion"));
    useEffect(() => {
        if (data) {
            const procesoEleccionService = new ProcesoEleccionService();
            procesoEleccionService.getProcesosElecciones(data.ruc, setProcesoElecciones);
        } else {
            history.push("/");
        }
    }, []);

    const onProcesoEleccion = (e) => {
        setProcesoEleccion(e.value);
        const votoService = new VotoService();
        votoService.getVotos(data.ruc).then((_votos) => {
            if (_votos !== 404) {
                const votos = _votos.filter((item) => item.procesoEleccion.id === e.value.id);
                const votanteService = new VotanteService();
                votanteService.getVotantes(data.ruc, setVotantes).then((_votantes) => {
                    if (_votantes !== 404) {
                        /* _votantes
                            .filter((_votante) => {
                                let res = votos.find((voto) => {
                                    return voto.votante.id == _votante.id;
                                });
                                return res == undefined;
                            })
                            .map((item) => {
                                setVotantes((votantes) => votantes.concat(item));
                            });*/
                        setVotantes(
                            _votantes.filter((_votante) => {
                                let res = votos.find((voto) => {
                                    return voto.votante.id === _votante.id;
                                });
                                return res === undefined;
                            })
                        );
                    }
                });
            }
            const grupoService = new GrupoService();
            grupoService.getGrupos(data.ruc, setGrupos);
        });
        setActivo(true);
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
    const apellidoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.apellido}
            </>
        );
    };
    const juntaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Junta</span>
                {rowData.grupo.junta.numero}
            </>
        );
    };
    const recintoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Junta</span>
                {rowData.grupo.junta.recinto.nombre}
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return <div className="actions"></div>;
    };

    const header = (grupo) => (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">{grupo.nombre}</h5>
        </div>
    );

    return (
        <div className="grid crud-demo">
            <div>
                <label htmlFor="procesoEleccion">Proceso Elección</label>
                <br />
                <Dropdown id="nombre" name="procesoEleccion" value={procesoEleccion} onChange={(e) => onProcesoEleccion(e)} options={procesoElecciones} optionLabel="nombre" placeholder="Seleccione un proceso eleccion" required autoFocus />
            </div>

            {activo && (
                <div className="col-12">
                    {grupos.map((grupo) => (
                        <div className="card" key={grupo.id}>
                            <Toast ref={toast} />
                            <div>
                                <br />
                                <DataTable
                                    ref={dt}
                                    value={votantes.filter((item) => item.grupo.id === grupo.id)}
                                    dataKey="id"
                                    paginator
                                    rows={10}
                                    rowsPerPageOptions={[5, 10, 25]}
                                    className="datatable-responsive"
                                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} ausentes"
                                    emptyMessage="No ausentes found."
                                    header={header(grupo)}
                                    responsiveLayout="scroll"
                                >
                                    <Column field="id" header="id" sortable body={codeBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                                    <Column field="nombre" header="Nombre" sortable body={nombreBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                                    <Column field="apellido" header="Apellido" sortable body={apellidoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                                    <Column field="junta" header="Junta" sortable body={juntaBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                                    <Column field="recinto" header="Recinto" sortable body={recintoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>

                                    <Column body={actionBodyTemplate}></Column>
                                </DataTable>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Ausentes, comparisonFn);
