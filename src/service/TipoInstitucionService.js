import axios from "axios";

const url = "http://localhost:9090/api/v1.0/tipoInstitucion/";

export class TipoInstitucionService {
    getTiposInstituciones(state) {
        // return axios.get(url).then((res) => res.data.success && state(res.data.result.filter((item) => item.institucion.correo === correo)));
        return axios.get(url).then((res) => res.data.success && state(res.data.result));
    }
}
