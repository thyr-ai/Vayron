# SiS Dokument - Standarddokument Generator

Snabb och enkel dokumentgenerator baserad på svensk standard (SiS-mall).

## Snabbstart

```bash
cd /home/administrator/vayron/sis-dokument
source venv/bin/activate
python3 generate_pdf.py -i
```

## Användning

### Interaktivt läge (rekommenderas)
```bash
python3 generate_pdf.py -i
```
Fyller i titel, innehåll och filnamn steg-för-steg.

### Kommandoradsläge
```bash
python3 generate_pdf.py 'Dokumenttitel' 'Innehåll här...' filnamn
```

**Exempel:**
```bash
python3 generate_pdf.py 'Projektrapport Q1' 'Detta är rapporten för Q1 2026.' rapport_q1
```

**Med flera stycken:**
```bash
python3 generate_pdf.py 'Rapport' 'Stycke 1

Stycke 2

Stycke 3' min_rapport
```

## Vad gör den?

1. ✅ Använder Standarddokument.docx som mall
2. ✅ Behåller sidhuvud och sidfot
3. ✅ Uppdaterar datum automatiskt till dagens datum
4. ✅ Ersätter exempelinnehåll med din text
5. ✅ Genererar både DOCX och PDF

## Output

Filer sparas i aktuell mapp:
- `filnamn.docx` - Redigerbart Word-dokument
- `filnamn.pdf` - Färdig PDF

## Webgränssnitt (framtida feature)

Om du vill ha ett enkelt webbgränssnitt istället för kommandoraden, säg till!
Kan enkelt lägga till en Flask-app på samma sätt som Mission Control.

## Tekniska detaljer

- **Python:** 3.12
- **Libraries:** python-docx
- **PDF-konvertering:** LibreOffice headless
- **Mall:** /home/administrator/vayron/documents/Standarddokument.docx
- **Standard:** SiS (Svenska Institutet för Standarder)
