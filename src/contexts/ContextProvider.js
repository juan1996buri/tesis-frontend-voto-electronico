import React, { createContext, useContext, useEffect, useState } from "react";
import { InstitucionService } from "../service/InstitucionService";

const StateContext = createContext();

export const ConextProvider = ({ children }) => {
    const [institucion, setInstitucion] = useState({});

    useEffect(() => {
        const object = new InstitucionService();
        object.getInstitucion(1, setInstitucion);
        window.institucion = institucion;
    }, []);

    return <StateContext.Provider value={{ institucion, setInstitucion }}>{children}</StateContext.Provider>;
};

export const useStateContext = () => useContext(StateContext);
