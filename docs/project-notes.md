# Shënime të Projektit – Katalogu i Bizneseve të Lipjanit

## Statusi aktual

**Java 1 – Themelet (5–11 tetor 2026)**

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



---

## Vendimet teknike

| Vendimi | Zgjedhja | Arsyeja |
|---------|----------|---------|
| Frontend framework | React + Vite | I shpejtë, modern, i rekomanduar |
| Backend framework | Laravel 11 | PHP, REST API i lehtë, ekosistem i pasur |
| Database | MySQL | Relacional, i qëndrueshëm |
| Harta | Leaflet (Java 3) | Open-source, lehtë i integruar |
| Autentikimi | Laravel Sanctum (Java 1) | SPA-ready, i thjeshtë |

---

## Lidhjet e rëndësishme

- GitHub: https://github.com/Blin-developer/praktika-p1-blin-krasniqi
- Frontend port: http://localhost:5173
- Backend port: http://localhost:8000
- API base: http://localhost:8000/api

---

## Hapat e ardhshëm (Java 1)

1. Konfigurimi i `.env` për MySQL
2. Krijimi i migrationeve
3. Krijimi i seederëve bazë
4. Lidhja Laravel ↔ React (CORS)
5. API endpoint bazë: `GET /api/businesses`

---

## Shënime teknike

- Laravel Sanctum përdoret për autentikim të administratorit
- CORS konfigurohet në `config/cors.php`
- API prefix: `/api/v1/`
- Secrets dhe API keys kurrë nuk shtohen në GitHub
