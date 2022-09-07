import axios from "axios";
import authHeader from "./auth-header";

const url = "http://localhost:9090/api/v1.0/tipoInstitucion/";

export class TipoInstitucionService {
    getTiposInstituciones = async (state) => {
        return await axios.get(url).then((res) => {
            if (res.data.success) {
                state(res.data.result);
                return res.data.result;
            }
        });
    };
    postTipoInstitucion(data) {
        return axios.post(url, data, { headers: authHeader() }).catch(function (error) {
            if (error.response) {
                return error.response.status;
            }
        });
    }
    updateTipoInstitucion(data) {
        return axios.put(url, data, { headers: authHeader() }).catch(function (error) {
            if (error.response) {
                return error.response.status;
            }
        });
    }
    deleteTipoInstitucion(id) {
        return axios
            .delete(url + id, { headers: authHeader() })
            .then((resp) => resp.data.success)
            .catch(function (error) {
                return error.response.data.status;
            });
    }
}
