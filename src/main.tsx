import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Amplify } from "aws-amplify";
import { type ResourcesConfig } from 'aws-amplify';

// Lokale Entwicklungskonfiguration für Amplify
const config: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'eu-central-1_XVdSpywob',
      userPoolClientId: '130v1odsaccg4t4uuusq35ekb8',
      identityPoolId: 'eu-central-1:7e53998b-6f8f-473b-b326-3cef0c8b5a86',
      signUpVerificationMethod: 'code',
    }
  },
  API: {
    GraphQL: {
      endpoint: 'https://orcjdmwv4ffjrareexugdoksae.appsync-api.eu-central-1.amazonaws.com/graphql',
      region: 'eu-central-1',
      defaultAuthMode: 'userPool'
    }
  }
};

// Im Development-Modus lokale Konfiguration verwenden
if (import.meta.env.DEV) {
  console.log('Entwicklungsmodus: Verwende lokale Amplify-Konfiguration');
  Amplify.configure(config);
} else {
  // In Produktion die generierte Konfiguration laden
  import('../amplify_outputs.json').then((outputs) => {
    console.log('Produktionsmodus: Verwende Amplify Outputs');
    Amplify.configure(outputs.default);
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
