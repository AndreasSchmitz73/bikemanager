import { useState } from 'react';

const STRAVA_CLIENT_ID = import.meta.env.VITE_STRAVA_CLIENT_ID || '84003';
const STRAVA_CLIENT_SECRET = import.meta.env.VITE_STRAVA_CLIENT_SECRET;
const STRAVA_REDIRECT_URI = `${window.location.origin}/`;

interface StravaTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  athlete: any;
}

interface StravaBike {
  id: string;
  name: string;
  distance: number;
  primary: boolean;
  nickname?: string;
  retired: boolean;
}

export function StravaConnect() {
  const [stravaTokens, setStravaTokens] = useState<StravaTokenResponse | null>(null);
  const [bikes, setBikes] = useState<StravaBike[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Prüfe ob wir einen OAuth Code in der URL haben
  useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      exchangeToken(code);
    }
  });

  // Token Exchange nach OAuth Redirect
  async function exchangeToken(code: string) {
    try {
      const response = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: STRAVA_CLIENT_ID,
          client_secret: STRAVA_CLIENT_SECRET || 'b3d558c1aa065cc365fe4663d2d608ed3837a16b', // Fallback für Entwicklung
          code,
          grant_type: 'authorization_code'
        })
      });

      if (!response.ok) {
        throw new Error('Token exchange failed');
      }

      const data = await response.json();
      setStravaTokens(data);
      
      // Hole Bikes wenn wir Tokens haben
      if (data.access_token) {
        await fetchStravaBikes(data.access_token);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to exchange token');
    }
  }

  // Hole Bikes von Strava
  async function fetchStravaBikes(accessToken: string) {
    try {
      const response = await fetch('https://www.strava.com/api/v3/athlete', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bikes');
      }

      const athleteData = await response.json();
      const bikes = athleteData.bikes || [];
      console.log('Gefundene Strava Bikes:', bikes);
      setBikes(bikes);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch bikes');
    }
  }

  // Starte OAuth Flow
  function connectStrava() {
    const scope = 'read,profile:read_all';
    const authUrl = `https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${STRAVA_REDIRECT_URI}&scope=${scope}&approval_prompt=force`;
    window.location.href = authUrl;
  }

  return (
    <div>
      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          Error: {error}
        </div>
      )}

      {!stravaTokens && (
        <button 
          onClick={connectStrava}
          style={{
            backgroundColor: '#FC4C02',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Strava_Logo.svg/64px-Strava_Logo.svg.png" 
            alt="Strava"
            style={{ height: '24px', width: '24px' }}
          />
          Mit Strava verbinden
        </button>
      )}

      {bikes.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Ihre Strava Bikes:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {bikes.map((bike) => (
              <li 
                key={bike.id}
                style={{
                  padding: '12px',
                  marginBottom: '8px',
                  backgroundColor: '#f7fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '4px'
                }}
              >
                <strong>{bike.name}</strong>
                {bike.nickname && ` (${bike.nickname})`}
                <div style={{ fontSize: '0.9em', color: '#666' }}>
                  Gesamtdistanz: {(bike.distance / 1000).toFixed(0)} km
                  {bike.primary && ' • Primäres Bike'}
                  {bike.retired && ' • Zurückgezogen'}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}