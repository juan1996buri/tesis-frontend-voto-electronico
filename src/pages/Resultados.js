import React, { useEffect, useState } from "react";
import Nulo from "../images/Nulo.png";
import "../styles/Resultados.css";
import { Dropdown } from "primereact/dropdown";

import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useHistory } from "react-router-dom";
import { ProcesoEleccionService } from "../service/ProcesoEleccionService";
import { VotoService } from "../service/VotoService";
import { ListaService } from "../service/ListaService";
import { CandidatoService } from "../service/CandidatoService";
import { VotanteService } from "../service/VotanteService";
function LinearProgressWithLabel(props) {
    return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: "100%", mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
}
const Resultados = () => {
    const data = JSON.parse(window.localStorage.getItem("institucion"));
    const history = useHistory();
    const [procesoElecciones, setProcesoElecciones] = useState([]);
    const [procesoEleccion, setProcesoEleccion] = useState({ id: "", nombre: "" });
    const [votos, setVotos] = useState([]);
    const [listas, setListas] = useState([]);
    const [candidatos, setCandidatos] = useState([]);
    const [cantidad, setCantidad] = useState(0);

    const [votantes, setVotantes] = useState([]);

    const [activo, setActivo] = useState(false);

    const onProcesoEleccion = (e) => {
        setProcesoEleccion(e.value);
        const listaService = new ListaService();
        const candidatoService = new CandidatoService();

        listaService.getListas(data.ruc, setListas).then((_lista) => {
            if (_lista !== 404) {
                setListas(_lista.filter((item) => item.procesoEleccion.nombre === e.value.nombre));
            }
            candidatoService.getCandidatos(data.ruc, setCandidatos).then((candidato) => {
                if (candidato !== 404) {
                    setCandidatos(candidato.filter((item) => item.lista.procesoEleccion.nombre === e.value.nombre));
                }
            });
            const votoService = new VotoService();
            votoService.getVotos(data.ruc, setVotos).then((voto) => {
                if (voto !== 404) {
                    const votosValidos = voto.filter((item) => item.procesoEleccion.nombre === e.value.nombre);
                    setVotos(votosValidos);
                    votosValidos.forEach((element) => {
                        setCantidad((cantidad) => cantidad + 1);
                    });
                }
            });
            const votanteService = new VotanteService();
            votanteService.getVotantes(data.ruc, setVotantes);
        });

        setActivo(true);
    };
    useEffect(() => {
        if (data) {
            const procesoEleccionService = new ProcesoEleccionService();
            procesoEleccionService.getProcesosElecciones(data.ruc, setProcesoElecciones);
        } else {
            history.push("/");
        }
    }, []);

    let resp = 0;
    return (
        <div className="container_resultado">
            <div>
                <div>
                    <label htmlFor="procesoEleccion">Proceso Elección</label>
                    <br />
                    <Dropdown id="nombre" name="procesoEleccion" value={procesoEleccion} onChange={(e) => onProcesoEleccion(e)} options={procesoElecciones} optionLabel="nombre" placeholder="Seleccione un proceso eleccion" required autoFocus />
                </div>

                {activo && (
                    <div>
                        <div className="resultado_lista_nombre">
                            <h2 style={{ fontWeight: "bold" }}>{procesoEleccion?.nombre}</h2>
                        </div>
                        {listas.map((lista) => (
                            <div key={lista.id} style={{ display: "flex", flexDirection: "column" }}>
                                <br />
                                <div className="resultado_lista_container">
                                    <div className="resultado_lista_nombre">
                                        <img src={lista.logo} style={{ width: "3rem", height: "3rem", borderRadius: "50%" }} alt={"logo"} />
                                        <h2 style={{ fontWeight: "bold" }}>{lista.nombre}</h2>
                                    </div>
                                    <div className="resultado_listas">
                                        <div className="resultado_lista">
                                            {candidatos
                                                .filter((item) => item.lista.nombre === lista.nombre)
                                                .map((candidato) => (
                                                    <div className="resultado_lista_integrante" key={candidato.id}>
                                                        <h3 className="restultado_integrante_cargo" style={{ fontWeight: "bold" }}>
                                                            {candidato.tipoCandidato.nombre}
                                                        </h3>
                                                        <div className="resultado_integrante_datos">
                                                            <img src={candidato.imagen} className={"resultado_integrante_imagen"} alt={"integrante"} />
                                                            <div>
                                                                <h4> {candidato.nombre}</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                        <div className="resultado_barra">
                                            <h3 style={{ fontWeight: "bold", height: "10%" }}>Porcentaje</h3>
                                            <div className={"resultado_porcentaje"}>
                                                <Box sx={{ width: "100%" }}>
                                                    {
                                                        (votos
                                                            .filter((item) => lista.nombre === item.lista.nombre)
                                                            .map((voto) => {
                                                                if (voto.lista.nombre === lista.nombre) {
                                                                    resp++;
                                                                }
                                                            }, (resp = 0)),
                                                        (<LinearProgressWithLabel value={(resp * 100) / cantidad} style={{ height: "1rem" }} />))
                                                    }
                                                </Box>
                                            </div>
                                            {console.log(cantidad)}
                                        </div>

                                        <div className="resultado_cantidad">
                                            <h3 style={{ fontWeight: "bold", height: "10%" }}>Votos</h3>
                                            {
                                                (votos
                                                    .filter((item) => lista.nombre === item.lista.nombre)
                                                    .map((voto) => {
                                                        if (voto.lista.nombre === lista.nombre) {
                                                            resp++;
                                                        }
                                                    }, (resp = 0)),
                                                (
                                                    <div className="resultado_votos">
                                                        <h3>{resp}</h3>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div style={{ fontSize: "1.5rem", display: "flex", flexDirection: "column", marginTop: "1.5rem", gap: "1rem", fontWeight: "unset", fontFamily: "cursive" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                <span>Empadronados</span>
                                <span>{cantidad}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                <span>Votantes</span>
                                <span>{cantidad}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                <span>Ausentes</span>
                                <span>{cantidad}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Resultados;
