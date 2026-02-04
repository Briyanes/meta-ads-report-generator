import csv
import os

csv_dir = "/Users/mac/VSC Project/Meta Ads Report Generator/ctlptopurchase"

print('='*60)
print('ANALISIS DATA CSV CTLP TO PURCHASE')
print('='*60)

# Bulan ini - ad creative (aggregated)
print('\n=== BULAN INI - AD CREATIVE (File Utama) ===')
with open(f'{csv_dir}/TTUG-bulan-ini-ad-creative.csv', 'r') as f:
    reader = csv.DictReader(f)
    rows = list(reader)
    
    # Lihat semua keys
    print(f'Total rows: {len(rows)}')
    print(f'Columns: {len(rows[0].keys())}')
    
    total_spent = sum(float(r['Amount spent (IDR)'] or 0) for r in rows)
    total_purchases = sum(float(r['Purchases'] or 0) for r in rows)
    total_atc = sum(float(r['Adds to cart'] or 0) for r in rows)
    total_impr = sum(float(r['Impressions'] or 0) for r in rows)
    total_reach = sum(float(r['Reach'] or 0) for r in rows)
    total_lc = sum(float(r['Link clicks'] or 0) for r in rows)
    total_cv = sum(float(r['Content views'] or 0) for r in rows)
    total_lpv = sum(float(r['Landing page views'] or 0) for r in rows)
    total_checkout = sum(float(r['Checkouts initiated'] or 0) for r in rows)
    total_results = sum(float(r['Results'] or 0) for r in rows)
    
    print(f'\n--- Metrics Summary ---')
    print(f'Amount Spent: Rp {total_spent:,.0f}')
    print(f'Impressions: {total_impr:,.0f}')
    print(f'Reach: {total_reach:,.0f}')
    print(f'Link Clicks: {total_lc:,.0f}')
    print(f'Content Views: {total_cv:,.0f}')
    print(f'Landing Page Views: {total_lpv:,.0f}')
    print(f'Adds to Cart: {total_atc:,.0f}')
    print(f'Checkouts Initiated: {total_checkout:,.0f}')
    print(f'Purchases: {total_purchases:,.0f}')
    print(f'Results: {total_results:,.0f}')
    
    print(f'\n--- Calculated KPIs ---')
    print(f'CTR: {(total_lc/total_impr*100) if total_impr > 0 else 0:.2f}%')
    print(f'CPC: Rp {total_spent/total_lc if total_lc > 0 else 0:,.0f}')
    print(f'CPM: Rp {(total_spent/total_impr*1000) if total_impr > 0 else 0:,.0f}')
    print(f'CPP (Cost per Purchase): Rp {total_spent/total_purchases if total_purchases > 0 else 0:,.0f}')
    print(f'Cost per ATC: Rp {total_spent/total_atc if total_atc > 0 else 0:,.0f}')
    
    # Conversion rates
    print(f'\n--- Funnel Conversion Rates ---')
    print(f'LC to CV: {(total_cv/total_lc*100) if total_lc > 0 else 0:.1f}%')
    print(f'CV to ATC: {(total_atc/total_cv*100) if total_cv > 0 else 0:.1f}%')
    print(f'ATC to Purchase: {(total_purchases/total_atc*100) if total_atc > 0 else 0:.1f}%')
    
    # Check if revenue exists
    pcv_values = [r.get('Purchases conversion value', '') for r in rows if r.get('Purchases conversion value', '')]
    if pcv_values:
        total_pcv = sum(float(v) for v in pcv_values if v)
        print(f'\nPurchases conversion value: Rp {total_pcv:,.0f}')
        print(f'ROAS: {total_pcv/total_spent if total_spent > 0 else 0:.2f}x')
    else:
        print(f'\n⚠️ Purchases conversion value: TIDAK ADA DATA')
        print(f'⚠️ ROAS tidak bisa dihitung (revenue kosong)')

print('\n=== BULAN LALU - CHECKING DATA ===')
with open(f'{csv_dir}/TTUG-bulan-lalu-ad-creative.csv', 'r') as f:
    reader = csv.DictReader(f)
    rows = list(reader)
    print(f'Total rows: {len(rows)}')
    if len(rows) == 0:
        print('⚠️ FILE KOSONG - Hanya header, tidak ada data bulan lalu')
    else:
        total_spent = sum(float(r['Amount spent (IDR)'] or 0) for r in rows)
        total_purchases = sum(float(r['Purchases'] or 0) for r in rows)
        print(f'Amount Spent: Rp {total_spent:,.0f}')
        print(f'Purchases: {total_purchases:,.0f}')

print('\n=== BREAKDOWN FILES ===')
breakdown_files = [
    ('age-gender', 'Age'),
    ('region', 'Region'), 
    ('platform-placement', 'Platform'),
]

for file_suffix, key in breakdown_files:
    filename = f'{csv_dir}/TTUG-bulan-ini-{file_suffix}.csv'
    if os.path.exists(filename):
        with open(filename, 'r') as f:
            reader = csv.DictReader(f)
            rows = list(reader)
            print(f'\n{file_suffix}: {len(rows)} rows')
            
            # Check if Purchases field has data
            purchases_data = [r for r in rows if r.get('Purchases', '')]
            if purchases_data:
                for row in purchases_data[:3]:
                    dim_val = row.get(key, 'N/A')
                    if file_suffix == 'age-gender':
                        dim_val = f"{row.get('Gender', 'N/A')} {row.get('Age', 'N/A')}"
                    elif file_suffix == 'platform-placement':
                        dim_val = f"{row.get('Platform', 'N/A')} - {row.get('Placement', 'N/A')}"
                    purchases = row.get('Purchases', 0)
                    spent = float(row.get('Amount spent (IDR)', 0) or 0)
                    print(f'  {dim_val}: {purchases} purchases, Rp {spent:,.0f}')
            else:
                print(f'  ⚠️ Tidak ada data purchases di breakdown {file_suffix}')
