# SiS Dokument v2 - Med valbara komponenter

## Nytt i v2:
- ✅ Välj mellan 8 sidhuvud-komponenter
- ✅ Välj mellan 9 sidfot-komponenter
- ✅ Datum alltid med (i sidhuvud, höger sida)
- ✅ Mörkgrå färg på sidhuvud/sidfot
- ✅ Svart brödtext

## Användning

```bash
cd /home/administrator/vayron/sis-dokument
source venv/bin/activate
python3 generate_pdf_v2.py
```

## Workflow
1. Skriv titel
2. Skriv innehåll (Ctrl+D när klar)
3. Välj sidhuvud (1-8)
4. Välj sidfot (1-9)
5. Ange filnamn
6. Klart! Både DOCX och PDF skapas

## Sidhuvud-komponenter
1. Dagens datum (bara datum, ingen text)
2. Mattias Thyr
3. Mattias Thyr | Handskerydsvägen 7, 571 40 Nässjö
4. Dokument
5. Standarddokument
6. Konfident
7. Privat korrespondens
8. Anpassad text (du skriver själv)

## Sidfot-komponenter
1. Ingen (tom sidfot)
2. Handskerydsvägen 7, 571 40 Nässjö | 070 666 10 13 | m@thyr.se | www.thyr.se
3. 070 666 10 13 | m@thyr.se
4. 070 323 10 13 | mattiasthyr@gmail.com, mattias@konfident.se | www.konfident.se
5. 070 323 10 13 | mattias@konfident.se
6. m@thyr.se
7. mattias@konfident.se
8. Sida {page} (sidnummer)
9. Anpassad text (du skriver själv)

## Redigera komponenter

Redigera `components.json` för att lägga till/ändra komponenter.

## Gammal version

Den ursprungliga versionen finns kvar som `generate_pdf.py`.
