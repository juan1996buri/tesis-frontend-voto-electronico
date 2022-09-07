import axios from "axios";
import authHeader from "./auth-header";
import { UserService } from "./UserService";

const url = "http://localhost:9090/api/v1.0/institucion/";

export class InstitucionService {
    getInstitucion(ruc, state) {
        return axios
            .get(url + ruc, { headers: authHeader() })
            .then((res) => {
                state(res.data.result);
                const data = res.data.result;
                return data;
            })
            .catch(function (error) {
                if (error.response) {
                    return error.response.status;
                }
            });
    }

    getInstituciones(state) {
        return axios
            .get(url, { headers: authHeader() })
            .then((res) => {
                if (res.data.success) {
                    state(res.data.result);
                    return res.data.result;
                }
            })
            .catch(function (error) {
                if (error.response) {
                    return error.response.status;
                }
            });
    }

    updateInstitucion(data) {
        return axios.put(url, data, { headers: authHeader() }).catch(function (error) {
            if (error.response) {
                return error.response.status;
            }
        });
    }

    postInstitucion(data) {
        return axios.post(url, data, { headers: authHeader() }).catch(function (error) {
            if (error.response) {
                return error.response.status;
            }
        });
    }
}
