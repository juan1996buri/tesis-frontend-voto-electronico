import axios from "axios";
import authHeader from "./auth-header";

const url = "http://localhost:9090/api/v1.0/candidato/";

export class CandidatoService {
    getCandidatos(ruc, state) {
        return axios
            .get(url, { headers: authHeader() })
            .then((res) => {
                if (res.data.success) {
                    state(res.data.result.filter((item) => item.procesoEleccion.institucion.ruc === ruc));
                    return res.data.result.filter((item) => item.procesoEleccion.institucion.ruc === ruc);
                }
            })
            .catch(function (error) {
                if (error.response) {
                    return error.response.status;
                }
            });
    }

    getCandidatosAVotar(votante) {
        return axios
            .get(url)
            .then((res) => {
                if (res.data.success) {
                    const data = res.data.result;
                    const candidatos = data.filter((item) => item.votante.institucion.id === votante.institucion.id);
                    const candidatosProcesoEleccionActivos = candidatos.filter((item) => item.procesoEleccion.activo === true);
                    const candidatosListasActivos = candidatosProcesoEleccionActivos.filter((item) => item.lista.activo === true);
                    return candidatosListasActivos;
                }
            })
            .catch(function (error) {
                if (error.response) {
                    return error.response.status;
                }
            });
    }
    postCandidato(data) {
        return axios
            .post(url, data, { headers: authHeader() })
            .then((res) => {
                if (res.data.success) {
                    return res.data.result;
                }
            })
            .catch(function (error) {
                if (error.response) {
                    return error.response.status;
                }
            });
    }
    updateCandidato(data) {
        return axios.put(url, data, { headers: authHeader() }).catch(function (error) {
            if (error.response) {
                return error.response.status;
            }
        });
    }
    deleteCandidato(id) {
        return axios
            .delete(url + id, { headers: authHeader() })
            .then((resp) => resp.data.success)
            .catch(function (error) {
                return error.response.data.status;
            });
    }
}
