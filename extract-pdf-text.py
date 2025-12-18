#!/usr/bin/env python3
"""
Script to extract text from PDF file for analysis
"""
import sys
import os

try:
    import PyPDF2
    HAS_PYPDF2 = True
except ImportError:
    HAS_PYPDF2 = False

try:
    import pdfplumber
    HAS_PDFPLUMBER = True
except ImportError:
    HAS_PDFPLUMBER = False

def extract_with_pypdf2(pdf_path):
    """Extract text using PyPDF2"""
    text = ""
    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        for page_num, page in enumerate(pdf_reader.pages):
            text += f"\n\n=== PAGE {page_num + 1} ===\n\n"
            text += page.extract_text()
    return text

def extract_with_pdfplumber(pdf_path):
    """Extract text using pdfplumber (better for tables)"""
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page_num, page in enumerate(pdf.pages):
            text += f"\n\n=== PAGE {page_num + 1} ===\n\n"
            # Extract text
            page_text = page.extract_text()
            if page_text:
                text += page_text
            
            # Extract tables if any
            tables = page.extract_tables()
            if tables:
                text += "\n\n--- TABLES ---\n\n"
                for table_num, table in enumerate(tables):
                    text += f"\nTable {table_num + 1}:\n"
                    for row in table:
                        if row:
                            text += " | ".join([str(cell) if cell else "" for cell in row]) + "\n"
    return text

def main():
    pdf_path = "test-data/REPORT AUM APRIL VS MEI.pdf"
    
    if not os.path.exists(pdf_path):
        print(f"Error: PDF file not found at {pdf_path}")
        sys.exit(1)
    
    print(f"Extracting text from: {pdf_path}\n")
    print("=" * 80)
    
    if HAS_PDFPLUMBER:
        print("Using pdfplumber...")
        text = extract_with_pdfplumber(pdf_path)
    elif HAS_PYPDF2:
        print("Using PyPDF2...")
        text = extract_with_pypdf2(pdf_path)
    else:
        print("Error: No PDF library available. Please install pdfplumber or PyPDF2:")
        print("  pip install pdfplumber")
        print("  or")
        print("  pip install PyPDF2")
        sys.exit(1)
    
    # Save to text file
    output_file = "test-data/REPORT_AUM_APRIL_VS_MEI_extracted.txt"
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(text)
    
    print(f"\nText extracted and saved to: {output_file}")
    print("\n" + "=" * 80)
    print("\nFirst 2000 characters:\n")
    print(text[:2000])
    
    return text

if __name__ == "__main__":
    main()

