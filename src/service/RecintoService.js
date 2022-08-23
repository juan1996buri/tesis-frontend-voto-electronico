import axios from "axios";

const url = "http://localhost:9090/api/v1.0/recinto/";

export class RecintoService {
    getRecintos(correo, state) {
        return axios.get(url).then((res) => res.data.success && state(res.data.result.filter((item) => item.institucion.correo === correo)));
    }
    postRecinto(data) {
        return axios.post(url, data);
    }
    updateRecinto(data) {
        return axios.put(url, data);
    }
    async deleteRecinto(id, setActive) {
        return axios
            .delete(url + id)
            .then((resp) => resp.data.success && setActive(true))
            .catch(function (error) {
                if (error.response) {
                    return error.response.status;
                }
            });
    }
}
