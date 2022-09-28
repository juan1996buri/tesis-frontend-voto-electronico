import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import LayoutAdministrador from "./pages/layout/LayoutAdministrador";
import LayoutInstituto from "./pages/layout/LayoutInstituto";
import LoginInstitucion from "./pages/LoginInstitucion";
import RegistrarInstitucion from "./pages/RegistrarInstitucion";

import OpcionesInicioSesion from "./pages/OpcionesInicioSesion";
import LoginVotante from "./pages/LoginVotante";
import NotFound from "./pages/NotFound";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import LayoutVotante from "./pages/layout/LayoutVotante";

// <Route component={NotFound} />

const App = () => {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div>
                <Switch>
                    <Route
                        path="/"
                        exact
                        render={() => {
                            const data = JSON.parse(window.localStorage.getItem("institucion"));
                            if (data) {
                                if (data.rol === "ROLE_INSTITUTE" && data.token) {
                                    return <Redirect to={"/institucion"} />;
                                } else if (data.rol === "ROLE_ADMIN" && data.token) {
                                    return <Redirect to={"/administrador"} />;
                                } else if (data.cedula) {
                                    return <Redirect to={"/votante"} />;
                                }
                            } else {
                                return <OpcionesInicioSesion />;
                            }
                        }}
                    />
                    <Route path="/login-institucion" exact component={LoginInstitucion} />
                    <Route path="/registrar" exact component={RegistrarInstitucion} />
                    <Route path="/institucion" component={LayoutInstituto} />
                    <Route path="/login-votante" exact component={LoginVotante} />
                    <Route path="/administrador" component={LayoutAdministrador} />
                    <Route path="/votante" component={LayoutVotante} />
                    <Route path="/" exact component={OpcionesInicioSesion} />
                </Switch>
            </div>
        </LocalizationProvider>
    );
};

export default App;
