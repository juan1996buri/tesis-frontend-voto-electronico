import axios from "axios";
import authHeader from "./auth-header";

const url = "http://localhost:9090/api/v1.0/provincia/";

export class ProvinciaService {
    getProvincias = async (state) => {
        return await axios.get(url).then((resp) => {
            state(resp.data.result);
            return resp.data.result;
        });
    };

    postProvince = async (provincia) => {
        return axios.post(url, provincia, { headers: authHeader() });
    };

    updateProvincia = async (provincia) => {
        return axios.put(url, provincia, { headers: authHeader() });
    };

    deleteProvincia = async (id, setActive) => {
        return axios
            .delete(url + id, { headers: authHeader() })
            .then((resp) => resp.data.success && setActive(true))
            .catch(function (error) {
                if (error.response) {
                    return error.response.status;
                }
            });
    };
}
