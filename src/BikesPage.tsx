import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();

export default function BikesPage({ onBack }: { onBack: () => void }) {
  const [bikes, setBikes] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const bikeModel = (client as any)?.models?.Bike;
    if (!bikeModel) {
      setError(
        'Bike model not available. Stelle sicher, dass Amplify Data Codegen ausgeführt wurde und `amplify_outputs.json` gültig ist.'
      );
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        // list returns an object or an array depending on runtime; handle both
        const res = await bikeModel.list();
        const items = res?.items ?? res ?? [];
        if (!cancelled) setBikes(items);
      } catch (e: any) {
        console.error('Error fetching bikes', e);
        if (!cancelled) setError(String(e?.message ?? e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section style={{ padding: 24 }}>
      <button onClick={onBack} style={{ marginBottom: 12 }}>
        ← Back
      </button>

      <h2>Your Bikes</h2>

      {loading && <div>Loading...</div>}
      {error && (
        <div style={{ color: 'crimson' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {!loading && !error && (
        <ul>
          {bikes.length === 0 && <li>No bikes found.</li>}
          {bikes.map((b: any) => (
            <li key={b.id ?? JSON.stringify(b)}>
              <strong>{b.name ?? 'Unnamed'}</strong>
              {b.brand ? ` — ${b.brand}` : ''}
              {b.mileage ? ` (${b.mileage} km)` : ''}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
