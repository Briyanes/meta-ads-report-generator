# Development Guide - Meta Ads Report Generator

## 🚀 Best Practices untuk Development

### 1. File Upload Implementation
**✅ DO:**
- Gunakan `<label htmlFor="inputId">` untuk wrap file upload area
- Input file harus `position: absolute` dengan `opacity: 0` dan `zIndex: 1`
- Content area harus `position: relative` dengan `zIndex: 2`
- Button/interactive elements harus `zIndex: 3` atau lebih tinggi

**❌ DON'T:**
- Jangan gunakan `onClick` pada div untuk trigger file input
- Jangan gunakan `document.getElementById().click()` jika bisa dihindari
- Jangan lupa set `zIndex` untuk layering elements

**Contoh yang Benar:**
```tsx
<label
  htmlFor="fileInput"
  className="file-upload"
  style={{ cursor: 'pointer', display: 'block', position: 'relative' }}
>
  <input
    id="fileInput"
    type="file"
    accept=".csv,text/csv"
    multiple
    onChange={handleFileChange}
    style={{ 
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      opacity: 0,
      cursor: 'pointer',
      zIndex: 1
    }}
  />
  {/* Content here */}
</label>
```

### 2. Error Handling
**✅ DO:**
- Selalu wrap API calls dengan try-catch
- Check response `Content-Type` sebelum parse JSON
- Provide user-friendly error messages
- Log errors untuk debugging

**Contoh:**
```tsx
try {
  const response = await fetch('/api/endpoint')
  const contentType = response.headers.get('content-type')
  
  if (!contentType?.includes('application/json')) {
    const text = await response.text()
    throw new Error(`Expected JSON, got: ${text.substring(0, 100)}`)
  }
  
  const data = await response.json()
  // Process data
} catch (error) {
  console.error('Error:', error)
  setError(error instanceof Error ? error.message : 'Unknown error')
}
```

### 3. State Management
**✅ DO:**
- Gunakan TypeScript untuk type safety
- Validate data sebelum set state
- Use proper state types (e.g., `'wow' | 'mom'` instead of `string`)

**Contoh:**
```tsx
const [retentionType, setRetentionType] = useState<'wow' | 'mom'>('wow')
const [objectiveType, setObjectiveType] = useState<'ctwa' | 'cpas' | 'ctlptowa'>('ctwa')
```

### 4. Build & Cache Management
**✅ DO:**
- Clear `.next` folder jika ada error build
- Clear `node_modules/.cache` jika ada module resolution issues
- Restart dev server setelah perubahan besar
- **Gunakan script helper:** `npm run dev:reset` untuk reset lengkap

**Commands:**
```bash
# Quick reset (recommended)
npm run dev:reset

# Manual reset
rm -rf .next
npm run dev

# Jika masih error, clear node_modules cache juga
rm -rf node_modules/.cache
rm -rf .next
npm run dev
```

### 5. Testing Checklist Sebelum Push
- [ ] `npm run build` berhasil tanpa error
- [ ] `npm run dev` berjalan tanpa error
- [ ] File upload berfungsi (click dan drag & drop)
- [ ] Generate HTML report berhasil
- [ ] Download PDF berfungsi
- [ ] Tidak ada error di browser console
- [ ] Tidak ada TypeScript errors (`npm run build`)
- [ ] Tidak ada ESLint errors

### 6. Common Issues & Solutions

#### Issue: Error 500 pada static files
**Solution:**
```bash
pkill -f "next dev"
rm -rf .next
npm run dev
```

#### Issue: Module not found errors
**Solution:**
```bash
rm -rf .next node_modules/.cache
npm install
npm run dev
```

#### Issue: File upload tidak clickable
**Solution:**
- Pastikan menggunakan `<label htmlFor="inputId">` bukan `<div>`
- Pastikan input file memiliki `position: absolute` dan `zIndex: 1`
- Pastikan tidak ada element lain yang block click event

#### Issue: PDF generation blank
**Solution:**
- Pastikan HTML sudah fully rendered sebelum capture
- Gunakan `window.print()` sebagai primary method
- Check browser console untuk errors

### 7. Git Workflow
**✅ DO:**
- Test lokal sebelum commit
- Write clear commit messages
- Push ke branch, test di staging sebelum merge

**Commands:**
```bash
# Before commit
npm run build
npm run dev  # Test manually

# Commit
git add .
git commit -m "feat: add new feature"
git push
```

### 8. Environment Variables
**✅ DO:**
- Never commit `.env.local` atau `.env` files
- Use `.env.example` untuk dokumentasi
- Set variables di Vercel Dashboard untuk production

**Files to ignore:**
```
.env
.env.local
.env*.local
```

### 9. Code Organization
**✅ DO:**
- Keep templates separate per objective (`reportTemplate-ctwa.ts`, `reportTemplate-cpas.ts`, etc.)
- Use consistent naming conventions
- Add comments untuk complex logic

**File Structure:**
```
lib/
  ├── reportTemplate-ctwa.ts
  ├── reportTemplate-cpas.ts
  ├── reportTemplate-ctlptowa.ts
  ├── pdfGenerator.ts
  └── csvParser.ts
```

### 10. Performance Tips
- Use `React.memo` untuk expensive components
- Lazy load heavy dependencies
- Optimize images jika ada
- Use `useCallback` untuk event handlers yang passed as props

---

## 🔧 Troubleshooting Quick Reference

| Error | Quick Fix |
|-------|-----------|
| `ERR_ABORTED 500` | Clear `.next`, restart dev server |
| `Cannot find module` | Clear `.next` dan `node_modules/.cache` |
| `Type error` | Check TypeScript types, run `npm run build` |
| File upload tidak bekerja | Check `label` dan `zIndex` implementation |
| PDF blank | Check HTML rendering, use `window.print()` |
| Build failed | Check console output, fix TypeScript/ESLint errors |

---

## 📝 Notes
- Selalu test di local sebelum push
- Keep dependencies updated
- Monitor Vercel deployment logs
- Check Supabase logs untuk database issues

