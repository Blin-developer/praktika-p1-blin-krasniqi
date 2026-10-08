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
