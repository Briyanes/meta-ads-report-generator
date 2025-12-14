# 🗄️ Supabase Database Setup

## Credentials

**Project URL:** `https://dhxvwbbdztjcwozesmxy.supabase.co`

**Anon Public Key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoeHZ3YmJkenRqY3dvemVzbXh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MTkxMjgsImV4cCI6MjA4MTI5NTEyOH0.VsnbLQIe0bUPlkLxN3XxoWNCNoaa4an98TIWFpq8O68
```

**Service Role Key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoeHZ3YmJkenRqY3dvemVzbXh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTcxOTEyOCwiZXhwIjoyMDgxMjk1MTI4fQ.COwKwB7VLLW0UTJY-Gdu4u7eLuuLObOpr19nUduhBe8
```

## Setup Database Schema

### Method 1: Via Supabase Dashboard (Recommended)

1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Login dan pilih project: **dhxvwbbdztjcwozesmxy**
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

# Link ke project
supabase link --project-ref dhxvwbbdztjcwozesmxy

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

