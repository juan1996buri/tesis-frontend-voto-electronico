import axios from "axios";

const url = "http://localhost:9090/api/v1.0/grupo/";

export class GrupoService {
    getGrupos(correo, state) {
        return axios.get(url).then((res) => state(res.data.result.filter((item) => item.junta.recinto.institucion.correo === correo)));
    }
    postGrupo(data) {
        return axios.post(url, data);
    }
    updateGrupo(data) {
        return axios.put(url, data);
    }
    async deleteGrupo(id, setActive) {
        return axios
            .delete(url + id)
            .then((res) => res.data.success && setActive(true))
            .catch(function (error) {
                if (error.response) {
                    return error.response.status;
                }
            });
    }
}
