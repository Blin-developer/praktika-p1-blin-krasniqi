# Katalogu i Bizneseve – Komuna e Lipjanit 🏙️

**Praktika Profesionale 2026/27 · Projekti 01**  
Platformë web moderne dhe e plotë për katalogimin, kërkimin gjeografik dhe promovimin digjital të bizneseve dhe shërbimeve të Komunës së Lipjanit.

Ndërtuar me **React 19**, **Laravel 12 / 11**, **Leaflet Maps**, **Gmail SMTP** dhe **MySQL / MariaDB**.

---

## 🌟 Statusi Përfundimtar i Projektit

> **Statusi:** **I PËRFUNDUAR 100% ME SUKSES TË PLOTË ✅**  
> Të gjitha 5 pikat madhore të funksionalitetit, portali administrativ, sistemi i reklamave, llogaritë e përdoruesve, njoftimet me email Gmail, dhe 61 teste automatike PHPUnit (1098 assertions) janë implementuar, testuar dhe push-uar në degën `development`.

---

## 🚀 Karakteristikat Kryesore të Implementuara

### 1. ⭐ Sistemi i Vlerësimeve dhe Përshtypjeve (Reviews & Ratings)
* **Vlerësimi me Yje:** Qytetarët e kyçur mund të vlerësojnë çdo biznes me yje nga 1 në 5 dhe të lënë përshtypjen e tyre tekstuale.
* **Statistika të S争kta:** Llogaritje automatike e mesatares dhe shpërndarjes së yjeve (5★, 4★, 3★, 2★, 1★).
* **Mbrojtje nga Duplikimi:** Indeks unik që lejon 1 vlerësim për përdorues për çdo biznes, me mundësi modifikimi ose fshirjeje në çdo moment.
* **Renditje e Shpejtë në Katalog:** Butoni **`⭐ Më të Vlerësuarat`** rendit menjëherë bizneset nga ato me mesataren më të lartë dhe numrin më të madh të vlerësimeve.

### 2. 🏢 Portali i Pretendimit të Pronësisë (Claim Your Business)
* **Verifikim për Pronarët:** Pronarët e bizneseve mund të kërkojnë administrimin zyrtar të faqes së tyre duke dorëzuar NUI / Numrin Fiskal të ARBK-së, numrin e telefonit dhe rolin e tyre.
* **Paneli Administrativ:** Administratori komunal shqyrton kërkesat me mundësi aprovimi ose refuzimi me shënime zyrtare.
* **Menaxhim i Plotë për Pronarin:** Pronari i verifikuar fiton të drejtën të përditësojë të dhënat, të menaxhojë galerinë e fotove, menynë digjitale dhe ofertat promocionale.

### 3. 📍 "Bizneset Afër Meje" & Harta Leaflet me Satelit
* **GPS Real i Qytetarit:** Integrim me `navigator.geolocation` për marrjen e saktë të koordinatave fizike të përdoruesit.
* **Formula Haversine:** Llogaritje në kohë reale e distancës fizike (në metra ose kilometra) midis përdoruesit dhe çdo biznesi.
* **Renditje sipas Afërsisë:** Butoni **`🧭 Afër Meje`** në katalog rendit bizneset duke filluar nga më i afërti.
* **Harta Leaflet me 2 Shtresa:** 
  * 🗺️ **Pamje Rrugore (OpenStreetMap):** E qartë me të gjitha rrugët dhe ndërtesat e qytetit.
  * 🛰️ **Pamje Satelitore (Esri World Imagery):** Pamje reale satelitore me rezolucion të lartë.
* **Fokusim Inteligjent:** Zoom në nivel rruge (16) me kufij territorialë të mbrojtur brenda Komunës së Lipjanit.
* **Navigim Direkt:** Butoni **`🧭 Navigo me Google Maps ↗`** që hap itinerarin hap-pas-hapi.
* **100% Koordinata Reale:** Të 60 bizneset e katalogut janë pozicionuar në adresat e tyre të sakta fizike në Lipjan dhe fshatrat përreth.

### 4. 🏷️ Ofertat Ditore dhe Zbritjet Lokale (Deals & Coupons)
* **Promovim Lokal:** Bizneset dhe administratori mund të publikojnë oferta speciale me afat kohor dhe përqindje zbritjeje.
* **Kodet e Kuponave:** Kupona promovues me butonin e kopjimit me 1 klik.
* **Shfaqje në Shumë Nivele:**
  * Seksioni i dedikuar **"Ofertat & Zbritjet e Javës"** në faqen kryesore (HomePage).
  * Butoni i filtrimit të shpejtë **`🏷️ Me Oferta`** në katalog.
  * Distinktivët pulsues rozë **`🏷️ Ofertë`** në kartelat e bizneseve.
  * Kartela e ofertave aktive në profilin e biznesit.

### 5. 📸 Galeria e Fotove dhe Menyja Digjitale
* **Galeri me Shumë Foto (HD):** Mbi **48 fotografi reale** të integruara në **22 biznese** kryesore.
* **Modal Lightbox:** Pamje e zmadhuar e fotove me shfletim me shigjeta majtas/djathtas dhe mbështetje për tastierë.
* **Meny Digjitale & Çmimet:** Mbi **15 meny digjitale** të plota për gastronomitë dhe shërbimet e Lipjanit me ndarje sipas kategorive (*Pjatat Kryesore*, *Sallata*, *Pije*, etj.), çmime në Euro, etiketa vegjetariane dhe artikuj popullorë/bestseller.
* **Kërkim në Menynë Digjitale:** Kërkim me tekst në kohë reale brenda ushqimeve dhe artikujve të menusë.

### 6. 📩 Sistemi i Njoftimeve me Gmail SMTP
* **Integrim i Sigurt:** Dërgim i automatizuar përmes `smtp.gmail.com:587` me App Password të sigurt.
* **Dizajn Modern Frontend në Email:** Shabllone të personalizuara me layout zyrtar, gradients, kartela të rrumbullakosura me hije dhe butona veprimi CTA.
* **Njoftime për Ngjarje Kyçe:**
  * 🏢 Kërkesë e re për Pretendim Biznesi (Claim).
  * ✅ Aprovim ose refuzim i pretendimit për pronarin.
  * ⭐ Vlerësim i ri me yje nga qytetarët.
  * 🏷️ Publikim i një oferte apo kuponi të ri.
* **Marrës të Dyfishtë:** Dërgim i menjëhershëm te `blinkrasniqi16@gmail.com` dhe `blinkrasniqi824@gmail.com`.

### 7. 📢 Sistemi i Reklamave (Advertisements)
* Pozicione të kontrolluara (`homepage_featured`, `sponsored_businesses`, `sidebar_banner`).
* Rregulla kohore strikte (`draft`, `scheduled`, `active`, `expired`, `disabled`).
* Gjurmim i klikimeve dhe shfaqjeve në kohë reale.

---

## 🛠️ Teknologjitë e Përdorura

| Moduli | Teknologjia | Përshkrimi |
|--------|-------------|------------|
| **Frontend** | React 19 + Vite | SPA me performancë të lartë, debounce search dhe URL persistence |
| **Backend** | Laravel 12 / 11 | RESTful API, Eloquent ORM, Mailable, Form Requests |
| **Baza e të Dhënave** | MariaDB / MySQL | Porti 3307, indeksim i plotë dhe të dhëna reale gjeografike |
| **Harta & Gjeolokacioni**| Leaflet + Esri World Imagery | Hartë interaktive me shtresë rrugore dhe satelitore |
| **Email SMTP** | Gmail SMTP (TLS 587) | Njoftime transaksionale me dizajn modern Blade |
| **Autentikimi** | Laravel Sanctum | API tokens për Admin dhe Përdoruesit e Qytetit |
| **Stilimi** | Vanilla CSS Modern | Responsive, CSS variables, Dark/Light accents, pa varësi të rënda |
| **Testimi** | PHPUnit | 61 teste automatike të kaluara me sukses (1098 assertions) |

---

## 📊 Statistikat e të Dhënave në Sistem

* **Biznese Totale:** 60 biznese reale të Komunës së Lipjanit.
* **Biznese me Koordinata Fizike:** 60 nga 60 (100% mbulueshmëri).
* **Biznese me Galeri Fotosh HD:** 22 biznese (48+ foto me rezolucion të lartë).
* **Biznese me Meny Digjitale:** 15 biznese me çmime dhe artikuj të plotë.
* **Vendbanime:** 8 zona kryesore (Lipjan Qendër, Gadime e Ulët, Janjevë, Magure, Sllovi, Rufc i Ri, Dobrajë e Madhe, Babush).
* **Kategori:** 6 kategori kryesore ekonomike.

---

## 🔌 API Endpoints Kryesore

### Publike (Katalogu, Oferta, Vlerësime, Galeri & Meny)
* `GET /api/businesses` — Lista e bizneseve (mbështet search, category, settlement, service, website, schedule, sort, has_deals, has_photos, has_menu).
* `GET /api/businesses/{idOrSlug}` — Detajet e plota të një biznesi (përfshirë fotot, menynë, vlerësimet dhe ofertat).
* `GET /api/businesses/{idOrSlug}/reviews` — Lista e vlerësimeve dhe statistikat e yjeve.
* `POST /api/businesses/{idOrSlug}/reviews` — Shton ose përditëson vlerësimin (kërkon autentikim).
* `GET /api/businesses/{idOrSlug}/deals` — Ofertat aktive për një biznes të caktuar.
* `GET /api/deals` — Të gjitha ofertat dhe zbritjet aktive për qytetarët.
* `GET /api/businesses/{idOrSlug}/photos` — Galeria e fotografive të biznesit.
* `GET /api/businesses/{idOrSlug}/menu` — Menyja digjitale e biznesit.
* `GET /api/categories` — Lista e kategorive me numër biznesesh.
* `GET /api/settlements` — Vendbanimet e komunës.
* `GET /api/advertisements` — Reklamat aktive sipas pozicionit.

### Pretendimi i Biznesit (Claim System)
* `GET /api/businesses/{idOrSlug}/claim-status` — Kontrollon statusin e pretendimit për përdoruesin.
* `POST /api/businesses/{idOrSlug}/claim` — Dorëzon kërkesë pronësie me shënime verifikuese.

### Paneli Administrativ (`auth:sanctum` & `admin`)
* `GET /api/admin/businesses` — Menaxhimi i plotë i bizneseve me status dhe faqosje.
* `POST /api/admin/businesses` — Krijim biznesi i ri.
* `PUT /api/admin/businesses/{id}` — Përditësimi i biznesit.
* `DELETE /api/admin/businesses/{id}` — Fshirje/arkivim i biznesit.
* `GET /api/admin/claims` — Shqyrtimi i të gjitha kërkesave të pronësisë.
* `POST /api/admin/claims/{id}/approve` — Aprovimi i kërkesës (biznesi i kalon pronarit).
* `POST /api/admin/claims/{id}/reject` — Refuzimi i kërkesës me arsyetim.
* `GET /api/admin/deals` — Menaxhimi administrativ i ofertave.
* `POST /api/admin/deals` — Krijim oferte të re.
* `GET /api/admin/advertisements` — Menaxhimi i plotë i reklamave.

---

## 💻 Udhëzuesi i Instalimit dhe Nisjes Lokale

### 1. Klonimi i Projektit
```bash
git clone https://github.com/Blin-developer/praktika-p1-blin-krasniqi.git
cd praktika-p1-blin-krasniqi
git checkout development
```

### 2. Konfigurimi i Backend-it (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Konfiguroni `.env` me të dhënat e bazës dhe Gmail:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3307
DB_DATABASE=lipjan_businesses
DB_USERNAME=root
DB_PASSWORD=

MAIL_MAILER=smtp
MAIL_SCHEME=null
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=blinkrasniqi824@gmail.com
MAIL_PASSWORD="vgiq hyxv pjwl ivas"
MAIL_FROM_ADDRESS=blinkrasniqi824@gmail.com
MAIL_FROM_NAME="Katalogu i Bizneseve – Lipjan"
ADMIN_NOTIFICATION_EMAIL="blinkrasniqi16@gmail.com,blinkrasniqi824@gmail.com"
```

Ekzekutoni migrimet dhe seeders:
```bash
php artisan migrate
php artisan db:seed
```

Nisni serverin e Laravel:
```bash
php artisan serve
# Serveri do të dëgjojë në: http://127.0.0.1:8000
```

### 3. Konfigurimi i Frontend-it (React + Vite)
```bash
cd ../frontend
npm install
npm run dev
# Shfletuesi hapet në: http://localhost:5173
```

---

## 🧪 Ekzekutimi i Testeve

Testet e plota automatike të backend-it:
```bash
cd backend
php artisan test
# Rezultati: 61 passed (1098 assertions) ✅
```

Ndërtimi i frontend-it për produksion:
```bash
cd frontend
npm run build
# Rezultati: 58 modules transformed, built in ~200ms me 0 gabime ✅
```

---

## 🔑 Llogaritë e Testimit

| Roli | Email | Fjalëkalimi | Qasja |
|------|-------|-------------|-------|
| **Kryeadmin** | `blinkrasniqi16@gmail.com` | `admin12345` | Paneli Admin (`/admin`), aprovim claim, menaxhim ofertash & reklamash |
| **Qytetar / Përdorues** | `valon@lipjani.test` | `password` | Vlerësime me yje, ruajtje te preferuarat, pretendim biznesi |
| **Qytetar / Pronar** | `blinkrasniqi824@gmail.com` | `admin12345` | Vlerësime, pretendim dhe menaxhim i profilit personal |

---

## 🏛️ Kredite dhe Pronësia
* **Zhvilluesi:** Blin Krasniqi
* **Projekti:** Praktika Profesionale 2026/27 – Komuna e Lipjanit
* **Dega kryesore e zhvillimit:** `development`
