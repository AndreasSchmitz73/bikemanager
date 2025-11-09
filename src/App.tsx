import { Amplify } from "aws-amplify";
import { useState } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsConfig from "./aws-exports";
import BikesPage from './BikesPage';
import { ErrorBoundary } from "./components/ErrorBoundary";

// Konfiguriere Amplify mit der korrekten Backend-Konfiguration
try {
  console.log('Konfiguriere Amplify mit:', awsConfig);
  Amplify.configure(awsConfig as any);
} catch (error) {
  console.error('Fehler bei der Amplify-Konfiguration:', error);
}

interface AuthenticatedContentProps {
  signOut?: (() => void) | undefined;
  user?: {
    username?: string;
    attributes?: Record<string, any>;
  };
}

// Separate the authenticated content into its own component to manage state properly
function AuthenticatedContent({ signOut, user }: AuthenticatedContentProps) {
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
      <h1>Hallo {user?.username ?? 'Gast'}!</h1>
      <div style={{ marginTop: 12 }}>
        <button onClick={() => setView('bikes')} style={{ marginRight: 8 }}>
          Bikes anzeigen
        </button>
        {signOut && (
          <button onClick={signOut}>
            Abmelden
          </button>
        )}
      </div>
    </main>
  );
}

function App() {
  return (
    <ErrorBoundary fallback={
      <div style={{ 
        padding: '20px',
        margin: '20px',
        border: '1px solid #ffb8b8',
        borderRadius: '4px',
        backgroundColor: '#fff5f5',
        maxWidth: '400px'
      }}>
        <h2>Entschuldigung, ein Fehler ist aufgetreten</h2>
        <p>Bitte laden Sie die Seite neu oder melden Sie sich erneut an.</p>
        <button onClick={() => window.location.reload()}>
          Seite neu laden
        </button>
      </div>
    }>
      <Authenticator>
        {(props) => <AuthenticatedContent {...props} />}
      </Authenticator>
    </ErrorBoundary>
  );
}

export default App;
