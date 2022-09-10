import axios from "axios";
import authHeader from "./auth-header";

const url = "http://localhost:9090/api/v1.0/tipoCandidato/";

export class TipoCandidatoService {
    getTipoCandidatos(ruc, state) {
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
    postTipoCandidato(data) {
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
    updateTipoCandidato(data) {
        return axios.put(url, data, { headers: authHeader() }).catch(function (error) {
            if (error.response) {
                return error.response.status;
            }
        });
    }
    deleteTipoCandidato(id, setActive) {
        return axios
            .delete(url + id, { headers: authHeader() })
            .then((resp) => resp.data.success && setActive(true))
            .catch(function (error) {
                if (error.response) {
                    return error.response.status;
                }
            });
    }
}
