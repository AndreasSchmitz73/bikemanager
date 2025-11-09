# GitHub Copilot — Hinweise und Best Practices

Dieses Dokument fasst kurze, praktische Hinweise zusammen, wie du GitHub Copilot effizient im `bikemanager`-Repository nutzen solltest.

## Zweck
- Klarstellen, wie Copilot-Vorschläge verwendet werden dürfen.
- Tipps für effektive Prompts und Sicherheitshinweise.

## Kurzanleitung
- Schreibe präzise, kontextreiche Prompts im Code oder in Commit-Nachrichten.
- Wenn Copilot Vorschläge macht, prüfe immer:
  - Korrektheit (Tests, Laufzeitverhalten)
  - Lizenz- und Sicherheitsaspekte
  - Projekt‑Konventionen (TypeScript-Optionen, Linting, Formatierung)

## Beispiele für gute Prompts
- "Erzeuge eine TypeScript-Funktion in `src/` die ..." (konkrete Dateipfade helfen)
- "Schreibe einen Unit-Test mit Vitest für Funktion X, die Y machen soll." 
- "Optimiere diese React-Komponente für Performance und Accessibility." (füge Codeblock hinzu)

## Workflow-Empfehlungen
- Akzeptiere Vorschläge nur, wenn du sie verstanden und lokal getestet hast.
- Verwende kleine, iterative Änderungen (kleine PRs) statt große automatische Änderungen.
- Prüfe automatisch erzeugten Code mit bestehenden Tests oder schreibe kurz neue Tests.

## Sicherheit & Lizenz
- Copilot kann Vorschläge liefern, die von öffentlichen Repositories inspiriert sind. Verifiziere:
  - Keine vertraulichen Informationen (API-Keys, Passwörter) werden eingefügt.
  - Lizenzkompatibilität prüfen; bei Unsicherheit bevorzugt eigene Implementierung oder Review durch Maintainer.

## Repo-spezifische Hinweise
- Sprache: TypeScript (siehe `tsconfig.json`). Achte auf die hier gesetzten Compiler-Optionen.
- Styling: Halte dich an bestehende Formatierung (Prettier/ESLint falls vorhanden).
- Tests: Nutze vorhandene Test-Infrastruktur (soweit vorhanden) — neue Copilot‑Codevorschläge sollten mit Tests kommen.

## Amplify Gen 2 Kompatibilität
Da dieses Projekt Amplify (Gen 2) nutzt, müssen alle neuen oder von Copilot generierten Änderungen mit Amplify Gen 2 kompatibel sein. Kurz gesagt: Copilot‑Code darf nicht die Amplify‑Generierung brechen oder generierte Artefakte direkt überschreiben.

- Verwende die vorhandene `amplify/`-Struktur und die vorhandenen Infrastruktur‑Dateien (z. B. `amplify/backend.ts`) als Quelle der Wahrheit. Verändere generierte Dateien nicht manuell—ändere stattdessen die Quell‑/Backend‑Konfiguration und lasse Amplify die Artefakte neu erzeugen.
- Nutze die Amplify‑TypeScript‑Typen und Client‑Hilfsfunktionen (Codegen) statt eigene handgefertigte Typen zu duplizieren. Wenn Copilot Vorschläge Typen erzeugen, vergleiche mit den von Amplify generierten Typen und harmonisiere sie.
- Vermeide harte Kodierung von Ressourcen‑Namen, ARNs oder anderen generierten Identifikatoren; verwende die von Amplify bereitgestellten Referenzen/Variablen.
- Bei Änderungen an Infrastruktur/Backend: dokumentiere die Änderung und weise darauf hin, dass `amplify push` / das entsprechende Gen‑2‑Deployment ausgeführt werden muss, damit die Änderungen wirksam werden.
- Teste lokale Änderungen zusammen mit den Amplify‑Tools (z. B. Codegen, ggf. Mock/Local‑Emulatoren), damit Generierung und Laufzeit zusammenpassen.

Kurze Amplify‑Checkliste für Copilot‑PRs:

- [ ] Keine direkten Änderungen an generierten Dateien in `amplify/` — stattdessen Änderung an Source/Backend‑Konfiguration
- [ ] Verwendete Typen stimmen mit Amplify‑Codegen‑Typen überein
- [ ] Keine hartkodierten Ressourcen‑IDs oder -Strings
- [ ] README/PR erwähnt nötige Amplify‑Schritte (z. B. Codegen, `amplify push`)
- [ ] Lokale Validierung mit Amplify Tools durchgeführt (Codegen/Build)

### Isolation und Prüfung gegen andere Amplify-Umgebungen
Dieses Repository sollte eine vollständig eigenständige Amplify-Umgebung haben. Um versehentliche Überschneidungen (z. B. identische Cognito User Pools oder AppSync-Endpunkte) mit anderen Projekten zu verhindern, nutze das bereitgestellte Prüf-Skript und die folgenden Regeln:

- Verwende unterschiedliche Amplify‑App‑IDs und Environment‑Namen pro Projekt (z. B. `bikemanager-dev`, `bikemanager-prod`).
- Prüfe vor Änderungen, ob IDs/URLs überschneiden: `npm run check:amplify:isolation` (prüft `amplify_outputs.json` gegen `amplify_outputs Kopie.json` und meldet Konflikte).
- Wenn das Skript Konflikte meldet, ändere die Amplify-Umgebung (anderer Amplify App oder anderes AWS Konto) oder passe die Backend-Konfiguration so an, dass Ressourcen getrennt sind.
- Dokumentiere in PRs stets die Amplify-Schritte (Codegen, push) und bestätige, dass `npm run check:amplify:isolation` sauber durchläuft.

Hinweis: Das Prüf-Skript vergleicht nur die typischen Identifikatoren (Cognito User Pool, Identity Pool, AppSync URL, API Key). Es ist kein vollständiger Beweis für Isolation — bei Unsicherheit nutze getrennte AWS-Konten oder Amplify-Apps.

## Review-Checklist für Copilot-PRs
- [ ] Läuft `npm run build` / `tsc` lokal fehlerfrei?
- [ ] Bestehende Tests bestehen, neue Tests vorhanden falls nötig
- [ ] Keine sensiblen Informationen eingefügt
- [ ] Code entspricht Projekt-Konventionen (Naming, Struktur)
- [ ] Kurze PR-Beschreibung warum Änderung nötig ist

## Nützliche Tipps
- Nutze Inline-Kommentare um Copilot klarere Anweisungen zu geben.
- Wenn Vorschläge inkorrekt sind, ergänze Gegenbeispiele im Prompt.
- Verwende `// TODO:` oder `// FIXME:` im Code, um automatische Vorschläge in Review‑Kontext zu behalten.

---
Dieses Dokument ist bewusst kurz gehalten. Änderungen oder Ergänzungen bitte per PR in dieses Repository einreichen.
