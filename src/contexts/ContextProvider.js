import { AppService } from "../service/AppService";
import React, { createContext, useContext, useEffect, useState } from "react";

const StateContext = createContext();

export const ConextProvider = ({ children }) => {
    const [institucion, setInstitucion] = useState({});

    useEffect(() => {
        const object = new AppService();
        object.getUser(1, setInstitucion);
        window.institucion = institucion;
    }, []);

    return <StateContext.Provider value={{ institucion, setInstitucion }}>{children}</StateContext.Provider>;
};

export const useStateContext = () => useContext(StateContext);
