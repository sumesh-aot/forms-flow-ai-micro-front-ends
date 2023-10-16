import React from "react";
import { Route, Switch, Redirect, useHistory, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { KeycloakService, StorageService } from "@formsflow/service";
import {
  KEYCLOAK_URL_AUTH,
  KEYCLOAK_URL_REALM,
  KEYCLOAK_CLIENT,
} from "./endpoints/config";
import { BASE_ROUTE, DESIGNER_ROLE, MULTITENANCY_ENABLED } from "./constants";
import Head from "./containers/head";
import i18n from "./resourceBundles/i18n";
import "./index.scss";
import Recipes from "./components/recipes";


const Integration = React.memo(({ props }: any) => {
  const { publish, subscribe } = props;
  const  {tenantId}  = useParams();
  const [instance, setInstance] = React.useState(props.getKcInstance());
  const [isAuth, setIsAuth] = React.useState(instance?.isAuthenticated());
  const [page, setPage] = React.useState("Integration");
  const [isDesigner, setIsDesigner] = React.useState(false);
  const history = useHistory();

  const baseUrl = MULTITENANCY_ENABLED ? `/tenant/${tenantId}/` : "/";
  
  React.useEffect(() => {
    publish("ES_ROUTE", { pathname: `${baseUrl}admin` });
    subscribe("ES_CHANGE_LANGUAGE", (msg, data) => {
      i18n.changeLanguage(data);
    })
  }, []);

  React.useEffect(()=>{
    StorageService.save("tenantKey", tenantId)
  },[tenantId])

  React.useEffect(() => {
    if (!isAuth) {
      let instance = KeycloakService.getInstance(
        KEYCLOAK_URL_AUTH,
        KEYCLOAK_URL_REALM,
        KEYCLOAK_CLIENT,
        tenantId
      );
      instance.initKeycloak(() => {
        setIsAuth(instance.isAuthenticated());
        publish("FF_AUTH", instance);
      });
    }
  }, []);

  React.useEffect(()=>{
    if(!isAuth) return
    const roles = JSON.parse(StorageService.get(StorageService.User.USER_ROLE));
    if(roles.includes(DESIGNER_ROLE)){
      setIsDesigner(true);
    }
    const locale = localStorage.getItem("i18nextLng")
    if(locale) i18n.changeLanguage(locale);
  },[isAuth])

  const headerList = () => {
    return [
      {
        name: "Recipes",
        onClick: () => history.push(`${baseUrl}integration/recipes`),
      },
    ];
  };

  return (
      <>
        {isDesigner && (
        <div className="admin-container" tabIndex={0}>
          <Head items={headerList()} page={page} />
          <ToastContainer theme="colored" />
          <Switch>
            <Route
              exact
              path={`${BASE_ROUTE}integration/recipes`}
              render={() => (
                <Recipes
                  {...props}
                  setTab={setPage}
                />
              )}
            />
            
          </Switch>
          </div> 
      )}
      </>
    );
  });
        

export default Integration;
