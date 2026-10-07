# Katalogu i Bizneseve të Lipjanit

**Praktika Profesionale 2026/27 · Projekti 01**  
Shkolla Digjitale Lipjan

---

## Përshkrimi dhe Qëllimi

**Katalogu i Bizneseve të Lipjanit** është një platformë web full-stack e planifikuar për t'u ndërtuar gjatë një periudhe 4-javore. 

Qëllimi i projektit është t'u mundësojë qytetarëve dhe vizitorëve të komunës së Lipjanit kërkimin dhe filtrimin e bizneseve lokale, shërbimeve dhe informacioneve të kontaktit, si dhe vizualizimin e lokacioneve të tyre në hartë ndërvepruese.

---

## Teknologjitë e Planifikuara

| Shtresa | Teknologjia |
|---------|-------------|
| **Frontend** | React (Vite) |
| **Backend** | Laravel |
| **Database** | MySQL |
| **API** | REST API |
| **Harta** | Leaflet |
| **Autentikimi** | Laravel Sanctum |
| **Version Control** | Git & GitHub |

---

## Statusi Aktual i Projektit

- **Dita 1:** Inicializimi i strukturës fillestare të projektit (`backend/`, `frontend/`, `docs/`).
- **Dita 2:** Konfigurimi fillestar i projektit, verifikimi i Git repo, rregullimi i `.gitignore` dhe krijimi i `.env.example`.

*(Asnjë funksionalitet i databazës, API-ve ose ndërfaqes nuk është ndërtuar ende; ato do të zhvillohen gradualisht.)*

---

## Struktura Bazë e Repository-t

```text
praktika-p1-blin-krasniqi/
│
├── frontend/                    # React + Vite Application
│   ├── src/
│   ├── public/
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── backend/                     # Laravel 11 Application
│   ├── app/
│   ├── database/
│   ├── routes/
│   ├── .env.example
│   ├── .gitignore
│   └── composer.json
│
├── docs/                        # Dokumentacioni i projektit
│   └── project-notes.md
│
├── .env.example                 # Konfigurimet shembullore të projektit
├── .gitignore                   # Rregullat e Git ignore
└── README.md                    # Dokumentacioni kryesor
```

---

## Plani i Përgjithshëm i Zhvillimit (4 Javë)

### Java 1 – Themelet (5–11 tetor 2026)
- [x] Struktura e projektit dhe Git setup (Dita 1)
- [x] Konfigurimi fillestar dhe bazat e projektit (Dita 2)
- [ ] Konfigurimi i databazës MySQL dhe Migrations
- [ ] Seeders bazë për testime
- [ ] Lidhja Laravel + React dhe API bazë
- [ ] Autentikimi bazë i administratorit (Sanctum)

### Java 2 – Pjesa Publike (12–18 tetor 2026)
- [ ] Layout-i publike (Navbar, Footer)
- [ ] Homepage me modul kërkimi
- [ ] Faqja e listimit të bizneseve dhe filtrat
- [ ] Faqezimi (Pagination) dhe parametrat e URL-së
- [ ] Faqja e profililt të biznesit

### Java 3 – Paneli dhe Harta (19–25 tetor 2026)
- [ ] Paneli i administrimit (Admin Dashboard)
- [ ] CRUD i bizneseve (Shtim, Redaktim, Fshirje, Statuset)
- [ ] Menaxhimi i kategorive dhe vendbanimeve
- [ ] Integrimi i hartës ndërvepruese Leaflet
- [ ] Moduli i reklamave dhe promovimeve

### Java 4 – Përfundimi dhe Optimizimi (26 tetor – 1 nëntor 2026)
- [ ] Përshtatja responsive (Mobile, Tablet, Desktop)
- [ ] Trajtimi i gjendjeve (Loading, Empty, Error states)
- [ ] Siguria dhe validimi i të dhënave
- [ ] Testimi përfundimtar i skenarëve
- [ ] Përgatitja e dokumentacionit përfundimtar dhe prezantimi

---

## Informacion i Përgjithshëm

- **Studenti:** Blin Krasniqi
- **Projekti:** Katalogu i Bizneseve të Lipjanit – Praktika Profesionale 2026/27
- **Shkolla:** Shkolla Digjitale Lipjan
- **Periudha:** Tetor – Nëntor 2026