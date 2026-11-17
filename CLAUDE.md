# PU-Website «Wie ein LLM funktioniert»

Interaktive Lernseite für das PU-Projekt (Projektunterricht) an der Neuen Kantonsschule Aarau (NKSA).
Das Produkt ist diese Webseite. Zielpublikum: Mitschülerinnen und Mitschüler **ohne Vorwissen**.
Bewertet wird vor allem, wie verständlich erklärt wird — nicht, wie viel Technik drinsteckt.

> Vorgeschichte, Projektfakten, alter Code (Supabase, Rangliste) und offene Punkte: siehe `HANDOVER.md`.

## Inhaltliche Vorgaben

- Die Kapitel folgen dem Weg eines Textes durch ein Sprachmodell (01–03 Vorgeschichte,
  04–09 das Modell, 10–12 drumherum, 13 Schluss).
- **Jede Jahreszahl, jeder Name und jede Kennzahl braucht eine Quelle** im Abschnitt «Quellen»
  am Ende von Kapitel 13 (nach Kapitelnummer geordnet, möglichst Originalarbeit mit DOI- oder
  arXiv-Link). Neue Links vor dem Eintragen aufrufen und prüfen, ob sie zum richtigen Werk führen.
- Nichts auf der Seite übernehmen, was sich nicht belegen lässt. Beispiel: Dass Shannons Frau
  Betty die Versuchsperson war, liess sich nicht belegen (das Paper von 1951 nennt niemanden) und
  ist deshalb nicht mehr auf der Seite. Zitate nur wörtlich und in der Originalsprache.
- Ein YouTube-Video (CJ/Syntax) war früher Hauptquelle und wurde am 17.11.2026 auf Wunsch
  entfernt. Nicht wieder einbauen oder erwähnen.
- **Zwei Ebenen:**
  1. Haupttext: einfach, keine Formeln, kein Vorwissen nötig.
  2. Vertiefung: ausklappbare `<details class="tief">`-Kästen am Kapitelende, mit Mathematik
     und genauen Verfahren. Vorausgesetzt wird höchstens Gymnasialmathematik.
- Sprache Deutsch, **Schweizer Rechtschreibung**: `ss` statt `ß`, Anführungszeichen «so».
- Wo eine Quelle und unsere Rechnung nicht übereinstimmen, wird das offen hingeschrieben,
  nicht passend gemacht.

## Dateien

| Datei | Zweck |
|---|---|
| `index.html` | Die ganze Seite in einer Datei: CSS, HTML, JS. Kein Build, keine Abhängigkeiten. |
| `CLAUDE.md` | Diese Datei: Arbeitsregeln für den Code. |
| `HANDOVER.md` | Übergabe: Vorgeschichte, Gedächtnis, wichtiger Code, offene Punkte. |

`index.html` beginnt bewusst mit `<title>` und `<style>`, ohne `<!doctype>`, `<html>`, `<head>`, `<body>`:
Die Seite wird als claude.ai-Artifact veröffentlicht, und der Publisher setzt dieses Gerüst selbst
darum. **Nicht hinzufügen.** Lokal lässt sich die Datei trotzdem direkt im Browser öffnen.

## Aufbau von index.html

1. **`<style>`** — Design-Tokens auf `:root` als HSL-Tripel (z. B. `--signal:5 76% 46%`),
   verwendet als `hsl(var(--signal))`. Drei Modi:
   - Dunkel: `@media (prefers-color-scheme:dark)`, `:root[data-theme="dark"]` und `:root.m-dunkel`
     (alle drei Blöcke mit denselben Werten pflegen)
   - Schwarz-Weiss: `:root.m-mono`
   - Stil: Swiss International — keine Radien, keine Schatten, Haarlinien, Mono-Schrift für Labels,
     Rot (`--signal`) als einzige Akzentfarbe, Blau (`--azur`) nur für die Vertiefungen.
2. **Kopfzeile** mit zwei Schaltergruppen: `Einfach / Mit Details` und `System / Hell / Dunkel / S/W`.
3. **14 Kapitel** als `<section class="kap" id="start">`, `id="kap01"` … `id="kap13"`.
   Immer nur eines ist sichtbar (`hidden`-Attribut).
4. **Ein `<script>`** mit nummerierten Blöcken (`/* ===== 4 · Versuch 01 · Shannon ===== */` usw.),
   jeder Block eine eigene IIFE. Gemeinsame Helfer stehen in Block 0: `softmax`, `kosinus`,
   `balken`, `hsl`, `sichern`/`holen` (localStorage in try/catch).

### Die neun Versuche

| Kapitel | Versuch | Was wirklich gerechnet wird |
|---|---|---|
| 01 | Buchstaben raten | Trefferquote gegen 1/27 Zufall |
| 02 | Mini-ELIZA | 12 Regex-Regeln mit Pronomen-Tausch |
| 04 | XOR | echtes Training, 1 vs. 2 Schichten, 5000 Epochen, Backprop |
| 05 | BPE | echter Byte-Pair-Encoding-Algorithmus |
| 06 | Embeddings | Vektorrechnung + Kosinus, 10 handbenannte Dimensionen |
| 07 | Attention | ein Kopf, Q·K/√d, Softmax, gemischter Vektor |
| 08 | Softmax | Temperature + Top-p live |
| 09 | Generierung | Trigramm-Modell auf 30 Kindergeschichten |
| 10 / 12 | Request, Werkzeuge | Ablauf-Darstellung, keine echten API-Aufrufe |

## Regeln für Änderungen

- **Navigation:** Kapitelwechsel laufen über den Klick-Handler in Block 3, nicht über
  `#`-Links allein. Im Artifact-Viewer werden `#`-Navigationen abgefangen. Neue interne Links
  einfach als `<a href="#kapNN">` schreiben, der Handler fängt sie ab.
- **Neues Kapitel:** `<section>` anlegen, Eintrag in `#tocliste`, Eintrag in `.pipe` auf der
  Startseite, Fussnavigation beider Nachbarn anpassen, Kapitelzahl im Footer und auf der Startseite.
- **Neue Vertiefung:**
  ```html
  <details class="tief">
    <summary>Titel der Vertiefung</summary>
    <div class="tiefinhalt">
      <p>…</p>
      <div class="formel">p = exp(z / T) / Σ exp(z / T)<span class="wo">Was jedes Zeichen bedeutet.</span></div>
    </div>
  </details>
  ```
  Formeln **einzeilig** schreiben. Mehrzeilige Brüche aus Klammerzeichen verrutschen,
  sobald `<sub>` darin vorkommt.
- **Farben** nur über Tokens, nie als Literalwerte in Komponenten (sonst bricht ein Modus).
  Ausnahme: das Favicon (`<link rel="icon">`, Zeile 3) ist ein Daten-URI ohne Zugriff auf Tokens;
  bewusst schwarz-weiss (`#000` / `#fff`), unabhängig vom Modus.
- **Externe Ressourcen:** Im Artifact sind nur Skripte von cdnjs/jsDelivr/unpkg und Schriften von
  Google Fonts erlaubt. `fetch` zu anderen Servern (z. B. Supabase) ist dort blockiert.
- Zufall und Rechnungen der Versuche sollen echt bleiben. Wenn etwas vereinfacht ist,
  steht das im Hinweistext unter dem Versuch.

## Nach jeder Änderung prüfen

1. JS-Syntax: Inhalt zwischen `<script>` und `</script>` in eine Datei ziehen und `node --check` darauf.
2. Im Browser: alle 14 Kapitel über die Seitenleiste anklicken, beide Schaltergruppen,
   jeden Versuch einmal bedienen.
3. Schmale Breite (≈ 390 px): kein horizontales Scrollen.

## Zahlen, die an mehreren Stellen vorkommen (zusammen ändern)

- **Mini-Transformer (Kap. 07):** 6 Schichten, d = 32, d_ff = 128, Kontext 32 → 73 728 Parameter in
  den Blöcken, im Text «rund 74 000». Steht im Merkkasten und in der Vertiefung von Kap. 07, in
  Kap. 04 (Grössenordnung) und in Kap. 10 (Kontextfenster). Eigenes Rechenbeispiel, kein echtes Modell.
- **GPT-OSS-120B:** 116,8 Milliarden Parameter laut Model Card, im Text «rund 117 Milliarden»
  (Kap. 04 und 07).
- **Kapitel 05:** Unser BPE ergibt für «the cat sat on the mat» 7 Token (`the c at s o n m`);
  andere Umsetzungen kommen je nach Wortgrenzen auf andere Zahlen. Steht so im Text.

## Veröffentlichung und Kopien

- Veröffentlicht als claude.ai-Artifact: https://claude.ai/artifact/NFRcFawaeAH2VvtHdP7mAa
  (privat; teilen über das Share-Menü der Seite). **Aktualisiert sich nicht automatisch**, wenn
  diese Datei geändert wird — neu veröffentlichen geht aus einer Claude-Session mit Artifact-Werkzeug.
- Eine Kopie liegt im claude.ai-Projekt «PU» als `claude/pu-llm-website.html`.
- **Dieser Ordner ist ab jetzt die Arbeitskopie.**
- **Eigenes Hosting:** https://wie-ki-funktioniert.vercel.app — GitHub-Repo `SeraphinHaeuptli/Pur_website` (öffentlich), mit Vercel verbunden.
  Das Vercel-Projekt ist für den Vercel-Connector nicht sichtbar; live prüfen mit `curl`.
  Push auf `main` = live. Vercel führt `node build.mjs` aus (siehe `vercel.json`) und liefert nur `dist/` aus.
  - Nur `index.html` bearbeiten. `dist/index.html` wird erzeugt (doctype/head/body drumherum) und ist nicht in Git.
  - Lokal ansehen: `node build.mjs`, dann `python -m http.server 8080 -d dist` → http://127.0.0.1:8080/
  - `HANDOVER.md` steht in `.gitignore` (Personennamen, lokale Pfade), weil das Repo öffentlich ist.

## Offene Punkte

- **Quiz und Rangliste:** Gab es in der früheren Version der Seite, mit Supabase-Tabelle
  `pu_leaderboard` (Projekt `decwclodnnllbfbgzzgn`). Noch nicht in diese Version übernommen.
  Funktioniert nur bei eigenem Hosting (Netlify, Vercel, GitHub Pages), weil das Artifact
  Aufrufe zu Supabase blockiert.
- **Prompt Rater** (`C:\Users\serap\Dev\prompt-rater`, siehe dessen `HANDOVER.md`) soll später
  eingebettet werden; braucht ebenfalls eigenes Hosting.
- Für Mitschüler ohne claude.ai-Konto wäre eigenes Hosting ohnehin nötig.
