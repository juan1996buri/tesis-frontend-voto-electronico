import axios from "axios";

const url = "http://localhost:9090/api/v1.0/institucion/";

export class InstitucionService {
    getInstitucion(ruc, state) {
        return axios.get(url + ruc).then((res) => state(res.data.result));
    }
    updateInstitucion(data) {
        return axios.put(url, data);
    }
}
