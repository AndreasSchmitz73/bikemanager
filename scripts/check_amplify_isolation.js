#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const repoRoot = path.resolve(process.cwd());
const localPath = path.join(repoRoot, 'amplify_outputs.json');
const otherPath = path.join(repoRoot, 'amplify_outputs Kopie.json');

function readJson(p) {
  try {
    const raw = fs.readFileSync(p, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Fehler beim Lesen oder Parsen von ${p}:`, e.message);
    process.exitCode = 2;
    return null;
  }
}

const local = readJson(localPath);
const other = readJson(otherPath);
if (!local || !other) process.exit(2);

const conflicts = [];

function check(pathParts, getter) {
  const a = getter(local);
  const b = getter(other);
  if (!a || !b) return;
  if (a === b) conflicts.push({key: pathParts.join('.'), value: a});
}

// Prüfe typische Identifikatoren
check(['auth','user_pool_id'], o => o.auth && o.auth.user_pool_id);
check(['auth','identity_pool_id'], o => o.auth && o.auth.identity_pool_id);
check(['auth','user_pool_client_id'], o => o.auth && o.auth.user_pool_client_id);
check(['data','url'], o => o.data && o.data.url);
check(['data','api_key'], o => o.data && o.data.api_key);

if (conflicts.length === 0) {
  console.log('OK — keine offensichtlichen Überschneidungen zwischen lokalen Amplify-Ausgaben und der Referenzdatei.');
  process.exit(0);
}

console.error('Konflikte gefunden — folgende Felder stimmen überein und könnten auf Überschneidungen hindeuten:');
for (const c of conflicts) {
  console.error(` - ${c.key}: ${c.value}`);
}

console.error('\nEmpfehlungen:');
console.error(' - Verwende unterschiedliche Amplify-Umgebungs-Namen oder Accounts für verschiedene Apps.');
console.error(" - Falls diese Werte identisch sein sollten, überprüfe die AWS-Konten/Regions/Amplify App IDs und ggf. passe die Backend-Konfiguration an.");
console.error(' - Führe `npm run check:amplify:isolation` lokal aus, bevor du größere Copilot-Änderungen an Auth/Data vornimmst.');
process.exit(1);
