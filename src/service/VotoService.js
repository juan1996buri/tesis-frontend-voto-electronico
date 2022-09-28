import axios from "axios";
import authHeader from "./auth-header";

const url = "http://localhost:9090/api/v1.0/voto/";

export class VotoService {
    getVotos(ruc) {
        return axios
            .get(url, { headers: authHeader() })
            .then((res) => {
                if (res.data.success) {
                    return res.data.result.filter((item) => item.procesoEleccion.institucion.ruc === ruc);
                }
            })
            .catch(function (error) {
                if (error.response) {
                    return error.response.status;
                }
            });
    }

    getVoto(cedula) {
        return axios
            .get(url + cedula)
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

    postVoto(data) {
        return axios.post(url, data).catch(function (error) {
            if (error.response) {
                return error.response.status;
            }
        });
    }

    postConteo(lista, proceso) {
        const conteo = {
            idProcesoEleccion: proceso,
            idLista: lista,
        };
        return axios
            .post(url + "conteo", conteo, { headers: authHeader() })
            .then((res) => {
                return res.data.result;
            })
            .catch(function (error) {
                if (error.response) {
                    return error.response.status;
                }
            });
    }

    postVerificarVoto(data) {
        return axios
            .post(url + "validar/", data)
            .then((res) => {
                return res.data;
            })
            .catch(function (error) {
                if (error.response) {
                    return error.response.status;
                }
            });
    }
}
