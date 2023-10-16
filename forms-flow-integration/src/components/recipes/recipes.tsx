import React, { useState, useEffect } from 'react';

import "./recipes.scss";
import { Translation } from "react-i18next";
import { getEmbedToken, TokenResponse } from '../../services/workato';


const Recipes = React.memo(() => {

  const [iframeSource, setIframeSource] = useState<string>('');
  const [error, setError] = React.useState();

  useEffect(() => {
    getEmbedToken((data: TokenResponse)=>{
      let token = data.token;
      const workato_path = '%2Frecipes%3Ffid%3D14660409%23assets'; //TODO to be changed upon implementation
      const iframSrc = `https://app.workato.com/direct_link?workato_dl_path=${workato_path}&workato_dl_token=${data.token}`; //TODO to be changed upon implementation
      setIframeSource(iframSrc);
    }, setError);
  }, []);

   
  return (
    <div>
      <iframe id="workato-integration"
        title="Embedded Page"
        src={iframeSource}
        width="100%"
        height="800" //TODO
        allowFullScreen
      ></iframe>
    </div>
  );
});
export default Recipes;
