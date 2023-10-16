import React, { useState, useEffect } from 'react';
import { WEB_BASE_URL } from './endpoints/config';
import { StorageService } from '@formsflow/service';

// Define a type for the data received from the API
interface ApiResponse {
  token: string;
}

function Integration() {
  const [iframeSource, setIframeSource] = useState<string>('');

  useEffect(() => {
    async function fetchIframeSource() {
      try {
        const response = await fetch(`${WEB_BASE_URL}/workato/embed/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${StorageService.get(StorageService.User.AUTH_TOKEN)}`,
          },
          body: JSON.stringify({}),
        });

        if (response.ok) {
          const data: ApiResponse = await response.json();
          const workato_path = '%2Frecipes%3Ffid%3D14660409%23assets'; //TODO to be changed upon implementation
          const iframSrc = `https://app.workato.com/direct_link?workato_dl_path=${workato_path}&workato_dl_token=${data.token}`; //TODO to be changed upon implementation
          setIframeSource(iframSrc);
        } else {
          console.error('Failed to fetch iframe source');
        }
      } catch (error) {
        console.error('Error while fetching iframe source:', error);
      }
    }

    fetchIframeSource();
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
}

export default Integration;
