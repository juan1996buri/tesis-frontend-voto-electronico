import axios from "axios";

const url = "http://localhost:9090/api/v1.0/junta/";

export class JuntaService {
    getJuntas(ruc, state) {
        return axios.get(url).then((res) => res.data.success && state(res.data.result.filter((item) => item.recinto.institucion.ruc === ruc)));
    }
    postJunta(data) {
        return axios.post(url, data);
    }
    updateJunta(data) {
        return axios.put(url, data);
    }
    deleteJunta(id) {
        return axios
            .delete(url + id)
            .then((resp) => resp.data.success)
            .catch(function (error) {
                return error.response.data.status;
            });
    }
}
