import axios from "axios";
import authHeader from "./auth-header";

const url = "http://localhost:9090/api/v1.0/voto/";
//const config = authHeader();
//const institucion = JSON.parse(localStorage.getItem("institucion"));

export class VotoService {
    getVotos(ruc, state) {
        return axios
            .get(url, { headers: authHeader() })
            .then((res) => {
                if (res.data.success) {
                    state(res.data.result.filter((item) => item.institucion.ruc === ruc));
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
