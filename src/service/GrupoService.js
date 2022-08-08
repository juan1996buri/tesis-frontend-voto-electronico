import axios from "axios";

const url = "http://localhost:9090/api/v1.0/grupo/";

export class GrupoService {
    getGrupos(id, state) {
        return axios.get(url).then((res) => state(res.data.result.filter((item) => item.junta.recinto.institucion.id === id)));
    }
    postGrupo(data) {
        return axios.post(url, data);
    }
    updateGrupo(data) {
        return axios.put(url, data);
    }
    deleteGrupo(id) {
        return axios.delete(url + id).then((res) => console.log(res));
    }
}
