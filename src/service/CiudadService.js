import axios from "axios";
import authHeader from "./auth-header";

const url = "http://localhost:9090/api/v1.0/ciudad/";

export class CiudadService {
    getCiudades = async (state) => {
        return axios
            .get(url)
            .then((resp) => {
                state(resp.data.result);
                return resp.data.result;
            })
            .catch(function (error) {
                if (error.response) {
                    return error.response.status;
                }
            });
    };

    postCiudad = async (provincia) => {
        return await axios
            .post(url, provincia, { headers: authHeader() })
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
    };

    updateCiudad = async (provincia) => {
        return axios.put(url, provincia, { headers: authHeader() }).catch(function (error) {
            if (error.response) {
                return error.response.status;
            }
        });
    };

    deleteCiudad = async (id) => {
        return axios.delete(url + id, { headers: authHeader() }).catch(function (error) {
            if (error.response) {
                return error.response.status;
            }
        });
    };
}
