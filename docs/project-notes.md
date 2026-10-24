# Shënime të Projektit – Katalogu i Bizneseve të Lipjanit

## Statusi aktual

**Java 3 – Paneli Administrativ, Harta dhe Finalizimi (19–24 tetor 2026) – PËRFUNDUAR 100% ✅**

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

### 15 tetor 2026 (Java 2, Dita 3)

#### Problemi me MySQL, Diagnostikimi dhe Zgjidhja
- **Problemi i raportuar:** API shfaqte gabimin `SQLSTATE[HY000] [2002] No connection could be made because the target machine actively refused it` gjatë thirrjes së `GET /api/v1/businesses`.
- **Diagnostikimi:**
  - U kontrolluan konfigurimet në `backend/.env` dhe `backend/config/database.php`.
  - U ekzekutuan komandat e rrjetit (`netstat -ano`) dhe inspektimi i proceseve (`Get-Process mysqld`).
  - U zbulua se shërbimi MySQL/MariaDB nga XAMPP (`mysqld.exe`) po dëgjonte në portin **3307** dhe jo në portin e paracaktuar 3306.
  - Në skedarin `backend/.env`, `DB_PORT=3307` ishte konfiguruar saktë, por shërbimi `mysqld` nuk kishte qenë i ndezur paraprakisht.
- **Zgjidhja:**
  - Shërbimi `mysqld` në XAMPP u konfirmua aktiv në portin 3307 me PID 14268.
  - U verifikua lidhja me `php artisan migrate:status`: të 8 migrimet u konfirmuan si të ekzekutuara (`Ran`).
  - U konfirmua se nuk nevojiteshin modifikime destruktive në skemat ekzistuese të të dhënave.

#### Testimi i API-së Reale
- Endpoint-i shëndetësor `GET /api/health` ktheu statusin `200 OK` me `{"status":"ok","message":"Lipjan Businesses API is running"}`.
- Endpoint-i kryesor `GET /api/v1/businesses` ktheu `200 OK` me saktësisht **22 biznese** me status `published`.
- U verifikua që bizneset me status `draft` (4) dhe `archived` (4) nuk ekspozohen në API-në publike.
- Endpoint-et ndihmëse `GET /api/v1/categories` (6 kategori) dhe `GET /api/v1/settlements` (8 vendbanime) kthyen të dhëna të sakta me lidhje të paprekura.
- Të dhënat demo në bazë: 30 biznese gjithsej (22 published, 4 draft, 4 archived), 6 kategori, 8 vendbanime, 6 shërbime.

#### Testimi React ↔ Laravel dhe Katalogut Publik
- U nisën dy serverët në prapavijë: Laravel Artisan (`127.0.0.1:8000`) dhe Vite Dev Server (`localhost:5173`).
- React konsumon me sukses të dhënat reale nga API-ja (jo të dhëna hardcoded).
- **Kërkimi (Search):**
  - Kërkimi për biznes ekzistues ("pica") ktheu me saktësi 1 rezultat.
  - Kërkimi pa rezultate ("xyzabc123") shfaqi gjendjen Empty me mesazhin: *"Nuk u gjet asnjë biznes."*
  - Kërkimi me shkronja të mëdha ("PICA") funksionoi siç duhet (case-insensitive).
- **Debounce:**
  - Vlera e debounce prej **300ms** funksionon korrekt duke evituar kërkesa të panevojshme për çdo goditje taste.
- **Filtrat dhe Kombinimet:**
  - Filtrimi sipas kategorive dhe sipas vendbanimeve funksionon me saktësi.
  - Kombinimet: search + category, search + settlement, category + settlement, si dhe të treja së bashku funksionojnë pa ndërprerje.
- **URL Filters dhe Pastrimi:**
  - Parametrat `?search=...`, `?category=...`, `?settlement=...` pasqyrohen në URL në mënyrë të pastër pa trailing `?`.
  - U optimizua inicializimi i gjendjes në React nga `window.location.search` duke garantuar ruajtjen e filtrave pas rifreskimit (refresh/F5) ose ngjitjes së drejtpërdrejtë të URL-së.
  - Butoni **Pastro** pastron të gjitha fushat e kërkimit/filtrave, heq query params nga URL-ja dhe rikthen listën e plotë fillestare.
- **Faqëzimi (Pagination):**
  - Pagination në anën e frontend-it me 10 biznese për faqe (gjithsej 3 faqe për 22 biznese).
  - Butonat e paginimit: "Faqja e mëparshme", "Faqja e ardhshme", informacioni "Faqja X nga Y".
  - U shtua resetimi automatik i faqes në `1` sa herë ndryshohen filtrat, duke parandaluar faqe të zbrazëta.
- **Gjendjet e Ndërfaqes (UI States):**
  - *Loading:* Spinner shfaqet gjatë marrjes asinkrone të të dhënave.
  - *Error:* Mesazh i qartë me butonin "Provo Sërish" kur API-ja nuk përgjigjet.
  - *Empty:* Mesazhi "Nuk u gjet asnjë biznes." kur nuk ka përputhje me filtrat.

#### Rezultatet e PHPUnit
```
Tests: 7 passed (305 assertions)
Duration: 0.51s
✓ that true is true
✓ api health check returns ok
✓ can list published businesses
✓ can get single business by slug
✓ returns 404 for non existing business
✓ can list categories and settlements
✓ the application returns a successful response
```

#### Rezultati i Build-it Frontend
```
> frontend@0.0.0 build
> vite build
✓ 22 modules transformed.
dist/index.html                   0.47 kB │ gzip:  0.30 kB
dist/assets/index-CKNxReIo.css    6.83 kB │ gzip:  2.18 kB
dist/assets/index-D7jPjCOx.js   227.13 kB │ gzip: 70.81 kB
✓ built in 105ms — 0 gabime
```

#### Problemet që mbetën / Hapat e ardhshëm
- Asnjë problem bllokues; lidhja MySQL, API dhe React katalogu janë 100% stabile dhe funksionale.
- Pagination mbetet në anën e frontend-it për 22 bizneset ekzistuese; pagination në nivel baze të të dhënave (server-side) mund të shtohet kur volumi i të dhënave të rritet në fazat vijuese.
- Hapat e ardhshëm (Java 2, Dita 4 / Java 3): Përgatitja për panelin e administratorit, autentikimin me Sanctum dhe hartën Leaflet.

---

### 17 tetor 2026 (Java 2, Dita 5 – Kontrolli dhe Përmbyllja e Plotë e Javës 2)

#### Çfarë u kontrollua
- Verifikuar integriteti i Git-it (repository `praktika-p1-blin-krasniqi`, branch `development`, origin i sinkronizuar).
- Ekzekutuar dhe audituar të gjitha testet ekzistuese: 7 teste PHPUnit (305 assertions) kaluan me sukses të plotë.
- Kontrolluar shërbimi MySQL/MariaDB në portin 3307 dhe lidhja me Laravel përmes PDO (30 biznese gjithsej, 22 të publikuara).
- Verifikuar endpoint-et `/api/health`, `/api/v1/businesses`, `/api/v1/businesses/{idOrSlug}`, `/api/v1/categories`, `/api/v1/settlements`.
- Audituar frontend-i: kërkimi me debounce (300ms), filtrat sipas kategorisë dhe vendbanimit, sinkronizimi me parametrat në URL, butoni "Pastro", dhe faqëzimi (pagination).

#### Çfarë u implementua dhe u përfundua sot (Detyra e mbetur e Javës 2)
- **Profili i Biznesit (Business Profile):**
  - Shtuar funksioni `fetchBusiness(idOrSlug)` në `frontend/src/services/api.js` për marrjen e të dhënave të plota nga Laravel API (`GET /api/v1/businesses/{idOrSlug}`).
  - Krijuar hook-u `frontend/src/hooks/useBusiness.js` me menaxhim të gjendjeve loading, error dhe të dhënave.
  - Krijuar komponenti `frontend/src/components/BusinessProfile.jsx` me prezantim të pasur dhe të plotë:
    - Lundrim kthyes ("← Kthehu te Katalogu") dhe breadcrumb navigues.
    - Header me stemë ("★ I Veçuar"), kategori, titull dhe përshkrim të shkurtër.
    - Kartela "Rreth Biznesit" me përshkrim të plotë.
    - Kartela "Shërbimet & Lehtësirat" me distinktivë dhe përshkrime për çdo shërbim (Wi-Fi, Parking, etj.).
    - Kartela "Orari i Punës" me orare të formatuara për ditët e punës dhe fundjavë.
    - Kartela "Kontakti & Vendndodhja" me lidhje të klikueshme (`tel:`, `mailto:`, uebfaqe e jashtme) dhe adresë.
    - Koordinatat gjeografike me njoftim për integrimin e hartës Leaflet në Java 3.
  - Përditësuar `frontend/src/components/BusinessCard.jsx` me buton veprimi ("Shiko Profilin →") dhe titull të klikueshëm.
  - Përditësuar `frontend/src/components/BusinessList.jsx` për përcjelljen e ngjarjes së përzgjedhjes së biznesit.
  - Përditësuar `frontend/src/pages/BusinessCatalogPage.jsx` me rrugëzim të sinkronizuar në URL (`?business=slug`), mbështetje për historikun e shfletuesit (`popstate` për butonat Back/Forward) dhe ruajtje të filtrave aktivë gjatë kthimit.
  - Përditësuar `frontend/src/App.css` me stile responsive për profilin në desktop, tablet dhe mobile.
  - Përmirësuar SEO dhe metadata në `frontend/index.html` (`lang="sq"`, titull përshkrues dhe meta description).
  - Pastruar dhe optimizuar paralajmërimet e linterit (oxlint) në `useBusinesses.js` dhe `BusinessList.jsx`.

#### Rezultatet e Testeve
- **Backend (PHPUnit):** 7 passed (305 assertions) – kohëzgjatja 0.53s.
- **Frontend (Vite Build):** `npm run build` kaloi me 0 gabime (24 module të transformuara, 104ms).
- **Frontend (Linter):** `npm run lint` kaloi me 0 gabime.

#### Statusi Përfundimtar i Javës 2
- **JAVA 2: 100% E PËRFUNDUAR**.
- Të gjitha funksionalitetet e planifikuara për pjesën publike të katalogut dhe profilin e biznesit janë të realizuara, të lidhura me API-në dhe të testuara plotësisht.
- Projekti është i gatshëm për kalimin në Javën 3 (Paneli Administrativ, Sanctum dhe Harta Leaflet).

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

---

### 24 tetor 2026 (Java 3, Dita 5 – Finalizimi dhe Mbyllja e Javës 3)
- [x] **Auditimi i plotë i Javës 3:** Verifikuar të gjitha komponentët e Ditëve 1–4 në backend dhe frontend.
- [x] **Verifikimi i 60 bizneseve në MySQL:**
  - Identifikuar dhe fshirë në mënyrë të sigurt rekordin testues (ID 178 "Furra Tradita") përmes mekanizmave ekzistues të aplikacionit.
  - Rikthyer dhe konfirmuar gjendja zyrtare: **60 biznese gjithsej** (50 Published, 4 Draft, 6 Archived).
  - Verifikuar ID unike (60/60), slug unikë (60/60), emra unikë (60/60), koordinata të sakta brenda Lipjanit (60/60).
  - Verifikuar kontaktet dhe fallbacks zyrtarë (telefoni, email, uebfaqja, orari, adresa).
- [x] **Katalogu Publik:**
  - Testuar search bar me placeholder zyrtar: `Kërko biznes ose shërbim`.
  - Testuar 5 filtrat: Kategori, Vendbanim, Shërbim, Website, Orar dhe kombinimet e tyre.
  - Verifikuar ruajtjen e plotë të filtrave dhe kërkimit në URL query parameters dhe resetimin në faqen 1.
  - Verifikuar pagination: 12 për faqe (Page 1–4 me 12 biznese, Page 5 me 2 biznese për 50 të publikuarat).
- [x] **Profili i Biznesit & Kontaktet:**
  - Verifikuar oraret e plota dhe fallback: "Orari nuk është publikuar".
  - Verifikuar butonat `tel:...`, `mailto:...`, `href` me `target="_blank"` dhe `rel="noopener noreferrer"`.
  - Verifikuar hartën interaktive Leaflet dhe lidhjet me Google Maps / OpenStreetMap.
  - Verifikuar fallbacks: "Telefoni nuk është publikuar", "Email nuk është publikuar", "Uebfaqja nuk është publikuar", "Lokacioni i saktë nuk është verifikuar".
- [x] **Admin Panel & Autentikimi:**
  - Testuar hyrjen me kredenciale të sakta, dështimin me fjalëkalim të gabuar (401), refuzimin për joadmin (403).
  - Testuar shkyçjen (Logout) dhe invalidimin e token-it Sanctum.
  - Testuar Admin Dashboard me statistika të sakta nga databaza (Total 60, Published 50, Draft 4, Archived 6).
  - Testuar Admin Businesses: filtrim, kërkim, renditje, shikim, modali i arkivimit me mesazhin: "A jeni i sigurt që dëshironi ta arkivoni këtë biznes...".
  - Testuar rrjedhën e plotë CRUD të biznesit (Create 201, Update 200, Status patch 200, Delete 200, 404 pas fshirjes).
- [x] **Testet e Automatizuara & Build:**
  - `php artisan test`: **59 teste kaluese (1092 assertions, 0 failed)**.
  - `npm run build`: Build i suksesshëm me Vite (0 gabime).
  - `npm run lint`: Lint i suksesshëm me Oxlint (0 gabime).
  - `php artisan route:list --path=api`: 63 rrugë API aktive.
- [x] **Sistemi i Reklamave (Advertisements):**
  - Migrimi: `2026_10_24_000001_create_advertisements_table`.
  - Modeli `Advertisement` me rregulla kohore (`starts_at`, `ends_at`), status dinamik (`effective_status`), dhe `scopeActive()`.
  - Kontrollerët `AdvertisementController` (publik, shfaqje e vlefshme, `trackClick`) dhe `AdminAdvertisementController` (CRUD, toggle).
  - Pozicionet: `homepage_featured`, `sponsored_businesses`, `sidebar_banner`.
  - Seeder me 4 reklama demo për bizneset ekzistuese të Lipjanit.
  - 10 teste të automatizuara në `AdvertisementApiTest`.
- [x] **Llogaritë e Përdoruesve & Ruajtja e Bizneseve (User Accounts & Favorites):**
  - Migrimi: `2026_10_24_000002_create_user_favorites_table`.
  - Endpoint-et: `/api/v1/auth/register`, `/api/v1/auth/user-login`, `/api/v1/auth/profile`, `/api/v1/auth/password`.
  - Kontroll i rreptë i privilegjeve: pamundësi për marrjen e rolit `is_admin` gjatë regjistrimit.
  - Moduli i të preferuarave: `UserFavoriteController` (`index`, `toggle`, `destroy`).
  - 9 teste të automatizuara në `UserAccountApiTest`.
- [x] **Redizajnimi Modern i Frontend-it:**
  - `Navbar.jsx`: Brand modern, navigim i shpejtë, kërkim, menu mobile dhe profil llogarie.
  - `HomePage.jsx`: Hero section tërheqës, search bar, kartela kategorie me numër real biznesesh, reklamë e spikatur (Featured), kartela të sponsorizuara, info section dhe footer.
  - `BusinessCatalogPage.jsx`: Integrim i reklamës në sidebar dhe sinkronizim i plotë me URL params.
  - `UserAuthModal.jsx` & `UserProfileModal.jsx`: Modale moderne për kyçje, regjistrim, ndryshim fjalëkalimi dhe lista e bizneseve të ruajtura.
  - `AdminAdvertisementsTab.jsx` & `AdvertisementFormModal.jsx`: Administrim i plotë i reklamave nga Paneli Administrativ.
  - `App.css`: Mbi 1,500 rreshta stilizim modern, paletë ngjyrash premium, animacione dhe responsive design.
- [x] **Përmbyllja:** Java 3 mbyllet zyrtarisht me sukses të plotë 100% ✅.

---

## Shënime teknike

- Laravel Sanctum planifikohet për Java 3 (autentikim administrator)
- CORS konfigurohet në `config/cors.php` – `allowed_origins: ['*']` për zhvillim lokal
- API prefix: `/api/v1/` (me aliases të drejtpërdrejta `/api/`)
- Secrets dhe API keys kurrë nuk shtohen në GitHub
- Testet PHPUnit ekzekutohen me SQLite in-memory (izolim i plotë nga MySQL i prodhimit)
- `opening_hours` ruhet si TEXT/JSON; cast si `array` në modelin Business
