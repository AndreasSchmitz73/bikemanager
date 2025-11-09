import { Amplify } from "aws-amplify";
import { useState } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsConfig from "./aws-exports";

// keep Amplify configured so Authenticator works
Amplify.configure(awsConfig as unknown as Record<string, unknown>);


import BikesPage from './BikesPage';

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => {
        const [view, setView] = useState<'home' | 'bikes'>('home');

        if (view === 'bikes') {
          return (
            <BikesPage
              onBack={() => {
                setView('home');
              }}
            />
          );
        }

        return (
          <main style={{ padding: 24 }}>
            <h1>Hello {user?.username ?? 'Guest'}!</h1>
            <div style={{ marginTop: 12 }}>
              <button onClick={() => setView('bikes')} style={{ marginRight: 8 }}>
                View Bikes
              </button>
              <button onClick={signOut}>Logout</button>
            </div>
          </main>
        );
      }}</Authenticator>
  );
}

export default App;
