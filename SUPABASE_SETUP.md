# 🗄️ Supabase Database Setup

## Credentials

**⚠️ Security Note:** Jangan commit credentials ke repository public!

Dapatkan credentials dari:
- **Supabase Dashboard** → Settings → API
  - Project URL
  - Anon Public Key (anon/public key)
  - Service Role Key (service_role key - **JANGAN expose di public!**)

**Project URL:** `https://your-project-id.supabase.co`

**Anon Public Key:** (dapatkan dari Supabase Dashboard)

**Service Role Key:** (dapatkan dari Supabase Dashboard - **RAHASIA!**)

## Setup Database Schema

### Method 1: Via Supabase Dashboard (Recommended)

1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Login dan pilih project Anda
3. Klik **SQL Editor** di sidebar kiri
4. Klik **New Query**
5. Copy semua isi dari file `supabase/schema.sql`
6. Paste di SQL Editor
7. Klik **Run** (atau tekan `Cmd/Ctrl + Enter`) untuk execute SQL

### Method 2: Via Supabase CLI (Optional)

```bash
# Install Supabase CLI (jika belum)
npm install -g supabase

# Login ke Supabase
supabase login

# Link ke project (ganti dengan project-ref Anda)
supabase link --project-ref your-project-ref

# Run migration
supabase db push
```

## Verify Setup

Setelah schema dijalankan, verifikasi dengan:

1. Buka **Table Editor** di Supabase Dashboard
2. Pastikan table `reports` sudah ada
3. Cek struktur table:
   - `id` (UUID, Primary Key)
   - `name` (TEXT)
   - `html_content` (TEXT)
   - `analysis_data` (JSONB)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

## Test Connection

Setelah setup, test koneksi dengan menjalankan aplikasi:

```bash
npm run dev
```

Lalu generate report dan cek di Supabase Dashboard apakah data tersimpan di table `reports`.

## Troubleshooting

### Error: "relation reports does not exist"
- Pastikan schema SQL sudah dijalankan di Supabase Dashboard
- Cek di **Table Editor** apakah table `reports` sudah ada

### Error: "permission denied"
- Pastikan RLS (Row Level Security) policies sudah dibuat
- Cek di **Authentication** > **Policies** apakah policies sudah aktif

### Error: "invalid API key"
- Pastikan credentials di `.env.local` sudah benar
- Pastikan environment variables di Vercel sudah di-set dengan benar

