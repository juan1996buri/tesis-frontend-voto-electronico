import React, { useEffect } from "react";
import Nulo from "../images/Nulo.png";
import "../styles/Resultados.css";

import LinearProgress, { LinearProgressProps } from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
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
    const [progress, setProgress] = React.useState(100);
    useEffect(() => {}, []);
    return (
        <div className="container_resultado">
            <div>
                <div className="resultado_lista_nombre">
                    <img src={Nulo} style={{ width: "3rem", height: "3rem" }} alt={"logo"} />
                    <h2 style={{ fontWeight: "bold" }}>Nombre de la lista</h2>
                </div>
                <div className="resultado_listas">
                    <div className="resultado_lista">
                        <div className="resultado_lista_integrante">
                            <h3 className="restultado_integrante_cargo" style={{ fontWeight: "bold" }}>
                                Presidente
                            </h3>
                            <div className="resultado_integrante_datos">
                                <img src={Nulo} className={"resultado_integrante_imagen"} alt={"integrante"} />
                                <div>
                                    <h4>Nombre</h4>
                                    <h4>Apellido</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="resultado_barra">
                        <h3 style={{ fontWeight: "bold", height: "10%" }}>Porcentaje</h3>
                        <div className={"resultado_porcentaje"}>
                            <Box sx={{ width: "100%" }}>
                                <LinearProgressWithLabel value={progress} style={{ height: "1rem" }} />
                            </Box>
                        </div>
                    </div>
                    <div className="resultado_cantidad">
                        <h3 style={{ fontWeight: "bold", height: "10%" }}>Votos</h3>
                        <div className="resultado_votos">
                            <h2>45</h2>
                        </div>
                    </div>
                </div>
                <div className="resultados_division"></div>
            </div>
        </div>
    );
};

export default Resultados;
