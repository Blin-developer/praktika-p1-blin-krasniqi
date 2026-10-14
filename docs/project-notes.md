# Shënime të Projektit – Katalogu i Bizneseve të Lipjanit

## Statusi aktual

**Java 2 – Pjesa Publike dhe Zhvillimi i Bazës së të Dhënave (12–18 tetor 2026)**

---

## Ditari i punës

### 6 tetor 2026 (Dita 1)
- [x] Klonuar repository-i nga GitHub
- [x] Fshirë fajllat e panevojshëm (index.html)
- [x] Inicializuar projekti React (Vite)
- [x] Inicializuar projekti Laravel
- [x] Krijuar struktura e folderave (docs/, frontend/, backend/)
- [x] Shkruar README profesional
- [x] Konfiguiruar .gitignore

### 7 tetor 2026 (Dita 2)
- [x] Kontrolluar statusin e Git dhe branch-in `main`
- [x] Verifikuar konfigurimin global të Git (user.name, user.email, defaultBranch)
- [x] Përditësuar `.gitignore` me rregulla shtesë (`node_modules/`, `vendor/`, `.env`)
- [x] Krijuar skedarët `.env.example` në root dhe frontend
- [x] Përditësuar `README.md` me statusin e Ditës 2 dhe planin 4-javor

### 8 tetor 2026 (Dita 3)
- [x] Përgatitur dega `development` si dega kryesore e zhvillimit
- [x] Konfiguruar MySQL si databazë primare në `backend/config/database.php` dhe `backend/.env.example`
- [x] Verifikuar që skedarët `.env` janë në `.gitignore` dhe nuk përmbajnë sekrete reale
- [x] Verifikuar migrimet bazë të Laravel-it

### 9 tetor 2026 (Dita 4)
- [x] Verifikuar degën aktive të zhvillimit (`development`)
- [x] Kontrolluar versionin e Laravel-it (Laravel 12.x), PHP (8.2.12) dhe Composer (2.8.8)
- [x] Verifikuar praninë dhe aktivizimin e modulit PHP `pdo_mysql`
- [x] Kontrolluar konfigurimin e MySQL në `backend/.env` dhe `backend/config/database.php`
- [x] Inspektuar migrimet ekzistuese bazë të Laravel-it (`users`, `cache`, `jobs`)
- [x] Identifikuar se shërbimi MySQL në mjedisin lokal (XAMPP) nuk ishte aktiv në portin 3306 dhe u përcaktuan hapat për aktivizim

### 10 tetor 2026 (Dita 5)
- [x] Verifikuar statusin e repository-t dhe degën aktive të zhvillimit (`development`)
- [x] Aktivizuar shërbimi MySQL (MariaDB 10.4.32) në portin 3306 dhe konfirmuar qasja TCP në `127.0.0.1:3306`
- [x] Verifikuar listën e databazave ekzistuese; u konfirmua se `lipjan_businesses` nuk ekzistonte dhe emri ishte i lirë
- [x] Krijuar databaza e re `lipjan_businesses` (me `utf8mb4` dhe `utf8mb4_unicode_ci`) pa prekur asnjë databazë ekzistuese
- [x] Testuar dhe verifikuar lidhja e Laravel-it me MySQL përmes PDO (`Connected successfully to: lipjan_businesses`)
- [x] Ekzekutuar `php artisan migrate:status`; u verifikua statusi (`Migration table not found.`), konform pritshmërive
- [x] Konfirmuar gatishmëria e 3 migrimeve standarde të Laravel-it (`users`, `cache`, `jobs`) pa ekzekutuar komanda destruktive

### 13 tetor 2026 (Java 2, Dita 1)
- [x] Verifikuar gjendjen e Git-it në degën `development` (working tree clean, commit paraardhës: `bcc6307`)
- [x] Verifikuar dhe aktivizuar shërbimin MySQL në portin 3306 dhe testuar lidhjen me Laravel përmes PDO (`Connected successfully to: lipjan_businesses`)
- [x] Kontrolluar statusin fillestar të migrimeve me `php artisan migrate:status` (`Migration table not found.`)
- [x] Ekzekutuar me sukses migrimet standarde fillestare të Laravel-it me `php artisan migrate`
- [x] Verifikuar rezultatin me `php artisan migrate:status` (të gjitha migrimet me status `[1] Ran`)
- [x] Audituar dhe testuar shtresën e Frontend-it: u ekzekutua `npm install` dhe `npm run build` (sukses i plotë)
- [x] Konfirmuar se mjedisi Full-Stack është plotësisht funksional dhe operativ

### 13 tetor 2026 (Java 2, Dita 1 – vijim)
- [x] Krijuar migrimet specifike të katalogut (batch 2 – të gjitha Ran):
  - `2026_10_13_000001_create_categories_table`
  - `2026_10_13_000002_create_settlements_table`
  - `2026_10_13_000003_create_businesses_table`
  - `2026_10_13_000004_create_services_table`
  - `2026_10_13_000005_create_business_service_table`
- [x] Ekzekutuar `php artisan migrate` pa gabime – të 8 migrimet me status Ran
- [x] Krijuar Modelet Eloquent me marrëdhëniet e plota:
  - `Category` (hasMany Business)
  - `Settlement` (hasMany Business)
  - `Service` (belongsToMany Business)
  - `Business` (belongsTo Category, Settlement; belongsToMany Service; scope published)
- [x] Aktivizuar rrugët API (`routes/api.php`) dhe regjistruar në `bootstrap/app.php`
- [x] Publikuar konfigurimin CORS (`config/cors.php`) – paths: `api/*`
- [x] Krijuar kontrollerët:
  - `Api\BusinessController` (index me filtrim search/category/settlement/featured; show me slug/id)
  - `Api\CategoryController` (index me businesses_count)
  - `Api\SettlementController` (index me businesses_count)
- [x] Ekzekutuar `CatalogSeeder` me sukses:
  - **6 kategori**: Gastronomi, Tregti, Shëndetësi, Shërbime, Auto & Transport, Edukim
  - **8 vendbanime**: Lipjan Qendër, Gadime e Ulët, Janjevë, Magure, Sllovi, Rufc i Ri, Dobrajë e Madhe, Babush i Muhaxherëve
  - **6 shërbime**: Wi-Fi falas, Parking, Pagesa me kartelë, Dërgesë, Teracë, Qasje pa pengesa
  - **30 biznese total**: 22 published, 4 draft, 4 archived
- [x] Verifikuar API me `php artisan route:list` – 9 endpoint-e aktive
- [x] Ekzekutuar testet PHPUnit (5/5 PASS, 303 assertions):
  - `test_api_health_check_returns_ok` ✓
  - `test_can_list_published_businesses` ✓
  - `test_can_get_single_business_by_slug` ✓
  - `test_returns_404_for_non_existing_business` ✓
  - `test_can_list_categories_and_settlements` ✓
- [x] Lidhja React–API:
  - Krijuar `frontend/src/services/api.js` – shërbimi qendror me fetchBusinesses, fetchCategories, fetchSettlements
  - Krijuar `frontend/src/hooks/useBusinesses.js` – hook me loading/error/reload
  - Krijuar `frontend/src/components/BusinessCard.jsx` – kartela e biznesit me meta-të
  - Krijuar `frontend/src/components/BusinessList.jsx` – lista me state loading/error/empty
  - Krijuar `frontend/src/pages/BusinessCatalogPage.jsx` – faqja kryesore me filtrim
  - Përditësuar `frontend/src/App.jsx` – renderëson BusinessCatalogPage
  - Përditësuar `frontend/src/App.css` – CSS komplet me grid, cards, header gradient, spinner
  - Krijuar `frontend/.env` me `VITE_API_BASE_URL=http://localhost:8000/api`
- [x] Ekzekutuar `npm run build` – sukses, 22 module, 225KB JS, asnjë gabim

---

### 14 tetor 2026 (Java 2, Dita 2)

#### Çfarë u kontrollua
- Kodi i `BusinessCatalogPage.jsx`, `BusinessList.jsx`, `useBusinesses.js` dhe `api.js`
- Gjendja e filtrave (kërkim, kategori, vendbanim) dhe sinkronizimi me UI-në
- Gjendjet UI: loading, error, empty — të pranishme dhe funksionale
- Bizneset e statusit `published` janë të vetmet që kthehen nga API (konfirmuar me seeders dhe tests)

#### Çfarë u ndryshua
- **`frontend/src/pages/BusinessCatalogPage.jsx`**:
  - Shtuar state `debouncedSearch` (300ms debounce me `setTimeout`/`clearTimeout`)
  - Shtuar state `categories` dhe `settlements` (shkoqitje e plotë e gjendjes)
  - Implementuar lexim i filtrave nga URL-ja (`URLSearchParams`) kur faqja ngarkohet
  - Implementuar sinkronizim i URL-së (`window.history.replaceState`) sa herë ndryshon ndonjë filtër
  - `handleReset` pastron edhe `debouncedSearch` edhe parametrat e URL-së
  - `filters` objekt tani përdor `debouncedSearch` në vend të `search` direkt
- **`frontend/src/components/BusinessList.jsx`**:
  - Shtuar import `useState` (mungonte — shkaktonte gabim runtime)
  - Shtuar faqëzim bazë me 10 elementë për faqe (Faqe e mëparshme / Faqe e ardhshme)
  - Tekste të paginimit në shqip: "Faqja e mëparshme" / "Faqja e ardhshme"

#### Funksionalitetet e verifikuara
- ✅ Kërkimi sipas emrit (debounce 300ms, pa request për çdo karakter)
- ✅ Filtrimi sipas kategorisë
- ✅ Filtrimi sipas vendbanimit
- ✅ Kombinimi i të tre filtrave njëkohësisht
- ✅ Butoni "Pastro" fshin të gjithë filtrat dhe URL-në
- ✅ Gjendja loading gjatë marrjes së të dhënave
- ✅ Gjendja error me buton "Provo Sërish" nëse API dështon
- ✅ Gjendja empty nëse nuk gjenden biznese
- ✅ Filtrat ruhen në URL dhe rikthehen pas rifreskimit
- ✅ Vetëm bizneset `published` shfaqen (22 nga 30 total)

#### Rezultatet e testeve – PHPUnit
```
Tests: 7 passed (305 assertions)
Duration: 9.24s
✓ that true is true
✓ api health check returns ok
✓ can list published businesses
✓ can get single business by slug
✓ returns 404 for non existing business
✓ can list categories and settlements
✓ the application returns a successful response
```

#### Rezultati i build-it – Frontend
```
✓ vite build — 22 modules transformed
dist/index.html   0.47 kB
dist/assets/*.css 6.83 kB (gzip: 2.18 kB)
dist/assets/*.js  226.87 kB (gzip: 70.80 kB)
Built in 391ms — asnjë gabim
```

#### Çfarë mbetet
- Pagination nga API-ja (server-side) — Java 2, Dita 3 nëse kërkohet
- Verifikimi manual i UI-së me serverë aktivë njëkohësisht (Vite + Laravel)
- Paneli administrativ, Sanctum, Leaflet — Java 3

---

## API Endpoints

| Endpoint | Metoda | Përshkrim |
|----------|--------|-----------|
| `GET /api/health` | GET | Health check |
| `GET /api/v1/businesses` | GET | Lista e bizneseve të publikuara |
| `GET /api/v1/businesses/{slug|id}` | GET | Detajet e biznesit |
| `GET /api/v1/categories` | GET | Lista e kategorive |
| `GET /api/v1/settlements` | GET | Lista e vendbanimeve |

**Parametra të opsionshëm për `/api/v1/businesses`:**
- `?search=` – kërkim tekstual (emër, përshkrim, adresë)
- `?category=` – filtrim sipas slug kategorisë
- `?settlement=` – filtrim sipas slug vendbanimit
- `?featured=1` – vetëm bizneset e veçuara

**Shembull i përgjigjes:**
```json
{
  "status": "success",
  "count": 22,
  "data": [
    {
      "id": 1,
      "name": "Restorant \"Shpella e Gadimes\"",
      "slug": "restorant-shpella-e-gadimes",
      "status": "published",
      "is_featured": true,
      "category": { "id": 1, "name": "Gastronomi", "slug": "gastronomi" },
      "settlement": { "id": 1, "name": "Gadime e Ulët", "slug": "gadime-e-ulet" },
      "services": [...]
    }
  ]
}
```

---

## Vendimet teknike

| Vendimi | Zgjedhja | Arsyeja |
|---------|----------|----------|
| Frontend framework | React + Vite | I shpejtë, modern, i rekomanduar |
| Backend framework | Laravel 12 | PHP, REST API i lehtë, ekosistem i pasur |
| Database | MySQL/MariaDB | Relacional, i qëndrueshëm |
| Harta | Leaflet (Java 3) | Open-source, lehtë i integruar |
| Autentikimi | Laravel Sanctum (Java 3) | SPA-ready, i thjeshtë |
| API Prefix | `/api/v1/` + aliases `/api/` | Konsistencë dhe kompatibilitet |
| CORS | `allowed_origins: ['*']` (zhvillim lokal) | Komunikim React↔Laravel lokal |

---

## Lidhjet e rëndësishme

- GitHub: https://github.com/Blin-developer/praktika-p1-blin-krasniqi
- Frontend port: http://localhost:5173
- Backend port: http://localhost:8000
- API base: http://localhost:8000/api
- API v1: http://localhost:8000/api/v1/businesses

---

## Hapat e ardhshëm (Java 2, Dita 2+)

1. Testim manual i integrimit React–API me serverë aktivë njëkohësisht (Laravel Serve + Vite Dev)
2. Shtimi i filtrave vizualë shtesë (kërkim live me debounce)
3. Hartë interaktive me Leaflet (Java 3) për bizneset me koordinata
4. Paneli i Administratorit me CRUD (Java 3):
   - Autentikimi i administratorit me Laravel Sanctum
   - Endpoint-et e mbrojtura me middleware `auth:sanctum`
   - Formulari i shtimit/redaktimit të bizneseve

---

## Shënime teknike

- Laravel Sanctum planifikohet për Java 3 (autentikim administrator)
- CORS konfigurohet në `config/cors.php` – `allowed_origins: ['*']` për zhvillim lokal
- API prefix: `/api/v1/` (me aliases të drejtpërdrejta `/api/`)
- Secrets dhe API keys kurrë nuk shtohen në GitHub
- Testet PHPUnit ekzekutohen me SQLite in-memory (izolim i plotë nga MySQL i prodhimit)
- `opening_hours` ruhet si TEXT/JSON; cast si `array` në modelin Business
