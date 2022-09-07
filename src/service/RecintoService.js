import axios from "axios";
import authHeader from "./auth-header";

const url = "http://localhost:9090/api/v1.0/recinto/";

export class RecintoService {
    getRecintos(ruc, state) {
        return axios
            .get(url, { headers: authHeader() })
            .then((res) => res.data.success && state(res.data.result.filter((item) => item.institucion.ruc === ruc)))
            .catch(function (error) {
                if (error.response) {
                    return error.response.status;
                }
            });
    }
    postRecinto(data) {
        return axios.post(url, data, { headers: authHeader() }).catch(function (error) {
            if (error.response) {
                return error.response.status;
            }
        });
    }
    updateRecinto(data) {
        return axios.put(url, data, { headers: authHeader() }).catch(function (error) {
            if (error.response) {
                return error.response.status;
            }
        });
    }
    async deleteRecinto(id, setActive) {
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
