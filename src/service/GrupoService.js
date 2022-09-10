import axios from "axios";
import authHeader from "./auth-header";

const url = "http://localhost:9090/api/v1.0/grupo/";

export class GrupoService {
    getGrupos(ruc, state) {
        return axios
            .get(url, { headers: authHeader() })
            .then((res) => state(res.data.result.filter((item) => item.junta.recinto.institucion.ruc === ruc)))
            .catch(function (error) {
                if (error.response) {
                    return error.response.status;
                }
            });
    }
    postGrupo(data) {
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
    updateGrupo(data) {
        return axios.put(url, data, { headers: authHeader() }).catch(function (error) {
            if (error.response) {
                return error.response.status;
            }
        });
    }

    deleteGrupo(id, setActive) {
        return axios
            .delete(url + id, { headers: authHeader() })
            .then((res) => res.data.success && setActive(true))
            .catch(function (error) {
                if (error.response) {
                    return error.response.status;
                }
            });
    }
}
