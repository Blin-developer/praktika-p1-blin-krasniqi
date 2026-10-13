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
- [x] Kontrolluar konfigurimin e MySQL në `backend/.env` dhe `backend/config/database.php` (`DB_CONNECTION=mysql`, `DB_HOST=127.0.0.1`, `DB_PORT=3306`, `DB_DATABASE=lipjan_businesses`, `DB_USERNAME=root`)
- [x] Inspektuar migrimet ekzistuese bazë të Laravel-it (`users`, `cache`, `jobs`)
- [x] Identifikuar se shërbimi MySQL në mjedisin lokal (XAMPP) nuk ishte aktiv në portin 3306 dhe u përcaktuan hapat për aktivizim

### 10 tetor 2026 (Dita 5)
- [x] Verifikuar statusin e repository-t dhe degën aktive të zhvillimit (`development`)
- [x] Aktivizuar shërbimi MySQL (MariaDB 10.4.32) në portin 3306 dhe konfirmuar qasja TCP në `127.0.0.1:3306`
- [x] Verifikuar listën e databazave ekzistuese; u konfirmua se `lipjan_businesses` nuk ekzistonte dhe emri ishte i lirë
- [x] Krijuar databaza e re `lipjan_businesses` (me `utf8mb4` dhe `utf8mb4_unicode_ci`) pa prekur asnjë databazë ekzistuese
- [x] Testuar dhe verifikuar lidhja e Laravel-it me MySQL përmes PDO (`Connected successfully to: lipjan_businesses`)
- [x] Ekzekutuar `php artisan migrate:status`; u verifikua statusi (`Migration table not found.`), konform pritshmërive për një databazë të sapokrijuar dhe të zbrazët
- [x] Konfirmuar gatishmëria e 3 migrimeve standarde të Laravel-it (`users`, `cache`, `jobs`) pa ekzekutuar komanda destruktive

### 13 tetor 2026 (Java 2, Dita 1)
- [x] Verifikuar gjendjen e Git-it në degën `development` (working tree clean, commit paraardhës: `bcc6307`)
- [x] Verifikuar dhe aktivizuar shërbimin MySQL në portin 3306 dhe testuar lidhjen me Laravel përmes PDO (`Connected successfully to: lipjan_businesses`)
- [x] Kontrolluar statusin fillestar të migrimeve me `php artisan migrate:status` (`Migration table not found.`)
- [x] Ekzekutuar me sukses migrimet standarde fillestare të Laravel-it me `php artisan migrate`:
  - `0001_01_01_000000_create_users_table`
  - `0001_01_01_000001_create_cache_table`
  - `0001_01_01_000002_create_jobs_table`
- [x] Verifikuar rezultatin me `php artisan migrate:status` (të gjitha migrimet me status `[1] Ran`)
- [x] Konfirmuar krijimi i 9 tabelave të pritura në bazën e të dhënave `lipjan_businesses`:
  - `users`, `password_reset_tokens`, `sessions`
  - `cache`, `cache_locks`
  - `jobs`, `job_batches`, `failed_jobs`
  - `migrations`
- [x] Rishikuar detyrat e mbetura nga Java 1 dhe dalluar qartë statusin e tyre:
  - Të kryera: Struktura e projektit, konfigurimi Git/GitHub, konfigurimi bazë Laravel & React, konfigurimi dhe lidhja me MySQL, ekzekutimi i migrimeve fillestare të sistemit.
  - Të mbetura sipas planit të zhvillimit për integrim në Javën 2: Modelet dhe migrimet specifike të katalogut, seeders për të dhëna testuese, aktivizimi i rrugëve API (`routes/api.php`) dhe lidhja backend-frontend (CORS).
- [x] Audituar dhe testuar shtresën e Frontend-it: u konstatua mungesa e varësive lokale; u ekzekutua `npm install` në `frontend/`, u gjenerua `package-lock.json` dhe u testua ndërtimi i aplikacionit me `npm run build` (sukses i plotë pa gabime, 354ms).
- [x] Konfirmuar se mjedisi Full-Stack (PHP 8.2, Composer 2.8, Laravel 12, Node 22, React 19, MySQL) është plotësisht funksional dhe operativ.
- [x] Hartuar propozimin teknik të detajuar për skemën e bazës së të dhënave të katalogut (`categories`, `settlements`, `businesses`, `services`, `business_service`) me marrëdhëniet dhe fushat përkatëse pa krijuar ende skedarë para kohe.
- [x] Verifikuar që rezultati kryesor i Javës 1 (API që merr bizneset nga MySQL dhe React që i shfaq) kërkon ekzistencën e tabelës `businesses` dhe të dhënave testuese, prandaj mbetet objektivi primar për Ditën 2 të Javës 2.

---

## Vendimet teknike

| Vendimi | Zgjedhja | Arsyeja |
|---------|----------|---------|
| Frontend framework | React + Vite | I shpejtë, modern, i rekomanduar |
| Backend framework | Laravel 11/12 | PHP, REST API i lehtë, ekosistem i pasur |
| Database | MySQL | Relacional, i qëndrueshëm |
| Harta | Leaflet (Java 3) | Open-source, lehtë i integruar |
| Autentikimi | Laravel Sanctum (Java 1/3) | SPA-ready, i thjeshtë |

---

## Propozimi teknik për strukturën e databazës së katalogut (Java 2)

### 1. Entitetet kryesore dhe fushat e propozuara

#### A. Tabela `categories` (Kategoritë e bizneseve)
- `id` (BIGINT UNSIGNED, AUTO_INCREMENT, PRIMARY KEY)
- `name` (VARCHAR(100), NOT NULL) – Emri i kategorisë (p.sh. Gastronomi, Shëndetësi, Tregti, Shërbime)
- `slug` (VARCHAR(120), UNIQUE, NOT NULL) – Identifikuesi URL-friendly
- `description` (TEXT, NULLABLE) – Përshkrim opsional
- `icon` (VARCHAR(100), NULLABLE) – Emri i ikonës për ndërfaqen vizuale
- `timestamps` (`created_at`, `updated_at`)

#### B. Tabela `settlements` (Vendbanimet / Lokacionet e Komunës së Lipjanit)
- `id` (BIGINT UNSIGNED, AUTO_INCREMENT, PRIMARY KEY)
- `name` (VARCHAR(100), NOT NULL) – Emri i vendbanimit (p.sh. Lipjan Qendër, Gadime, Janjevë, Magure, Sllovi, Rufc)
- `slug` (VARCHAR(120), UNIQUE, NOT NULL) – Identifikuesi URL-friendly
- `postal_code` (VARCHAR(20), NULLABLE) – Kodi postar (p.sh. 14000)
- `timestamps` (`created_at`, `updated_at`)

#### C. Tabela `businesses` (Bizneset e katalogut)
- `id` (BIGINT UNSIGNED, AUTO_INCREMENT, PRIMARY KEY)
- `name` (VARCHAR(150), NOT NULL) – Emri zyrtar/tregtar i biznesit
- `slug` (VARCHAR(180), UNIQUE, NOT NULL) – Slug unik për faqen e profilit të biznesit
- `category_id` (BIGINT UNSIGNED, NOT NULL, FOREIGN KEY -> `categories.id` ON DELETE RESTRICT)
- `settlement_id` (BIGINT UNSIGNED, NOT NULL, FOREIGN KEY -> `settlements.id` ON DELETE RESTRICT)
- `description` (TEXT, NULLABLE) – Përshkrimi i zgjeruar i biznesit dhe ofertës
- `short_description` (VARCHAR(255), NULLABLE) – Përshkrim i shkurtër për kartelat e listimit
- `address` (VARCHAR(255), NULLABLE) – Adresa fizike (rruga, numri)
- `phone` (VARCHAR(50), NULLABLE) – Numri kontaktues i telefonit
- `email` (VARCHAR(100), NULLABLE) – Emaili zyrtar
- `website` (VARCHAR(255), NULLABLE) – Uebsajti zyrtar
- `latitude` (DECIMAL(10, 8), NULLABLE) – Koordinata gjeografike për hartën Leaflet
- `longitude` (DECIMAL(11, 8), NULLABLE) – Koordinata gjeografike për hartën Leaflet
- `logo_path` (VARCHAR(255), NULLABLE) – Shtegu i logos/fotos kryesore
- `status` (ENUM('draft', 'published', 'archived'), DEFAULT 'draft') – Statusi i publikimit
- `is_featured` (BOOLEAN, DEFAULT FALSE) – Përzgjedhje për ballinë/biznese të veçuara
- `opening_hours` (JSON, NULLABLE) – Orari i punës (ditët dhe orët)
- `timestamps` (`created_at`, `updated_at`)

#### D. Tabela `services` (Shërbimet)
- `id` (BIGINT UNSIGNED, AUTO_INCREMENT, PRIMARY KEY)
- `name` (VARCHAR(100), NOT NULL) – Emri i shërbimit (p.sh. Dërgesë me postë, Pagesë me kartelë, Wi-Fi falas, Parking)
- `slug` (VARCHAR(120), UNIQUE, NOT NULL)
- `description` (TEXT, NULLABLE)
- `timestamps` (`created_at`, `updated_at`)

#### E. Tabela Pivot `business_service` (Marrëdhënia Many-to-Many)
- `id` (BIGINT UNSIGNED, AUTO_INCREMENT, PRIMARY KEY)
- `business_id` (BIGINT UNSIGNED, NOT NULL, FOREIGN KEY -> `businesses.id` ON DELETE CASCADE)
- `service_id` (BIGINT UNSIGNED, NOT NULL, FOREIGN KEY -> `services.id` ON DELETE CASCADE)
- `timestamps` (`created_at`, `updated_at`)

---

### 2. Marrëdhëniet mes entiteteve (Eloquent Relationships)

- **Category -> Businesses:** `hasMany(Business::class)` | `belongsTo(Category::class)` (Një kategori përmban shumë biznese).
- **Settlement -> Businesses:** `hasMany(Business::class)` | `belongsTo(Settlement::class)` (Një vendbanim përmban shumë biznese).
- **Business <-> Services:** `belongsToMany(Service::class, 'business_service')` (Një biznes mund të ofrojë disa shërbime; një shërbim mund t'u takojë disa bizneseve).
- **User (Admin) -> Businesses:** Menaxhimi i statusit (`draft`, `published`, `archived`) bëhet nga administratori i autorizuar.

---

## Lidhjet e rëndësishme

- GitHub: https://github.com/Blin-developer/praktika-p1-blin-krasniqi
- Frontend port: http://localhost:5173
- Backend port: http://localhost:8000
- API base: http://localhost:8000/api

---

## Hapat e ardhshëm (Java 2, Dita 2)

1. Krijimi i migrimeve specifike të katalogut në Laravel (`create_categories_table`, `create_settlements_table`, `create_businesses_table`, `create_services_table`, `create_business_service_table`).
2. Krijimi i modeleve Eloquent (`Category`, `Settlement`, `Business`, `Service`) dhe përcaktimi i marrëdhënieve përkatëse.
3. Krijimi i seeder-ave me të dhëna testuese për Lipjanin (kategori reale, fshatra/zona të Lipjanit dhe biznese shembull).
4. Verifikimi dhe testimi i migrimeve dhe seeder-ave të katalogut në MySQL.

---

## Shënime teknike

- Laravel Sanctum përdoret për autentikim të administratorit
- CORS konfigurohet në `config/cors.php`
- API prefix: `/api/v1/`
- Secrets dhe API keys kurrë nuk shtohen në GitHub
