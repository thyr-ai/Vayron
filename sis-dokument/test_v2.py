#!/usr/bin/env python3
"""Test av generate_pdf_v2 utan interaktiv input"""

import sys
sys.path.insert(0, '/home/administrator/vayron/sis-dokument')

from generate_pdf_v2 import PDFGeneratorV2

# Skapa generator
gen = PDFGeneratorV2()

# Test 1: Mattias Thyr sidhuvud + kort privat sidfot
print("=== Test 1: Mattias Thyr + kort privat kontakt ===")
gen.create_document(
    title="Testdokument v2",
    content="Detta är ett test av den nya versionen.\n\nVi testar nu sidhuvud och sidfot med komponenter.",
    header_choice="2",  # Mattias Thyr
    footer_choice="3",  # 070 666 10 13 | m@thyr.se
    output_name="test_v2_privat"
)

print("\n" + "="*60 + "\n")

# Test 2: Privat korrespondens + full privat sidfot
print("=== Test 2: Privat korrespondens + full kontakt ===")
gen.create_document(
    title="Privatbrev",
    content="Hej!\n\nDetta är ett privatbrev med full kontaktinformation i sidfoten.",
    header_choice="7",  # Privat korrespondens
    footer_choice="2",  # Full privat adress
    output_name="test_v2_brev"
)

print("\n" + "="*60 + "\n")

# Test 3: Konfident + semi sidfot
print("=== Test 3: Konfident + semi kontakt ===")
gen.create_document(
    title="Konfident-dokument",
    content="Detta är ett dokument för Konfident.\n\nSemi-professionell kontaktinfo används.",
    header_choice="6",  # Konfident
    footer_choice="5",  # 070 323 10 13 | mattias@konfident.se
    output_name="test_v2_konfident"
)

print("\n✅ Alla tester klara!")
print("Filer skapade:")
print("  - test_v2_privat.pdf")
print("  - test_v2_brev.pdf")
print("  - test_v2_konfident.pdf")
