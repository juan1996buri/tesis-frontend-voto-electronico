import axios from "axios";
import authHeader from "./auth-header";

const url = "http://localhost:9090/api/v1.0/junta/";
//const config = authHeader();
//const institucion = JSON.parse(localStorage.getItem("institucion"));

export class JuntaService {
    getJuntas(ruc, state) {
        return axios
            .get(url, { headers: authHeader() })
            .then((res) => res.data.success && state(res.data.result.filter((item) => item.recinto.institucion.ruc === ruc)))
            .catch(function (error) {
                if (error.response) {
                    return error.response.status;
                }
            });
    }
    postJunta(data) {
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
    updateJunta(data) {
        return axios.put(url, data, { headers: authHeader() }).catch(function (error) {
            if (error.response) {
                return error.response.status;
            }
        });
    }
    deleteJunta(id) {
        return axios
            .delete(url + id, { headers: authHeader() })
            .then((resp) => resp.data.success)
            .catch(function (error) {
                return error.response.data.status;
            });
    }
}
