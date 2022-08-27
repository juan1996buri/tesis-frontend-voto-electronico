import axios from "axios";

const url = "http://localhost:9090/api/v1.0/tipoInstitucion/";

export class TipoInstitucionService {
    getTiposInstituciones = async (state) => {
        return await axios.get(url).then((res) => res.data.success && state(res.data.result));
    };
}
