# Katalogu i Bizneseve – Komuna e Lipjanit

**Praktika Profesionale 2026/27 · Projekti 01**  
Platformë web për katalogimin dhe prezantimin e bizneseve dhe shërbimeve të komunës së Lipjanit.

Platforma u mundëson qytetarëve dhe vizitorëve të kërkojnë, filtrojnë dhe eksplorojnë bizneset lokale sipas emrit, kategorisë dhe vendbanimit. Projekti është ndërtuar si një zgjidhje e plotë full-stack me **React 19**, **Laravel 12** dhe **MySQL/MariaDB**.

---

## Statusi i Projektit

> **Statusi aktual:** Java 2 – Përfunduar me sukses (100%). Pjesa publike e katalogut dhe profili i biznesit janë plotësisht funksionale dhe të lidhura me API-në.

* ✅ **Frontend (React 19 + Vite):** Ndërfaqe dinamike dhe responsive me komponentë modulare.
* ✅ **Backend (Laravel 12):** REST API funksionale me kontrollerë, modele Eloquent dhe validim.
* ✅ **Databaza (MySQL/MariaDB):** E strukturuar, e migruar dhe e lidhur me sukses përmes PDO.
* ✅ **Të dhëna demo:** 30 biznese demo të gjeneruara në databazë:
  * **22** biznese me status `published` (shfaqen në katalog)
  * **4** biznese me status `draft` (të fshehura)
  * **4** biznese me status `archived` (të fshehura)
  * **6** kategori
  * **8** vendbanime
  * **6** shërbime
* ✅ **Kërkim në kohë reale:** Kërkim sipas emrit, përshkrimit dhe adresës me mekanizëm **debounce (300ms)**.
* ✅ **Filtrim i shumëfishtë:** Filtrim sipas kategorisë, vendbanimit dhe kombinimeve të tyre.
* ✅ **URL Filters:** Sinkronizim i dyanshëm i parametrave të kërkimit në URL dhe ruajtje pas rifreskimit (refresh/F5).
* ✅ **Profili i zgjeruar i biznesit:** Pamje e dedikuar me detaje të plota, shërbime, orare pune, kontakt (telefon, email, website), adresë, koordinata dhe lundrim kthyes pa humbur filtrat.
* ✅ **Pagination:** Faqëzim në anën e klientit me 10 biznese për faqe dhe resetim automatik të faqes gjatë filtrimit.
* ✅ **Gjendjet e ndërfaqes (UI States):** Trajtim i plotë i gjendjeve *Loading* (spinner), *Error* (me buton "Provo Sërish") dhe *Empty* ("Nuk u gjet asnjë biznes.").
* ✅ **Integrimi Full-Stack:** Komunikim i verifikuar dhe stabil ndërmjet React dhe Laravel API.
* ✅ **Testet e automatizuara:** 7 teste PHPUnit të kaluara me sukses (305 assertions).
* ✅ **Production Build:** `npm run build` ekzekutohet pa gabime (0 lint/build errors).
* ✅ **Version Control:** Zhvillim aktiv në degën `development` dhe sinkronizim i rregullt në GitHub.

*(Paneli i Administratorit, Autentikimi me Laravel Sanctum, Harta me Leaflet dhe Moduli i Reklamave janë të planifikuara për Java 3.)*

---

## Teknologjitë

| Pjesa | Teknologjia |
|-------|-------------|
| **Frontend** | React 19 + Vite |
| **Backend** | Laravel 12 |
| **Database** | MySQL / MariaDB |
| **API** | REST API |
| **Styling** | Vanilla CSS |
| **Maps** | Leaflet – Java 3 |
| **Authentication** | Laravel Sanctum – Java 3 |
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

### API Endpoints
Backend-i ofron endpoint-et REST API të mëposhtme:

* `GET /api/health` — Verifikon gjendjen dhe disponueshmërinë e shërbimit API.
* `GET /api/v1/businesses` — Kthen listën e bizneseve të publikuara.
  * Parametrat mbështetës:
    * `?search=` — Kërkon sipas fjalëve kyçe (emër, adresë, përshkrim).
    * `?category=` — Filtron sipas slug-ut të kategorisë.
    * `?settlement=` — Filtron sipas slug-ut të vendbanimit.
    * `?featured=1` — Kthen vetëm bizneset e veçuara.
* `GET /api/v1/businesses/{slug|id}` — Kthen detajet e plota të një biznesi sipas identifikuesit ose slug-ut.
* `GET /api/v1/categories` — Kthen listën e kategorive aktive bashkë me numrin e bizneseve përkatëse.
* `GET /api/v1/settlements` — Kthen listën e vendbanimeve aktive të komunës së Lipjanit.

---

## Database

Databaza e projektit përmban skemën relacionale të optimizuar për katalogun:

* **`categories`** — Kategoritë e bizneseve (emri, slug, përshkrimi, ikona).
* **`settlements`** — Vendbanimet e komunës së Lipjanit (emri, slug, kodi postar).
* **`businesses`** — Të dhënat kryesore të biznesit (emri, slug, adresa, telefoni, email, website, orari, statusi: `published`/`draft`/`archived`, `is_featured`, koordinatat gjeografike).
* **`services`** — Shërbimet/lehtësirat shtesë (Wi-Fi, Parking, Teracë, etj.).
* **`business_service`** — Tabela ndërlidhëse (pivot) shumë-me-shumë midis bizneseve dhe shërbimeve.

### Marrëdhëniet Kryesore:
* `Category` **1 → N** `Business` (Një kategori përmban shumë biznese).
* `Settlement` **1 → N** `Business` (Një vendbanim përmban shumë biznese).
* `Business` **N ↔ N** `Service` (Një biznes mund të ketë shumë shërbime dhe anasjelltas).

---

## Demo Data

* **30 biznese gjithsej**
  * **22** me status `published`
  * **4** me status `draft`
  * **4** me status `archived`
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
* **Rezultati aktual:** **7 teste të kaluara me sukses (305 assertions)**
  * `test_api_health_check_returns_ok` ✓
  * `test_can_list_published_businesses` ✓
  * `test_can_get_single_business_by_slug` ✓
  * `test_returns_404_for_non_existing_business` ✓
  * `test_can_list_categories_and_settlements` ✓
  * `ExampleTest` (Unit & Feature) ✓

### Build-i i Frontend-it
```bash
cd frontend
npm run build
```
* **Rezultati:** Paketohet me sukses në pak milisekonda përmes Vite, me 0 paralajmërime dhe 0 gabime sintaksore.

---

## Git Workflow

Repository-i ndjek një rrjedhë të pastër dhe të disiplinuar të zhvillimit:

* **`main`** — Dega kryesore e qëndrueshme; përdoret vetëm për lëshimet përfundimtare të verifikuara.
* **`development`** — Dega aktive e zhvillimit ku kryhen të gjitha punët ditore, ndryshimet, testet dhe përmirësimet.

> Puna e përditshme realizohet ekskluzivisht në degën `development` për të ruajtur integritetin e degës `main`.

---

## Plani i Zhvillimit (4 Javë)

### Java 1 – Themelet e Projektit (5–11 tetor 2026)
*Statusi: **Përfunduar***
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
- [x] Testet e integruara të API-së me PHPUnit (7 teste, 305 assertions)
- [x] Detajet e zgjeruara të profilit të biznesit (Business Profile) me shërbime, orare dhe kontakt nga API

### Java 3 – Paneli Administrativ dhe Harta (19–25 tetor 2026)
*Statusi: **Në pritje***
- [ ] Autentikimi i administratorit me Laravel Sanctum
- [ ] Paneli i administrimit (Admin Dashboard)
- [ ] Veprimet e plota CRUD për bizneset, kategoritë dhe vendbanimet
- [ ] Integrimi i hartës ndërvepruese me Leaflet
- [ ] Menaxhimi i reklamave dhe promovimeve lokale

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
