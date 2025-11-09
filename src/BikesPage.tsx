import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import type { Bike, BikeList } from "./types";
import { LoadingWrapper } from "./components/LoadingWrapper";

// Initialize the client once (not on every render)
const client = generateClient<Schema>() as any;

export default function BikesPage({ onBack }: { onBack: () => void }) {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const bikeModel = client?.models?.Bike;
    if (!bikeModel) {
      setError(
        'Bike model not available. Stelle sicher, dass Amplify Data Codegen ausgeführt wurde und `amplify_outputs.json` gültig ist.'
      );
      setLoading(false);
      return;
    }

    let cancelled = false;
    let retryTimeout: NodeJS.Timeout;

    async function load() {
      try {
        const res = await bikeModel.list() as BikeList;
        const items = Array.isArray(res) ? res : res?.items ?? [];
        if (!cancelled) setBikes(items);
        if (!cancelled) setError(null);
      } catch (e: any) {
        console.error('Error fetching bikes', e);
        if (!cancelled) {
          setError(String(e?.message ?? e));
          // Retry up to 3 times with increasing delay
          if (retryCount < 3) {
            retryTimeout = setTimeout(() => {
              if (!cancelled) {
                setRetryCount(c => c + 1);
                load();
              }
            }, Math.min(1000 * Math.pow(2, retryCount), 8000));
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [retryCount]); // Re-run when retryCount changes

  return (
    <section style={{ padding: 24 }}>
      <button onClick={onBack} style={{ marginBottom: 12 }}>
        ← Zurück
      </button>

      <h2>Ihre Bikes</h2>

      <LoadingWrapper isLoading={loading} loadingText="Lade Bikes...">
        <div>
          {error && (
            <div style={{ 
              padding: '12px',
              marginBottom: '12px',
              backgroundColor: '#fff5f5',
              border: '1px solid #feb2b2',
              borderRadius: '4px',
              color: '#c53030'
            }}>
              <strong>Fehler:</strong> {error}
              {retryCount > 0 && retryCount < 3 && (
                <div style={{ fontSize: '0.9em', marginTop: '8px' }}>
                  Wiederhole Laden... (Versuch {retryCount}/3)
                </div>
              )}
            </div>
          )}

          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0
          }}>
            {bikes.length === 0 && !loading && !error && (
              <li style={{
                padding: '12px',
                backgroundColor: '#f7fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '4px'
              }}>
                Noch keine Bikes vorhanden.
              </li>
            )}
            {bikes.map((bike) => (
              <li key={bike.id} style={{
                padding: '12px',
                marginBottom: '8px',
                backgroundColor: '#f7fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '4px'
              }}>
                <strong>{bike.name || 'Unbenannt'}</strong>
                {bike.brand ? ` — ${bike.brand}` : ''}
                {bike.mileage ? ` (${bike.mileage} km)` : ''}
                <div style={{ 
                  fontSize: '0.8em',
                  color: '#718096',
                  marginTop: '4px'
                }}>
                  Erstellt: {bike.createdAt ? new Date(bike.createdAt).toLocaleString('de-DE') : 'Unbekannt'}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </LoadingWrapper>
    </section>
  );
}
