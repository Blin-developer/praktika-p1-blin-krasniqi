# Shënime të Projektit – Katalogu i Bizneseve të Lipjanit

## Statusi aktual

**PËRFUNDIM I PLOTË I PROJEKTIT (100% DONE & DEPLOYED) ✅**  
Të gjitha 5 pikat madhore të kërkuara nga Komuna e Lipjanit, sistemi i njoftimeve me Gmail SMTP, të dhënat 100% reale gjeografike dhe të menysë, dhe 61 teste automatike PHPUnit kaluese janë implementuar plotësisht dhe push-uar në degën `development`.

---

## Ditari i punës (Kronologjia e Plotë)

### 6 tetor 2026 (Dita 1)
- [x] Klonuar repository-i nga GitHub
- [x] Fshirë fajllat e panevojshëm (index.html)
- [x] Inicializuar projekti React (Vite)
- [x] Inicializuar projekti Laravel
- [x] Krijuar struktura e folderave (docs/, frontend/, backend/)
- [x] Shkruar README profesional
- [x] Konfiguruar .gitignore

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

### 10 tetor 2026 (Dita 5)
- [x] Verifikuar statusin e repository-t dhe degën aktive të zhvillimit (`development`)
- [x] Aktivizuar shërbimi MySQL (MariaDB 10.4.32) në portin 3307 dhe konfirmuar qasja TCP
- [x] Krijuar databaza e re `lipjan_businesses` (me `utf8mb4` dhe `utf8mb4_unicode_ci`)
- [x] Testuar dhe verifikuar lidhja e Laravel-it me MySQL përmes PDO

### 13 tetor 2026 (Java 2, Dita 1)
- [x] Ekzekutuar me sukses migrimet fillestare të Laravel-it me `php artisan migrate`
- [x] Krijuar migrimet specifike të katalogut:
  - `create_categories_table`
  - `create_settlements_table`
  - `create_businesses_table`
  - `create_services_table`
  - `create_business_service_table`
- [x] Krijuar Modelet Eloquent me marrëdhëniet e plota (`Category`, `Settlement`, `Service`, `Business`)
- [x] Krijuar `CatalogSeeder` me 30 bizneset fillestare të Lipjanit
- [x] Krijuar `frontend/src/services/api.js`, `useBusinesses.js`, `BusinessCard.jsx`, `BusinessList.jsx`, `BusinessCatalogPage.jsx`

### 19–24 tetor 2026 (Java 3)
- [x] **Sistemi i Reklamave (Advertisements):** Rregulla kohore (`draft`, `scheduled`, `active`, `expired`, `disabled`), llogaritje e `effective_status`, gjurmim real klikimesh (`trackClick`).
- [x] **Llogaritë e Përdoruesve:** Regjistrim, kyçje me Sanctum, modifikim profili dhe ruajtje e bizneseve të preferuara (`user_favorites`).
- [x] **Paneli Administrativ:** Menaxhim CRUD për biznese dhe reklama.
- [x] **Testet e automatizuara:** 59 teste PHPUnit kaluese me sukses.

---

### 29–30 tetor 2026 (Java 4 & Finalizimi Madhor)

#### 1. ⭐ Sistemi i Vlerësimeve & Përshtypjeve (Reviews & Ratings)
- [x] **Migrimi & Modeli:** Krijuar tabela `business_reviews` me `business_id`, `user_id`, `rating` (1-5), `comment` dhe indeks unik `(business_id, user_id)` për të garantuar 1 vlerësim për përdorues (mundësi modifikimi).
- [x] **Relacionet Eloquent:** Shtuar `reviews()` në modelin `Business`, me llogaritje automatike të `reviews_avg_rating` dhe `reviews_count`.
- [x] **API & Kontrolleri:** Ndërtuar `BusinessReviewController` me metodat `index`, `store`, `destroy` dhe `adminIndex`.
- [x] **Frontend:** Krijuar komponenti ndërveprues `ReviewSection.jsx` me yje interaktivë me hover, mesatare, shpërndarje statistikore 1-5 yje dhe modal autentikimi.
- [x] **Renditja:** Shtuar butoni `⭐ Më të Vlerësuarat` në katalogun kryesor për renditje sipas vlerësimit me yje.

#### 2. 🏢 Portali i Pretendimit të Pronësisë (Claim Your Business)
- [x] **Migrimi & Modeli:** Krijuar tabela `business_claims` (`business_id`, `user_id`, `full_name`, `phone`, `email`, `business_role`, `verification_notes`, `status`, `admin_notes`, `reviewed_by`, `reviewed_at`) dhe fusha `owner_id` në `businesses`.
- [x] **Kontrolleri:** Ndërtuar `BusinessClaimController` për dorëzim aplikimi, kontroll statusi, dhe aprovim/refuzim administrativ.
- [x] **Frontend:** Krijuar `BusinessClaimModal.jsx`, `OwnerBusinessModal.jsx` dhe skeda administrative `AdminClaimsTab.jsx`.
- [x] **Distinktivët:** Shfaqje e distinktivit `✓ Biznes i Verifikuar` dhe `Ju jeni Pronari i këtij Biznesi`.

#### 3. 📍 "Bizneset Afër Meje" (Geolocation & Leaflet Maps)
- [x] **Haversine Formula:** Implementuar algoritmi gjeodezik në `frontend/src/utils/distance.js` (`calculateHaversineDistanceKm`, `formatDistance`, `getDirectionsUrl`).
- [x] **GPS Real:** Integrim me `navigator.geolocation` me koordinata reale të përdoruesit.
- [x] **Harta Leaflet Interaktive:**
  - Harta me ndërrues shtresash: **🗺️ Rrugët (OpenStreetMap)** dhe **🛰️ Satelit (Esri World Imagery)**.
  - Fokusim në nivel rruge (zoom 16) për profilet e bizneseve.
  - Izolim i kufijve territorialë të Komunës së Lipjanit që harta të mos zvogëlohet kurrë jashtë qytetit.
  - Butoni i drejtpërdrejtë: **`🧭 Navigo me Google Maps ↗`**.
- [x] **100% Koordinata të Sakta:** Përditësuar të gjitha 60 bizneset e territorit të Lipjanit me koordinata fizike reale në rrugët përkatëse (0 biznese me koordinata boshe).

#### 4. 🏷️ Oferta Ditore dhe Zbritje Lokale (Deals & Coupons)
- [x] **Migrimi & Modeli:** Krijuar tabela `business_deals` me `title`, `description`, `discount_badge`, `coupon_code`, `original_price`, `deal_price`, `start_date`, `end_date`, `is_active`.
- [x] **Kontrolleri:** Ndërtuar `BusinessDealController` për shfaqje publike, filtrim aktiv dhe menaxhim nga admini & pronari.
- [x] **Frontend:**
  - Integrim i seksionit **`DealsSection.jsx`** në Faqen Kryesore.
  - Butoni i ri i filtrimit **`🏷️ Me Oferta`** në katalog.
  - Distinktivët pulsues **`🏷️ Ofertë`** në kartelat e katalogut.
  - Kutia e ofertave aktive në profilin e biznesit me kopjim të kodit promovues me 1 klik.
  - Skeda administrative **`AdminDealsTab.jsx`**.

#### 5. 📸 Galeri me Shumë Foto dhe Meny Digjitale
- [x] **Migrimet & Modelet:**
  - Tabela `business_photos`: fotografi me cilësi të lartë, titra dhe renditje.
  - Tabela `business_menu_items`: meny digjitale me kategori (Pjatat Kryesore, Sallata, Pije, etj.), çmime në Euro, etiketa vegjetariane dhe artikuj bestseller/popullorë.
- [x] **Të dhëna Reale të Populluara:** Krijuar `BusinessMediaSeeder` me **48+ fotografi HD** në **22 biznese** kryesore dhe **15 meny digjitale** të plota për gastronomitë dhe shërbimet e Lipjanit.
- [x] **Frontend:**
  - `BusinessPhotoGallery.jsx` me modal **Lightbox** interaktiv dhe shfletim me shigjeta.
  - `BusinessDigitalMenu.jsx` me filtra kategorish dhe kërkim me tekst në kohë reale.
  - Distinktivët vizualë **`📸 X`** dhe **`🍽️ Meny`** në kartelat e katalogut.

#### 6. 📩 Sistemi i Plotë i Njoftimeve me Gmail SMTP
- [x] **Konfigurimi SMTP:** Lidhje e sigurt me `smtp.gmail.com:587` me App Password të dedikuar.
- [x] **Klasat Mailable:**
  - `ClaimSubmittedAdminMail` – njoftim administratori për pretendim të ri.
  - `ClaimStatusUpdatedMail` – njoftim për aplikantin (aprovim/refuzim me arsyetim).
  - `NewReviewNotificationMail` – njoftim për vlerësim të ri me yje për adminin dhe pronarin.
  - `NewDealCreatedMail` – njoftim për ofertë promocionale të re.
- [x] **Dizajn Modern Frontend në Email:**
  - Layout i dedikuar `emails/layout.blade.php` me kokë zyrtare të Komunës së Lipjanit, barierë me gradient, kartela me skaje 20px, distinktiva statusi me ngjyra dhe butona CTA me hije.
- [x] **Marrës të Dyfishtë:** Konfiguruar për dërgim të sinkronizuar te `blinkrasniqi16@gmail.com` dhe `blinkrasniqi824@gmail.com`.

---

## Verifikimi Final i Cilësisë
- **Testet Automatikë (Backend):** 61 teste kaluese (1098 assertions, 0 failed).
- **Ndërtimi i Frontend-it:** `npm run build` kalon me sukses të plotë pa asnjë gabim (58 module).
- **Koordinatat Gjeografike:** 60 nga 60 biznese (100%) kanë koordinata të sakta fizike në hartë.
- **Git:** Dega `development` është e sinkronizuar me `origin/development`.
