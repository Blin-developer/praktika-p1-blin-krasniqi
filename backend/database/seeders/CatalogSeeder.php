<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Settlement;
use App\Models\Service;
use App\Models\Business;
use Illuminate\Database\Seeder;

class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Kategoritë
        $categoriesData = [
            [
                'name' => 'Gastronomi',
                'slug' => 'gastronomi',
                'description' => 'Restorante, kafene, piceri dhe shërbime ushqimore',
                'icon' => 'utensils',
            ],
            [
                'name' => 'Tregti & Qendra Tregtare',
                'slug' => 'tregti',
                'description' => 'Supermarkete, dyqane, veshmbathje dhe pajisje shtëpiake',
                'icon' => 'shopping-cart',
            ],
            [
                'name' => 'Shëndetësi & Farmaci',
                'slug' => 'shendetesi',
                'description' => 'Poliklinika, farmaci, laboratorë dhe stomatologji',
                'icon' => 'heart-pulse',
            ],
            [
                'name' => 'Shërbime & Zejtari',
                'slug' => 'sherbime',
                'description' => 'Salone bukurie, rrobaqepësi, riparime dhe konsulencë',
                'icon' => 'briefcase',
            ],
            [
                'name' => 'Auto & Transport',
                'slug' => 'auto-transport',
                'description' => 'Autoservis, autolarje, pjesë këmbimi dhe transport',
                'icon' => 'car',
            ],
            [
                'name' => 'Edukim & Trajnime',
                'slug' => 'edukim',
                'description' => 'Qendra gjuhësh, kurse programimi, kopshte private',
                'icon' => 'graduation-cap',
            ],
        ];

        $categories = [];
        foreach ($categoriesData as $cat) {
            $categories[$cat['slug']] = Category::firstOrCreate(['slug' => $cat['slug']], $cat);
        }

        // 2. Vendbanimet e Lipjanit
        $settlementsData = [
            ['name' => 'Lipjan Qendër', 'slug' => 'lipjan-qender', 'postal_code' => '14000'],
            ['name' => 'Gadime e Ulët', 'slug' => 'gadime-e-ulet', 'postal_code' => '14012'],
            ['name' => 'Janjevë', 'slug' => 'janjeve', 'postal_code' => '14050'],
            ['name' => 'Magure', 'slug' => 'magure', 'postal_code' => '14060'],
            ['name' => 'Sllovi', 'slug' => 'sllovi', 'postal_code' => '14030'],
            ['name' => 'Rufc i Ri', 'slug' => 'rufc-i-ri', 'postal_code' => '14000'],
            ['name' => 'Dobrajë e Madhe', 'slug' => 'dobraje-e-madhe', 'postal_code' => '14070'],
            ['name' => 'Babush i Muhaxherëve', 'slug' => 'babush-i-muhaxhereve', 'postal_code' => '14000'],
        ];

        $settlements = [];
        foreach ($settlementsData as $set) {
            $settlements[$set['slug']] = Settlement::firstOrCreate(['slug' => $set['slug']], $set);
        }

        // 3. Shërbimet
        $servicesData = [
            ['name' => 'Wi-Fi falas', 'slug' => 'wifi-falas', 'description' => 'Qasje pa pagesë në internet me valë'],
            ['name' => 'Parking i rezervuar', 'slug' => 'parking', 'description' => 'Hapësirë e siguruar për parkimin e veturave'],
            ['name' => 'Pagesa me kartelë', 'slug' => 'pagesa-kartela', 'description' => 'Mundësi pagese me kartelë bankare dhe POS'],
            ['name' => 'Dërgesë në shtëpi', 'slug' => 'delivery', 'description' => 'Shërbim delivery i shpejtë në territorin e Lipjanit'],
            ['name' => 'Teracë verore', 'slug' => 'terace-verore', 'description' => 'Hapësirë komode e hapur në natyrë'],
            ['name' => 'Qasje për persona me nevoja të veçanta', 'slug' => 'qasje-pa-pengesa', 'description' => 'Hyrje e përshtatur pa barriera arkitektonike'],
        ];

        $services = [];
        foreach ($servicesData as $srv) {
            $services[$srv['slug']] = Service::firstOrCreate(['slug' => $srv['slug']], $srv);
        }

        // 4. Bizneset shembull të Lipjanit
        $businessesData = [
            [
                'name' => 'Restorant "Shpella e Gadimes"',
                'slug' => 'restorant-shpella-e-gadimes',
                'category_slug' => 'gastronomi',
                'settlement_slug' => 'gadime-e-ulet',
                'short_description' => 'Restorant tradicional me gatime vendore pranë Shpellës së Gadimes.',
                'description' => 'Restorant familjar tradicional pranë Monumentit të Mbrojtur Natyror Shpella e Gadimes. Ofron specialitete vendore, mish të freskët, ambient qetësues dhe shërbim profesional mikpritës.',
                'address' => 'Rruga e Shpellës, Gadime e Ulët',
                'phone' => '+383 44 111 222',
                'email' => 'info@shpellagadimes.com',
                'website' => 'https://shpellagadimes.com',
                'latitude' => 42.47890000,
                'longitude' => 21.20560000,
                'status' => 'published',
                'is_featured' => true,
                'opening_hours' => [
                    'monday_friday' => '08:00 - 23:00',
                    'saturday_sunday' => '08:00 - 00:00',
                ],
                'services' => ['wifi-falas', 'parking', 'pagesa-kartela', 'terace-verore'],
            ],
            [
                'name' => 'Lounge & Bar "Qendra"',
                'slug' => 'lounge-bar-qendra',
                'category_slug' => 'gastronomi',
                'settlement_slug' => 'lipjan-qender',
                'short_description' => 'Kafene moderne në qendër të qytetit me kafe cilësore dhe atmosferë të këndshme.',
                'description' => 'Pikëtakimi kryesor në sheshin e Lipjanit me përzgjedhje të pasur të kafesë italiane, pijeve freskuese dhe ëmbëlsirave artizanale.',
                'address' => 'Sheshi Adem Jashari, Lipjan',
                'phone' => '+383 45 222 333',
                'email' => 'kontakt@qendralounge.com',
                'website' => null,
                'latitude' => 42.52170000,
                'longitude' => 21.12580000,
                'status' => 'published',
                'is_featured' => true,
                'opening_hours' => [
                    'monday_friday' => '07:00 - 23:30',
                    'saturday_sunday' => '08:00 - 00:00',
                ],
                'services' => ['wifi-falas', 'pagesa-kartela', 'terace-verore'],
            ],
            [
                'name' => 'Supermarket "Lipjani Market"',
                'slug' => 'supermarket-lipjani-market',
                'category_slug' => 'tregti',
                'settlement_slug' => 'lipjan-qender',
                'short_description' => 'Supermarket i kompletuar me artikuj ushqimorë dhe higjienikë.',
                'description' => 'Supermarket modern me gamë të gjerë produktesh ushqimore vendore dhe ndërkombëtare, pemë e perime të freskëta ditore dhe çmime të volitshme.',
                'address' => 'Rruga Komandant Kumanova, Lipjan',
                'phone' => '+383 44 333 444',
                'email' => 'info@lipjanimarket.com',
                'website' => 'https://lipjanimarket.com',
                'latitude' => 42.52300000,
                'longitude' => 21.12700000,
                'status' => 'published',
                'is_featured' => false,
                'opening_hours' => [
                    'monday_saturday' => '07:30 - 22:00',
                    'sunday' => '08:00 - 20:00',
                ],
                'services' => ['parking', 'pagesa-kartela', 'delivery', 'qasje-pa-pengesa'],
            ],
            [
                'name' => 'Poliklinika & Laboratori "Drita Med"',
                'slug' => 'poliklinika-drita-med',
                'category_slug' => 'shendetesi',
                'settlement_slug' => 'lipjan-qender',
                'short_description' => 'Shërbime specialistike mjekësore, kontrolla pediatrike dhe laborator biokimik.',
                'description' => 'Poliklinikë me staf me përvojë të mjekëve specialistë dhe aparaturë bashkëkohore diagnostikuese. Analiza të shpejta laboratorike me saktësi maksimale.',
                'address' => 'Rruga Lidhja e Prizrenit, Lipjan',
                'phone' => '+383 38 580 123',
                'email' => 'ambulanca@dritamed.com',
                'website' => null,
                'latitude' => 42.52050000,
                'longitude' => 21.12400000,
                'status' => 'published',
                'is_featured' => true,
                'opening_hours' => [
                    'monday_friday' => '08:00 - 19:00',
                    'saturday' => '08:00 - 15:00',
                    'sunday' => 'Pushim',
                ],
                'services' => ['wifi-falas', 'pagesa-kartela', 'qasje-pa-pengesa'],
            ],
            [
                'name' => 'Auto Servis "Magurja"',
                'slug' => 'auto-servis-magurja',
                'category_slug' => 'auto-transport',
                'settlement_slug' => 'magure',
                'short_description' => 'Diagnostifikim kompjuterik, riparime mekanike dhe gomisteri.',
                'description' => 'Ofrojmë riparime të plota motorike, ndërrim vaji dhe filtrash, kontroll frenash dhe gomisteri të specializuar për të gjitha modelet e automjeteve.',
                'address' => 'Magjistralja Lipjan - Magure, km 3',
                'phone' => '+383 49 555 666',
                'email' => 'servis@magurja.com',
                'website' => null,
                'latitude' => 42.50200000,
                'longitude' => 21.05600000,
                'status' => 'published',
                'is_featured' => false,
                'opening_hours' => [
                    'monday_saturday' => '08:00 - 18:00',
                    'sunday' => 'Pushim',
                ],
                'services' => ['parking', 'pagesa-kartela'],
            ],
            [
                'name' => 'Qendra Edukative "Dija Janjevë"',
                'slug' => 'qendra-edukative-dija-janjeve',
                'category_slug' => 'edukim',
                'settlement_slug' => 'janjeve',
                'short_description' => 'Kurse të gjuhëve të huaja, programim për nxënës dhe mësim plotësues.',
                'description' => 'Qendër trajnimi për fëmijë dhe të rinj në Janjevë, e specializuar në gjuhën angleze, gjermane dhe themelet e programimit kompjuterik.',
                'address' => 'Rruga e Qendrës Kulturore, Janjevë',
                'phone' => '+383 44 777 888',
                'email' => 'dija.janjeve@gmail.com',
                'website' => null,
                'latitude' => 42.55800000,
                'longitude' => 21.25300000,
                'status' => 'published',
                'is_featured' => false,
                'opening_hours' => [
                    'monday_friday' => '09:00 - 18:00',
                    'saturday' => '10:00 - 14:00',
                    'sunday' => 'Pushim',
                ],
                'services' => ['wifi-falas'],
            ],
        ];

        foreach ($businessesData as $item) {
            $cat = $categories[$item['category_slug']];
            $settle = $settlements[$item['settlement_slug']];

            $biz = Business::updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'name' => $item['name'],
                    'category_id' => $cat->id,
                    'settlement_id' => $settle->id,
                    'short_description' => $item['short_description'],
                    'description' => $item['description'],
                    'address' => $item['address'],
                    'phone' => $item['phone'],
                    'email' => $item['email'],
                    'website' => $item['website'],
                    'latitude' => $item['latitude'],
                    'longitude' => $item['longitude'],
                    'status' => $item['status'],
                    'is_featured' => $item['is_featured'],
                    'opening_hours' => $item['opening_hours'],
                ]
            );

            // Lidhim shërbimet (pivot)
            $serviceIds = [];
            foreach ($item['services'] as $srvSlug) {
                if (isset($services[$srvSlug])) {
                    $serviceIds[] = $services[$srvSlug]->id;
                }
            }
            $biz->services()->sync($serviceIds);
        }

        // 5. Bizneset demo shtesë (24 biznese) për të arritur minimumi 30 total
        //    Me statuse të ndryshme: published, draft, archived
        $extraBusinesses = [
            // Published (16 biznese)
            ['name' => 'Biznes Demo 01 – Rrobaqepësi "Moda Lipjani"', 'slug' => 'rrobaqepesi-moda-lipjani', 'cat' => 'sherbime', 'set' => 'lipjan-qender', 'short' => 'Konfeksione dhe rregullim rrobash profesional.', 'status' => 'published', 'featured' => false],
            ['name' => 'Biznes Demo 02 – Furra "Buka e Artë"', 'slug' => 'furra-buka-e-arte', 'cat' => 'gastronomi', 'set' => 'lipjan-qender', 'short' => 'Bukë dhe ëmbëlsira tradicionale të pjekura çdo ditë.', 'status' => 'published', 'featured' => false],
            ['name' => 'Biznes Demo 03 – Farmaci "Shëndeti"', 'slug' => 'farmaci-shendeti', 'cat' => 'shendetesi', 'set' => 'gadime-e-ulet', 'short' => 'Barnatore me shërbim 24 orë dhe konsultim farmaceutik.', 'status' => 'published', 'featured' => false],
            ['name' => 'Biznes Demo 04 – Salon Bukurie "Glamour"', 'slug' => 'salon-bukurie-glamour', 'cat' => 'sherbime', 'set' => 'lipjan-qender', 'short' => 'Krehje, ngjyrosje dhe trajtim floku profesional.', 'status' => 'published', 'featured' => false],
            ['name' => 'Biznes Demo 05 – Pica "Vezuvi"', 'slug' => 'pica-vezuvi', 'cat' => 'gastronomi', 'set' => 'sllovi', 'short' => 'Pica artizanale me djeginë në furrë me dru.', 'status' => 'published', 'featured' => true],
            ['name' => 'Biznes Demo 06 – Gomisteri "Speed"', 'slug' => 'gomisteri-speed', 'cat' => 'auto-transport', 'set' => 'lipjan-qender', 'short' => 'Ndërrimi dhe balancimi i gomave, vulkanizim 24h.', 'status' => 'published', 'featured' => false],
            ['name' => 'Biznes Demo 07 – Dyqan Elektronike "TechZone"', 'slug' => 'dyqan-elektronike-techzone', 'cat' => 'tregti', 'set' => 'lipjan-qender', 'short' => 'Telefona, laptopë dhe aksesore elektronike.', 'status' => 'published', 'featured' => false],
            ['name' => 'Biznes Demo 08 – Kopshti Privat "Ylvija"', 'slug' => 'kopshti-privat-ylvija', 'cat' => 'edukim', 'set' => 'janjeve', 'short' => 'Kopsht privat me program edukativ dhe aktivitete kreative.', 'status' => 'published', 'featured' => false],
            ['name' => 'Biznes Demo 09 – Restorant "Mbi Shesh"', 'slug' => 'restorant-mbi-shesh', 'cat' => 'gastronomi', 'set' => 'lipjan-qender', 'short' => 'Gatime tradicionale shqiptare dhe ballkanike.', 'status' => 'published', 'featured' => false],
            ['name' => 'Biznes Demo 10 – Laborator Dentar "DentLip"', 'slug' => 'laborator-dentar-dentlip', 'cat' => 'shendetesi', 'set' => 'lipjan-qender', 'short' => 'Stomatologji dhe proteza dentare me teknologji moderne.', 'status' => 'published', 'featured' => true],
            ['name' => 'Biznes Demo 11 – Dyqan Veshjesh "Trend"', 'slug' => 'dyqan-veshjesh-trend', 'cat' => 'tregti', 'set' => 'babush-i-muhaxhereve', 'short' => 'Veshje modë për të gjitha moshat.', 'status' => 'published', 'featured' => false],
            ['name' => 'Biznes Demo 12 – Autolavasht "Sparkle"', 'slug' => 'autolavasht-sparkle', 'cat' => 'auto-transport', 'set' => 'rufc-i-ri', 'short' => 'Larje dhe lustrim automjetesh, tapiceri dhe parfumim.', 'status' => 'published', 'featured' => false],
            ['name' => 'Biznes Demo 13 – Çerdhe Private "Yjet"', 'slug' => 'cerdhe-private-yjet', 'cat' => 'edukim', 'set' => 'magure', 'short' => 'Kujdes ditor për fëmijë 1-5 vjeç.', 'status' => 'published', 'featured' => false],
            ['name' => 'Biznes Demo 14 – Klinikë Veterinare "PawCare"', 'slug' => 'klinike-veterinare-pawcare', 'cat' => 'shendetesi', 'set' => 'lipjan-qender', 'short' => 'Trajtim, vaksinim dhe shërbim urgjence për kafshë shtëpiake.', 'status' => 'published', 'featured' => false],
            ['name' => 'Biznes Demo 15 – Café "Terrace View"', 'slug' => 'cafe-terrace-view', 'cat' => 'gastronomi', 'set' => 'dobraje-e-madhe', 'short' => 'Kafene me pamje panoramike dhe ëmbëlsira artizanale.', 'status' => 'published', 'featured' => false],
            ['name' => 'Biznes Demo 16 – Marketi "ProFresh"', 'slug' => 'marketi-profresh', 'cat' => 'tregti', 'set' => 'sllovi', 'short' => 'Produkte të freskëta vendore çdo ditë.', 'status' => 'published', 'featured' => false],

            // Draft (4 biznese – regjistruar por ende pa aprovim)
            ['name' => 'Biznes Demo 17 – Studio Foto "Lens"', 'slug' => 'studio-foto-lens', 'cat' => 'sherbime', 'set' => 'lipjan-qender', 'short' => 'Fotografi profesionale, portrete dhe evente.', 'status' => 'draft', 'featured' => false],
            ['name' => 'Biznes Demo 18 – Transporti "LinkBus"', 'slug' => 'transporti-linkbus', 'cat' => 'auto-transport', 'set' => 'rufc-i-ri', 'short' => 'Shërbim transporti urban dhe ndërkomunal.', 'status' => 'draft', 'featured' => false],
            ['name' => 'Biznes Demo 19 – Shkolla e Gjuhëve "LinguaPlus"', 'slug' => 'shkolla-gjuheve-linguaplus', 'cat' => 'edukim', 'set' => 'gadime-e-ulet', 'short' => 'Kurse gjuhe angleze, gjermane dhe frenge.', 'status' => 'draft', 'featured' => false],
            ['name' => 'Biznes Demo 20 – Dyqan Mobiljesh "ArteHome"', 'slug' => 'dyqan-mobiljesh-artehome', 'cat' => 'tregti', 'set' => 'magure', 'short' => 'Mobilje dhe pajisje shtëpiake me dizajn modern.', 'status' => 'draft', 'featured' => false],

            // Archived (4 biznese – jo aktive më)
            ['name' => 'Biznes Demo 21 – Videoteka "Klasik" (arkiv)', 'slug' => 'videoteka-klasik', 'cat' => 'sherbime', 'set' => 'lipjan-qender', 'short' => 'Videotekë – jo aktive, mbyllur.', 'status' => 'archived', 'featured' => false],
            ['name' => 'Biznes Demo 22 – Internet Café "PixelNet" (arkiv)', 'slug' => 'internet-cafe-pixelnet', 'cat' => 'sherbime', 'set' => 'janjeve', 'short' => 'Qendër internet – mbyllur.', 'status' => 'archived', 'featured' => false],
            ['name' => 'Biznes Demo 23 – Farmaci "Shëndeti Janjevë" (arkiv)', 'slug' => 'farmaci-shendeti-janjeve-arkiv', 'cat' => 'shendetesi', 'set' => 'janjeve', 'short' => 'Farmaci e mbyllur – jo aktive.', 'status' => 'archived', 'featured' => false],
            ['name' => 'Biznes Demo 24 – Biznesi Demo (arkiv)', 'slug' => 'biznesi-demo-24-arkiv', 'cat' => 'tregti', 'set' => 'babush-i-muhaxhereve', 'short' => 'Biznes demo i arkivuar për qëllime testimi.', 'status' => 'archived', 'featured' => false],
        ];

        foreach ($extraBusinesses as $idx => $item) {
            $cat = $categories[$item['cat']];
            $settle = $settlements[$item['set']];
            $num = str_pad($idx + 1, 2, '0', STR_PAD_LEFT);

            Business::updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'name' => $item['name'],
                    'category_id' => $cat->id,
                    'settlement_id' => $settle->id,
                    'short_description' => $item['short'],
                    'description' => "Biznes Demo #{$num} – Shembull për qëllime testimi. Nuk paraqet informacion real të verifikuar.",
                    'address' => "Adresa Demo {$num}, Lipjan",
                    'phone' => null,
                    'email' => null,
                    'website' => null,
                    'latitude' => null,
                    'longitude' => null,
                    'status' => $item['status'],
                    'is_featured' => $item['featured'],
                    'opening_hours' => null,
                ]
            );
        }
    }
}
