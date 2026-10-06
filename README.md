# Katalogu i Bizneseve të Lipjanit

**Praktika Profesionale 2026/27 · Projekti 01**  
Shkolla Digjitale Lipjan

---

## Përshkrimi

Platformë full stack për gjetjen e bizneseve, shërbimeve dhe kontakteve në komunën e Lipjanit.

Platforma i ndihmon qytetarët të gjejnë biznese, produkte dhe informata kontakti në komunën e Lipjanit. Vizitori mund të kërkojë një biznes, të ngushtojë rezultatet me filtra, të hapë profilin dhe të kuptojë çfarë ofron biznesi, ku ndodhet dhe si mund ta kontaktojë.

---

## Teknologjitë

| Shtresa | Teknologjia |
|---------|-------------|
| Frontend | React 18 + Vite |
| Backend | Laravel 11 |
| Database | MySQL 8 |
| API | REST API |
| Autentikimi | Laravel Sanctum |
| Harta | Leaflet (Java 3) |
| Version Control | Git + GitHub |

---

## Struktura e projektit

```
praktika-p1-blin-krasniqi/
│
├── frontend/                    # React + Vite
│   ├── src/
│   │   ├── components/          # Komponentët e ripërdorshëm
│   │   ├── pages/               # Faqet kryesore (Home, List, Profile...)
│   │   ├── layouts/             # Layout-et (PublicLayout, AdminLayout)
│   │   ├── services/            # API calls (axios)
│   │   ├── hooks/               # Custom React hooks
│   │   ├── utils/               # Funksione ndihmëse
│   │   ├── assets/              # Imazhe, ikona, fonte
│   │   ├── routes/              # Konfigurimi i routing-ut
│   │   ├── context/             # React Context (auth, filters...)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   └── package.json
│
├── backend/                     # Laravel 11
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/     # API Controllers
│   │   │   ├── Requests/        # Form Request Validation
│   │   │   └── Resources/       # API Resources (transformers)
│   │   ├── Models/              # Eloquent Models
│   │   └── Services/            # Business Logic Services
│   ├── database/
│   │   ├── migrations/          # Skema e databazës
│   │   ├── seeders/             # Të dhënat demo
│   │   └── factories/           # Model factories për testing
│   ├── routes/
│   │   ├── api.php              # API routes
│   │   └── web.php
│   ├── config/
│   └── tests/
│
├── docs/                        # Dokumentacioni
│   ├── screenshots/             # Screenshots të aplikacionit
│   └── project-notes.md         # Ditari i punës
│
├── README.md
├── .gitignore
└── LICENSE
```

---

## Plani 4-javor

### Java 1 – Themelet (5–11 tetor 2026)
- [x] Struktura e projektit
- [x] Git/GitHub setup
- [ ] MySQL + Migrations
- [ ] Seeders bazë
- [ ] Laravel + React connection
- [ ] API bazë
- [ ] Autentikimi i administratorit (Sanctum)

**Rezultati i javës:** API kthen listën e bizneseve nga MySQL dhe React i shfaq.

### Java 2 – Pjesa publike (12–18 tetor 2026)
- [ ] Homepage me kërkim
- [ ] Navbar dhe Footer
- [ ] Lista e bizneseve
- [ ] Kërkim dhe filtra
- [ ] Filtra në URL (query params)
- [ ] Faqezim (pagination)
- [ ] Profili i biznesit

**Rezultati i javës:** Vizitori gjen një biznes dhe hap profilin e tij.

### Java 3 – Paneli dhe harta (19–25 tetor 2026)
- [ ] Paneli administrues
- [ ] CRUD i bizneseve (Draft/Published/Archived)
- [ ] Kategoritë dhe vendbanimet
- [ ] Shërbimet
- [ ] Harta Leaflet
- [ ] Reklamat me rregullat e kohës

**Rezultati i javës:** Administratori menaxhon katalogun pa ndryshuar kodin.

### Java 4 – Përfundimi (26 tetor – 1 nëntor 2026)
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Loading, empty dhe error states
- [ ] Siguria (input validation, CSRF, XSS protection)
- [ ] Testimi i skenarëve
- [ ] README me screenshots
- [ ] Demo dhe prezantimi

**Rezultati i javës:** Projekti i dorëzuar dhe i prezantuar.

---

## Instalimi

### Kërkesat

- PHP >= 8.2
- Composer
- Node.js >= 18
- MySQL 8

### 1. Klono repository-n

```bash
git clone https://github.com/Blin-developer/praktika-p1-blin-krasniqi.git
cd praktika-p1-blin-krasniqi
```

### 2. Backend – Laravel

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Konfiguro `.env` me kredencialet e MySQL-it:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=lipjan_businesses
DB_USERNAME=root
DB_PASSWORD=
```

```bash
php artisan migrate
php artisan db:seed
php artisan serve
```

Backend do të jetë aktiv në: `http://localhost:8000`

### 3. Frontend – React

```bash
cd frontend
npm install
npm run dev
```

Frontend do të jetë aktiv në: `http://localhost:5173`

---

## Rolet e përdoruesve

| Roli | Qasja | Çfarë mund të bëjë |
|------|-------|---------------------|
| Vizitori | Pa regjistrim | Kërkon biznese, shikon profilet, hap hartën |
| Administratori | Llogari e autorizuar | Menaxhon të gjithë katalogun, kategoritë, reklamat |

---

## Informacion

- **Studenti:** Blin Krasniqi
- **Shkolla:** Shkolla Digjitale Lipjan
- **Projekti:** Praktika Profesionale 2026/27 – Projekti 01
- **Periudha:** 5 tetor – 1 nëntor 2026
- **Afati:** E diel, 1 nëntor 2026, ora 23:59

> ⚠️ Ky projekt është punë studentore dhe nuk pretendon të jetë regjistër zyrtar i komunës.