import React, { useEffect, useState } from "react";
import "../styles/Sufragar.css";
import Nulo from "../images/Nulo.png";
import { Button } from "primereact/button";
import { useHistory } from "react-router-dom";
import { VotanteService } from "../service/VotanteService";
import { ListaService } from "../service/ListaService";
import { CandidatoService } from "../service/CandidatoService";
import { VotoService } from "../service/VotoService";
import { ProcesoEleccionService } from "../service/ProcesoEleccionService";
import Swal from "sweetalert2";

const Sufragar = () => {
    const history = useHistory();

    const data = JSON.parse(window.localStorage.getItem("institucion"));

    const [listas, setListas] = useState([]);
    const [votante, setVotante] = useState({});
    const [candidatos, setCandidatos] = useState([]);
    const [procesoEleccion, setProcesoEleccion] = useState([]);
    const voto = { id: "", lista: "", votante: "", procesoEleccion: "" };
    const validarVoto = {
        idVotante: "",
        idProcesoEleccion: "",
    };

    useEffect(() => {
        if (data) {
            const votanteService = new VotanteService();
            const listaService = new ListaService();
            const candidatosService = new CandidatoService();
            const procesoEleccion = new ProcesoEleccionService();
            votanteService.getVotante(data.cedula).then((votante) => {
                setVotante(votante);
                procesoEleccion.getProcesoEleccionAVotar(votante).then((proceso) => {
                    setProcesoEleccion(proceso[0]);
                    if (proceso[0]?.activo === true) {
                        listaService.getListasAVotar(votante).then((lista) => {
                            const listaAVotar = lista.filter((item) => item.procesoEleccion.nombre === proceso[0].nombre);
                            setListas(listaAVotar);
                        });
                        candidatosService.getCandidatosAVotar(votante).then((candidato) => {
                            setCandidatos(candidato);
                        });
                    }
                });
            });
        } else {
            history.push("/");
        }
    }, []);

    const handleVoto = (lista) => {
        console.log(lista);
        voto.lista = lista;
        voto.votante = votante;
        voto.procesoEleccion = { ...lista.procesoEleccion };
        validarVoto.idProcesoEleccion = lista.procesoEleccion.id;
        validarVoto.idVotante = votante.id;

        const votoService = new VotoService();
        votoService.postVerificarVoto(validarVoto).then((res) => {
            if (res.success) {
                votoService.postVoto(voto);
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "VOTO VALIDADO",
                    confirmButtonText: "SALIR",
                    showConfirmButton: true,
                }).then((res) => {
                    if (res.isConfirmed) {
                        window.localStorage.removeItem("institucion");
                        history.push("/");
                    }
                });
            } else {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "YA HAS VOTADO EN ESTE PRCESO",
                    confirmButtonText: "SALIR",
                    showConfirmButton: true,
                }).then((res) => {
                    if (res.isConfirmed) {
                        window.localStorage.removeItem("institucion");
                        history.push("/");
                    }
                });
            }
        });
    };
    return (
        <div className="container_sufragar">
            <div className="title-sufragar">
                <h1 style={{ fontWeight: "bold" }}>{procesoEleccion?.nombre}</h1>
            </div>
            <div className="container_listas  p-fluid">
                {listas.map((lista) => (
                    <div className="container-lista" key={lista.id}>
                        <div className="lista-cabecera">
                            <img alt="logo" src={lista?.logo} style={{ width: "3rem", height: "3rem", borderRadius: "50%" }} />
                            <h2 style={{ fontWeight: "bolder" }}>{lista.nombre}</h2>
                        </div>

                        {candidatos
                            .filter((candidato) => candidato.lista.nombre === lista.nombre)
                            .map((candidato) => (
                                <div className="lista-integrantes" key={candidato.id}>
                                    <h3 className="lista-nombre" style={{ fontWeight: "bolder", fontFamily: "inherit" }}>
                                        {candidato.tipoCandidato.nombre}
                                    </h3>
                                    <div className="lista-usuario">
                                        <img src={candidato.imagen} className="lista-imagen" alt="imagen" />
                                        <div>
                                            <h4>{candidato.votante.nombre}</h4>
                                            <h4>{candidato.votante.apellido}</h4>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        <br />
                        <Button label="VOTAR" className="p-button-success mr-2" onClick={() => handleVoto(lista)} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sufragar;
