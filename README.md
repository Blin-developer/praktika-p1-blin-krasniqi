# Katalogu i Bizneseve – Komuna e Lipjanit

**Praktika Profesionale 2026/27 · Projekti 01**  
Platformë web për katalogimin dhe prezantimin e bizneseve dhe shërbimeve të komunës së Lipjanit.

Platforma u mundëson qytetarëve dhe vizitorëve të kërkojnë, filtrojnë dhe eksplorojnë bizneset lokale sipas emrit, kategorisë dhe vendbanimit. Projekti është ndërtuar si një zgjidhje e plotë full-stack me **React 19**, **Laravel 12** dhe **MySQL/MariaDB**.

---

## Statusi i Projektit

> **Statusi aktual:** Java 3 – Dita 5: **Përfundim i plotë i Javës 3 ✅**. Sistemi profesional i reklamave me rregulla kohore, regjistrimi dhe menaxhimi i llogarive të përdoruesve me ruajtjen e bizneseve (Favorites), ridizajnimi modern dhe premium i frontend-it me Navbar sticky, HomePage me Hero dhe Reklama, katalogu me 5 filtra, Admin Panel i avancuar për menaxhimin e bizneseve dhe reklamave, si dhe 59 teste automatike PHPUnit të kaluara me sukses (1092 assertions, 0 failed).

* ✅ **Sistemi i Reklamave (Advertisements):** Sistem i plotë promovimi me pozicione të kontrolluara (`homepage_featured`, `sponsored_businesses`, `sidebar_banner`), rregulla kohore strikte (`draft`, `scheduled`, `active`, `expired`, `disabled`), llogaritje dinamike e `effective_status`, lidhje me biznesin përkatës dhe gjurmim real i klikimeve (`trackClick`).
* ✅ **Llogaritë e Përdoruesve & Autentikimi:** Regjistrim publik i sigurt (`/api/v1/auth/register`), kyçje e përdoruesve të thjeshtë (`/api/v1/auth/user-login`), modifikim profili dhe ndryshim fjalëkalimi, ruajtje e bizneseve të preferuara (`user_favorites`). Ndarje strikte e privilegjeve (përdoruesi nuk mund të marrë rolin `is_admin`).
* ✅ **Frontend Modern & Redesign (React 19 + Vite):**
  * **Navbar e re:** Sticky navigation me brand të Lipjanit, navigim Home / Katalogu / Zbuloni, kërkim të shpejtë, menaxhim sesioni për vizitorët dhe përdoruesit e kyçur, dhe lidhje të fshehtë vetëm për administratorët.
  * **HomePage e re:** Hero section me mesazh të qartë dhe search bar të madh, karta promovuese të kategorive me numër real biznesesh, reklamë e spikatur (Featured Banner), rrjeti i bizneseve të sponsorizuara (Sponsored Ads), seksion informues për qytetarët dhe footer i pasur.
  * **Katalogu Publik:** 5 filtra dinamikë (Kategori, Vendbanim, Shërbim, Website, Orar), faqosje (12 për faqe), integrim i reklamës në sidebar, skeleton loaders, error states dhe URL query params.
  * **Profili i Biznesit:** Pamje profesionale me orare pune, shërbime, hartë Leaflet, lidhje drejtpërdrejt në Google Maps/OSM, dhe butoni "Ruaje biznesin" për përdoruesit e kyçur.
* ✅ **Paneli Administrativ:** Dashboard me statistika të sakta nga MySQL, menaxhim i plotë CRUD i 60 bizneseve dhe menaxhim i ri i dedikuar i reklamave (AdminAdvertisementsTab) me krijim, ndryshim, aktivizim/çaktivizim me një klik dhe validim të datave.
* ✅ **Backend & Siguria (Laravel 12 + Sanctum):** 63 REST API routes të mbrojtura me middleware `auth:sanctum` dhe `admin`.
* ✅ **Testet e automatizuara:** 59 teste PHPUnit kaluese (1092 assertions, 0 failed).
* ✅ **Production Build & Lint:** `npm run build` dhe `npm run lint` kalojnë me 0 gabime.
* ✅ **Version Control:** Zhvillim vetëm në branch-in `development` me commit-e përshkruese.

---

## Teknologjitë

| Pjesa | Teknologjia |
|-------|-------------|
| **Frontend** | React 19 + Vite |
| **Backend** | Laravel 12 |
| **Database** | MySQL / MariaDB |
| **API** | REST API |
| **Styling** | Vanilla CSS |
| **Authentication** | Laravel Sanctum |
| **Maps** | Leaflet – Në vijim të Javës 3 |
| **Version Control** | Git + GitHub |

---

## Funksionalitetet Aktuale

### Katalogu Publik
* **Shfaqja e bizneseve:** Listim i të gjitha bizneseve të publikuara me informacionet kyçe (emri, përshkrimi, adresa, telefoni, kategoria, vendbanimi, shërbimet).
* **Kërkimi me tekst:** Kërkim në fushën e emrit, adresës dhe përshkrimit (case-insensitive).
* **Debounce 300ms:** Parandalon dërgimin e thirrjeve të njëpasnjëshme në çdo shkypje të tasteve.
* **Filtrimi sipas kategorisë:** Zgjedhje nga lista dinamike e kategorive.
* **Filtrimi sipas vendbanimit:** Zgjedhje nga lista dinamike e vendbanimeve të komunës.
* **Kombinimi i filtrave:** Mundësi për të aplikuar kërkimin tekstual dhe filtrat njëkohësisht.
* **Filtrat në URL:** Parametrat `?search=...`, `?category=...`, `?settlement=...` ruhen në URL për shpërndarje (bookmarking).
* **Ruajtja pas refresh:** Hapja e një URL-je me filtra rikthen gjendjen e saktë të katalogut.
* **Butoni "Pastro":** Fshin të gjitha kriteret e kërkimit, pastron URL-në dhe shfaq sërish të gjitha bizneset.
* **Faqëzimi (Pagination):** Ndarje me nga 10 biznese për faqe me butonat "Faqja e mëparshme" dhe "Faqja e ardhshme".
* **Reset i pagination:** Faqëzimi rikthehet automatikisht në faqen e parë sa herë ndryshohen filtrat.
* **UI States:**
  * *Loading state:* Indikator vizual gjatë ngarkimit të të dhënave.
  * *Error state:* Njoftim për gabim në rrjet me mundësi ritestimi ("Provo Sërish").
  * *Empty state:* Mesazhi "Nuk u gjet asnjë biznes." kur asnjë rezultat nuk përputhet me kriteret.
### API Endpoints (63 Routes)
Backend-i ofron endpoint-et REST API të mëposhtme:

#### Publike (Katalogu & Shërbimet)
* `GET /api/health` — Verifikon gjendjen dhe disponueshmërinë e shërbimit API.
* `GET /api/v1/businesses` — Kthen listën e bizneseve të publikuara (mbështet search, category, settlement, service, has_website, open_now, sort, per_page).
* `GET /api/v1/businesses/{slug|id}` — Kthen detajet e plota të një biznesi.
* `GET /api/v1/categories` — Kthen listën e kategorive aktive bashkë me numrin e bizneseve.
* `GET /api/v1/settlements` — Kthen listën e vendbanimeve të Lipjanit.
* `GET /api/v1/services` — Kthen listën e lehtësirave/shërbimeve.

#### Sistemi i Reklamave (Publike)
* `GET /api/v1/advertisements` — Kthen reklamat aktive sipas pozicionit (`position=homepage_featured|sponsored_businesses|sidebar_banner`).
* `POST /api/v1/advertisements/{id}/click` — Regjistron një klikim real në reklamë.
* `POST /api/v1/advertisements/{id}/impression` — Regjistron një shikim real të reklamës.

#### Autentikimi i Përdoruesve & Administratorëve
* `POST /api/v1/auth/register` — Regjistrim publik i llogarive të përdoruesve (roli `is_admin` refuzohet nga mbrojtja).
* `POST /api/v1/auth/user-login` — Kyçje për përdoruesit e zakonshëm.
* `POST /api/v1/auth/login` — Kyçje e dedikuar për administratorët.
* `POST /api/v1/auth/logout` — Shkyçje dhe revokim i token-it Sanctum.
* `GET /api/v1/auth/me` — Të dhënat e përdoruesit/administratorit të kyçur.
* `PUT /api/v1/auth/profile` — Përditësimi i profilit (emri).
* `PUT /api/v1/auth/password` — Ndryshimi i fjalëkalimit me verifikim të fjalëkalimit aktual.

#### Bizneset e Ruajtura (Favorites - Përdorues i Kyçur)
* `GET /api/v1/user/favorites` — Kthen listën e bizneseve të ruajtura nga përdoruesi.
* `POST /api/v1/user/favorites/{businessId}` — Toggle ruajtjen / heqjen e biznesit nga të preferuarat.
* `DELETE /api/v1/user/favorites/{businessId}` — Heq biznesin nga lista e të preferuarave.

#### Paneli Administrativ (Mbrojtur me auth:sanctum dhe admin middleware)
* `GET /api/v1/admin/businesses` — Menaxhimi i bizneseve me statistika, filtra statusi dhe faqosje.
* `POST /api/v1/admin/businesses` — Krijimi i biznesit të ri.
* `GET /api/v1/admin/businesses/{id}` — Detajet e plota të biznesit për redaktim.
* `PUT /api/v1/admin/businesses/{id}` — Përditësimi i biznesit.
* `DELETE /api/v1/admin/businesses/{id}` — Fshirja/arkivimi i biznesit.
* `PATCH /api/v1/admin/businesses/{id}/status` — Ndryshimi i shpejtë i statusit (`published`, `draft`, `archived`).
* `GET /api/v1/admin/advertisements` — Lista e të gjitha reklamave për administrim.
* `POST /api/v1/admin/advertisements` — Krijimi i reklamës së re me rregulla kohore.
* `GET /api/v1/admin/advertisements/{id}` — Detajet e reklamës për redaktim.
* `PUT /api/v1/admin/advertisements/{id}` — Përditësimi i reklamës.
* `DELETE /api/v1/admin/advertisements/{id}` — Fshirja e reklamës.
* `PATCH /api/v1/admin/advertisements/{id}/toggle` — Aktivizimi / çaktivizimi i shpejtë i reklamës.

---

## Sistemi i Reklamave & Rregullat Kohore

Reklamat ndjekin një cikël jete strikt kohor të llogaritur autoritativisht në Backend:

| Statusi | Përshkrimi | Shfaqja Publike |
|---------|------------|-----------------|
| `draft` | Reklama është në përgatitje nga administratori | ❌ Jo |
| `scheduled` | Reklama është planifikuar për një datë të ardhshme (`starts_at > now`) | ❌ Jo |
| `active` | Reklama është brenda intervalit (`starts_at <= now <= ends_at`) dhe e aktivizuar | ✅ Po |
| `expired` | Koha e reklamës ka përfunduar (`ends_at < now`) | ❌ Jo |
| `disabled` | Administratori e ka çaktivizuar manualisht (`is_active = false`) | ❌ Jo |

> **Rregullat e Sigurisë:** Reklama shfaqet publikisht VETËM nëse biznesi i lidhur ka statusin `published`. Data e përfundimit duhet të jetë pas datës së fillimit. Llogaritja bëhet në nivel query në backend përmes `scopeActive()` dhe accessor-it `effective_status`.

---

## Database

Databaza e projektit përmban skemën relacionale të optimizuar për katalogun, autentikimin, reklamat dhe favoritet:

* **`users`** — Përdoruesit e sistemit me kolonën `is_admin` për ndarjen strikte të privilegjeve.
* **`personal_access_tokens`** — Tabela e token-ave API të Laravel Sanctum.
* **`categories`** — Kategoritë e bizneseve (emri, slug, përshkrimi, ikona).
* **`settlements`** — Vendbanimet e komunës së Lipjanit (emri, slug, kodi postar).
* **`businesses`** — Të dhënat kryesore të biznesit (emri, slug, adresa, telefoni, email, website, orari, statusi: `published`/`draft`/`archived`, `is_featured`, koordinatat gjeografike).
* **`services`** — Shërbimet/lehtësirat shtesë (Wi-Fi, Parking, Teracë, etj.).
* **`business_service`** — Tabela pivot shumë-me-shumë midis bizneseve dhe shërbimeve.
* **`advertisements`** — Reklamat promovuese (`business_id`, `title`, `description`, `image_url`, `cta_text`, `cta_url`, `position`, `status`, `is_active`, `starts_at`, `ends_at`, `views_count`, `clicks_count`).
* **`user_favorites`** — Tabela e lidhjes shumë-me-shumë midis përdoruesve dhe bizneseve të ruajtura (`user_id`, `business_id`).

### Marrëdhëniet Kryesore:
* `Business` **1 → N** `Advertisement` (Një biznes mund të ketë disa fushata reklamuese).
* `User` **N ↔ N** `Business` (Përmes `user_favorites` për ruajtjen e preferencave).
* `Category` **1 → N** `Business`.
* `Settlement` **1 → N** `Business`.
* `Business` **N ↔ N** `Service`.

---

## Demo Data
 
* **60 biznese gjithsej**
  * **50** me status `published`
  * **4** me status `draft`
  * **6** me status `archived`
* **6 kategori:** Gastronomi, Tregti, Shëndetësi & Farmaci, Shërbime & Zejtari, Auto & Transport, Edukim & Trajnime
* **8 vendbanime:** Lipjan Qendër, Gadime e Ulët, Janjevë, Magure, Sllovi, Rufc i Ri, Dobrajë e Madhe, Babush i Muhaxherëve
* **6 shërbime:** Wi-Fi falas, Parking veturash, Pagesa me kartelë, Dërgesë me porosi, Teracë / Ambient i jashtëm, Qasje për persona me nevoja të veçanta

> **Shënim:** Këto të dhëna janë të gjeneruara për qëllime demonstrimi përmes Seeder-ave të Laravel-it. Ato do të pasurohen dhe zëvendësohen me të dhëna reale nga komuna e Lipjanit gjatë fazave vijuese.

---

## Instalimi dhe Konfigurimi

### 1. Klonimi i Repository-t
```bash
git clone https://github.com/Blin-developer/praktika-p1-blin-krasniqi.git
cd praktika-p1-blin-krasniqi
```

### 2. Konfigurimi i Backend-it (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Konfiguroni lidhjen e databazës në skedarin `backend/.env` sipas mjedisit tuaj lokal:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306 # ose 3307 sipas konfigurimit të MySQL/XAMPP
DB_DATABASE=lipjan_businesses
DB_USERNAME=root
DB_PASSWORD=
```

Ekzekutoni migrimet dhe të dhënat demo:
```bash
php artisan migrate --seed
```

### 3. Konfigurimi i Frontend-it (React + Vite)
Në një terminal tjetër:
```bash
cd frontend
npm install
cp .env.example .env # nëse nevojitet rregullimi i VITE_API_BASE_URL
npm run dev
```

---

## Si të Ekzekutohet Projekti

Për të punuar me aplikacionin, serveri backend dhe ai frontend duhet të ekzekutohen njëkohësisht:

### Backend
```bash
cd backend
php artisan serve
```
* **URL e aplikacionit:** [http://127.0.0.1:8000](http://127.0.0.1:8000)
* **API Endpoint kryesor:** [http://127.0.0.1:8000/api/v1/businesses](http://127.0.0.1:8000/api/v1/businesses)
* **Health Check:** [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health)

### Frontend
Në një dritare terminali të veçantë:
```bash
cd frontend
npm run dev
```
* **URL e katalogut në shfletues:** [http://localhost:5173](http://localhost:5173)

---

## Testimi

Projekti posedon teste të automatizuara dhe verifikim të rregullt të build-it:

### Testet e Backend-it (PHPUnit)
```bash
cd backend
php artisan test
```
* **Rezultati aktual:** **59 teste të kaluara me sukses (1092 assertions, 0 failed)**
  * `AdminBusinessApiTest` (12 teste: listim, filtrim, kërkim, CRUD, validim, status) ✓
  * `AdvertisementApiTest` (10 teste: reklama aktive, draft/disabled/expired, planifikim, rregulla kohore, admin CRUD, click tracking) ✓
  * `AuthApiTest` (10 teste: login admin, token Sanctum, logout, profil, refuzim i joadminëve) ✓
  * `BusinessApiTest` (16 teste: katalog, kërkim, 5 filtra, detaje, 404) ✓
  * `UserAccountApiTest` (9 teste: regjistrim publik, parandalim admin role, login user, update profili, ndryshim passwordi, ruajtja e bizneseve) ✓
  * `ExampleTest` (Unit & Feature) ✓

### Build-i dhe Lint-i i Frontend-it
```bash
cd frontend
npm run build
npm run lint
```
* **Rezultati:** Paketohet me sukses në pak milisekonda përmes Vite, me 0 gabime sintaksore dhe 0 gabime lint.

---

## Git Workflow

Repository-i ndjek një rrjedhë të pastër dhe të disiplinuar të zhvillimit:

* **`main`** — Dega kryesore e qëndrueshme; përdoret vetëm për lëshimet përfundimtare të verifikuara.
* **`development`** — Dega aktive e zhvillimit ku kryhen të gjitha punët ditore, ndryshimet, testet dhe përmirësimet.

> Puna e përditshme realizohet ekskluzivisht në degën `development` për të ruajtur integritetin e degës `main`.

---

## Plani i Zhvillimit (4 Javë)

### Java 1 – Themelet e Projektit (5–11 tetor 2026)
*Statusi: **Përfunduar (100%)***
- [x] Inicializimi i strukturës së repository-t (React + Laravel)
- [x] Konfigurimi i Git & GitHub dhe degës `development`
- [x] Konfigurimi i bazës së të dhënave MySQL/MariaDB
- [x] Krijimi i skemave relacionale (Migrimet)
- [x] Modelet Eloquent dhe marrëdhëniet e plota
- [x] Seeder-at bazë me të dhëna demo
- [x] REST API fillestare dhe konfigurimi i CORS

### Java 2 – Pjesa Publike e Katalogut (12–18 tetor 2026)
*Statusi: **Përfunduar (100%)***
- [x] Ndërtimi i ndërfaqes publike të katalogut me React
- [x] Lidhja dhe konsumimi i të dhënave reale nga Laravel API
- [x] Moduli i kërkimit tekstual me debounce (300ms)
- [x] Filtrimi sipas kategorive dhe vendbanimeve
- [x] Sinkronizimi i filtrave me URL (URL search params)
- [x] Faqëzimi bazë në frontend me reset automatik
- [x] Gjendjet e ndërfaqes (Loading, Error, Empty states)
- [x] Testet e integruara të API-së me PHPUnit
- [x] Detajet e zgjeruara të profilit të biznesit (Business Profile) me shërbime, orare dhe kontakt nga API

### Java 3 – Paneli Administrativ dhe Harta (19–25 tetor 2026)
*Statusi: **Përfunduar (100%) ✅***
- [x] Autentikimi i administratorit me Laravel Sanctum (Java 3 – Dita 1)
- [x] Paneli i administrimit (Admin Dashboard) me statistika në kohë reale
- [x] Veprimet e plota CRUD për menaxhimin e bizneseve (Create, Read, Update, Delete/Archive)
- [x] 60 biznese të strukturuara në databazë (50 Published, 4 Draft, 6 Archived)
- [x] 5 filtra të plotë në katalog (Kategori, Vendbanim, Shërbim, Website, Orar)
- [x] Faqosje e avancuar (12 biznese për faqe)
- [x] Profili i zgjeruar me orare pune, fallbacks zyrtarë dhe hartë ndërvepruese Leaflet + Google Maps / OpenStreetMap
- [x] Auditimi, stabilizimi dhe testimi i plotë automatik (40 teste kaluese)

### Java 4 – Siguria, Optimizimi dhe Prezantimi (26 tetor – 1 nëntor 2026)
*Statusi: **Në pritje***
- [ ] Përshtatja e plotë responsive për pajisjet celulare
- [ ] Validimi i thelluar dhe masat e avancuara të sigurisë
- [ ] Testimi përfundimtar i skenarëve të përdorimit
- [ ] Përgatitja e dokumentacionit final, pamjeve (screenshots) dhe demonstrimit

---

## Struktura e Projektit

```text
praktika-p1-blin-krasniqi/
├── backend/                         # Aplikacioni Laravel 12
│   ├── app/
│   │   ├── Http/Controllers/Api/   # Business, Category, Settlement Controllers
│   │   └── Models/                 # Eloquent Models (Business, Category, Settlement, Service)
│   ├── config/                     # Konfigurimet (database, cors, app)
│   ├── database/
│   │   ├── migrations/             # Migrimet e tabelave të sistemit dhe katalogut
│   │   └── seeders/                # CatalogSeeder me të dhëna demo
│   ├── routes/
│   │   └── api.php                 # Rrugët REST API (/api/v1/...)
│   ├── tests/                      # Testet PHPUnit (Feature dhe Unit)
│   ├── .env.example
│   └── composer.json
│
├── frontend/                        # Aplikacioni React 19 + Vite
│   ├── src/
│   │   ├── components/             # BusinessCard, BusinessList, etj.
│   │   ├── hooks/                  # Custom hooks (useBusinesses)
│   │   ├── pages/                  # BusinessCatalogPage
│   │   ├── services/               # api.js për thirrjet HTTP
│   │   ├── App.jsx                 # Komponenti bazë
│   │   └── index.css / App.css     # Stilizimi i ndërfaqes
│   ├── public/
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── docs/                            # Dokumentacioni teknik
│   └── project-notes.md            # Ditari ditor i punës dhe shënimet e hollësishme
│
├── .env.example                     # Shembuj konfigurimi në nivel projekti
├── .gitignore                       # Rregullat e përjashtimit për Git
└── README.md                        # Ky skedar
```

---

## Dokumentimi

Ditari i plotë dhe i detajuar ditor i zhvillimit mirëmbahet në:  
📄 [`docs/project-notes.md`](docs/project-notes.md)

Aty regjistrohen çdo ditë hapat konkretë, vendimet arkitekturore, diagnostikimet teknike, rezultatet e testeve dhe planet vijuese.

---

## Siguria

* Skedarët `.env` dhe çdo konfigurim me të dhëna sensitive përjashtohen nga Git përmes `.gitignore`.
* Asnjë fjalëkalim, çelës API apo secret nuk publikohet në repository.
* Kredencialet e bazës së të dhënave dhe variablat e mjedisit konfigurohen vetëm lokalisht.

---

## Lidhjet

* **Repository në GitHub:** [https://github.com/Blin-developer/praktika-p1-blin-krasniqi](https://github.com/Blin-developer/praktika-p1-blin-krasniqi)
* **Dega e zhvillimit (development):** [https://github.com/Blin-developer/praktika-p1-blin-krasniqi/tree/development](https://github.com/Blin-developer/praktika-p1-blin-krasniqi/tree/development)

---

**Autori:** Blin Krasniqi  
**Mentori / Institucioni:** Shkolla Digjitale Lipjan  
**Periudha:** Tetor – Nëntor 2026
