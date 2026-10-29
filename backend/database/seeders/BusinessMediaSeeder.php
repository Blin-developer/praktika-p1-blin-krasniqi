<?php

namespace Database\Seeders;

use App\Models\Business;
use App\Models\BusinessMenuItem;
use App\Models\BusinessPhoto;
use Illuminate\Database\Seeder;

class BusinessMediaSeeder extends Seeder
{
    public function run(): void
    {
        $mediaData = [
            // 1. Restaurant Marigona-J
            'restaurant-marigona-j' => [
                'photos' => [
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Ambienti i ngrohtë dhe tradicional i Restaurant Marigona-J',
                        'is_primary' => true,
                    ],
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Specialitete mishi në skarë dhe tavë tradicionale',
                        'is_primary' => false,
                    ],
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Përzgjedhje e verërave cilësore dhe pijeve freskuese',
                        'is_primary' => false,
                    ],
                ],
                'menu' => [
                    ['menu_category' => 'Specialitete të Furrës', 'name' => 'Tavë Kosi Tradicionale', 'description' => 'Mish qengji i pjekur me oriz dhe salcë kosi të freskët fshati.', 'price' => 7.50, 'is_popular' => true],
                    ['menu_category' => 'Specialitete të Furrës', 'name' => 'Biftek Marigona me Krem Kërpudhash', 'description' => 'Biftek viçi i butë i shoqëruar me perime të pjekura në furrë.', 'price' => 12.00, 'is_popular' => true],
                    ['menu_category' => 'Skarë Tradicionale', 'name' => 'Qebapa Shtëpie (10 copë)', 'description' => 'Me somun të ngrohtë, kajmak dhe spec djegës.', 'price' => 5.00, 'is_popular' => true],
                    ['menu_category' => 'Peshk & Deti', 'name' => 'Troftë e Freskët në Skarë', 'description' => 'E marinuar me hudhër, majdanoz dhe vaj ulliri ekstra të virgjër.', 'price' => 8.50, 'is_popular' => false],
                    ['menu_category' => 'Sallata', 'name' => 'Sallatë Fshati me Djathë të Bardhë', 'description' => 'Domate vendore, kastravec, ullinj dhe djathë Sharri.', 'price' => 3.50, 'is_vegetarian' => true],
                ],
            ],

            // 2. Aroma Coffee
            'aroma-coffee' => [
                'photos' => [
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Kafeteria moderne Aroma Coffee në qendër të Lipjanit',
                        'is_primary' => true,
                    ],
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Kafe artizanale me shkumë të butë dhe latte art',
                        'is_primary' => false,
                    ],
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Terasa komode e hapur për biseda dhe takime pune',
                        'is_primary' => false,
                    ],
                ],
                'menu' => [
                    ['menu_category' => 'Kafe & Pije të Ngrohta', 'name' => 'Espresso Illy Single / Double', 'description' => 'Kafe e pastër me aromë të pasur dhe krem natyral.', 'price' => 1.00, 'is_popular' => true],
                    ['menu_category' => 'Kafe & Pije të Ngrohta', 'name' => 'Cappuccino Italian me Kanellë', 'description' => 'Espresso me qumësht të vluar të butë dhe spërkatje kanelle.', 'price' => 1.50, 'is_popular' => true],
                    ['menu_category' => 'Kafe të Ftohta & Frappe', 'name' => 'Iced Caramel Macchiato', 'description' => 'Kafe e ftohtë me qumësht, akull dhe shurup karameli.', 'price' => 2.20, 'is_popular' => true],
                    ['menu_category' => 'Lëngje Natyrale', 'name' => 'Smoothie Detox me Fruta Pylli', 'description' => 'Boronicë, mjedër, banane dhe lëng molle natyral.', 'price' => 3.00, 'is_vegetarian' => true],
                ],
            ],

            // 3. AVICENA KS SHPK & AVICENA PLUS
            'avicena-ks-shpk' => [
                'photos' => [
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Laboratori modern biokimik dhe diagnostikues Avicena',
                        'is_primary' => true,
                    ],
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Aparaturë precize automatike për analiza gjaku dhe hormonale',
                        'is_primary' => false,
                    ],
                ],
                'menu' => [
                    ['menu_category' => 'Pakot e Analizave Laboratorike', 'name' => 'Check-Up i Përgjithshëm Rutinor', 'description' => 'Hemogram komplet, sedimentim, glukozë, lipidogram dhe funksion veshkor.', 'price' => 25.00, 'is_popular' => true],
                    ['menu_category' => 'Pakot e Analizave Laboratorike', 'name' => 'Paneli i Hormoneve Tiroide (TSH, FT3, FT4)', 'description' => 'Vlerësim i saktë laboratorik i funksionit të gjëndrës tiroide.', 'price' => 20.00, 'is_popular' => true],
                    ['menu_category' => 'Pakot e Analizave Laboratorike', 'name' => 'Vitamina D dhe Vitamina B12', 'description' => 'Matje e përqendrimit të vitaminave esenciale në gjak.', 'price' => 22.00, 'is_popular' => false],
                ],
            ],

            // 4. DENTICA
            'dentica' => [
                'photos' => [
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Klinika stomatologjike DENTICA me pajisje bashkëkohore',
                        'is_primary' => true,
                    ],
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Kujdes i butë dhe buzëqeshje estetike me teknologji digjitale',
                        'is_primary' => false,
                    ],
                ],
                'menu' => [
                    ['menu_category' => 'Shërbimet Dentare & Çmimet', 'name' => 'Pastrim Profesional i Gurëzave & Polirim', 'description' => 'Largim me ultrazë i pllakave bakteriale dhe shkëlqim i dhëmbëve.', 'price' => 20.00, 'is_popular' => true],
                    ['menu_category' => 'Shërbimet Dentare & Çmimet', 'name' => 'Zbardhim Profesional Estetik i Dhëmbëve', 'description' => 'Zbardhim me llambë lazerike të avancuar brenda 1 seance.', 'price' => 80.00, 'is_popular' => true],
                    ['menu_category' => 'Shërbimet Dentare & Çmimet', 'name' => 'Mbushje Kompozite Estetike (Plombë)', 'description' => 'Riparim me material me ngjyrë natyrale të dhëmbit me garanci.', 'price' => 25.00, 'is_popular' => true],
                ],
            ],

            // 5. ETC - Elkos Trading Center
            'etc-elkos-trading-center' => [
                'photos' => [
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Qendra e madhe tregtare ETC Lipjan – korridoret e produkteve ushqimore',
                        'is_primary' => true,
                    ],
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Fruta dhe perime të freskëta çdo ditë nga fermerët lokalë',
                        'is_primary' => false,
                    ],
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Sektori i tekstilit, teknikës dhe pajisjeve për amvisëri',
                        'is_primary' => false,
                    ],
                ],
            ],

            // 6. FitnessFit4Life
            'fitnessfit4life' => [
                'photos' => [
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Salla e pajisur me makina kardio dhe pesha profesionale',
                        'is_primary' => true,
                    ],
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Hapësira e trajnimit funksional dhe zonat e shtangave',
                        'is_primary' => false,
                    ],
                ],
                'menu' => [
                    ['menu_category' => 'Anëtarësimet & Pakot', 'name' => 'Abonim Mujor Standard (Pa Kufizim)', 'description' => 'Hyrje e pakufizuar në të gjitha zonat e fitnesit dhe dhomat e zhveshjes.', 'price' => 20.00, 'is_popular' => true],
                    ['menu_category' => 'Anëtarësimet & Pakot', 'name' => 'Abonim 3-Mujor me Zbritje', 'description' => 'Paketë tremujore ekonomike me plan stërvitor personal të përfshirë.', 'price' => 50.00, 'is_popular' => true],
                    ['menu_category' => 'Anëtarësimet & Pakot', 'name' => 'Seanca me Trajner Personal (12 orë)', 'description' => 'Udhëheqje 1-më-1 me instruktor të certifikuar për arritje të objektivave.', 'price' => 60.00, 'is_popular' => false],
                ],
            ],

            // 7. Buka e Artë
            'buka-e-arte' => [
                'photos' => [
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Furra artizanale Buka e Artë – bukë dhe simite të pjekura në furrë druri',
                        'is_primary' => true,
                    ],
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Brumëra të buta, byrekë shtëpie dhe pite me spinaq',
                        'is_primary' => false,
                    ],
                ],
                'menu' => [
                    ['menu_category' => 'Byrekë & Pite', 'name' => 'Byrek me Mish Viçi (Rreth)', 'description' => 'Pjekur në tepsi tradicionale me petë të holluara me dorë.', 'price' => 1.50, 'is_popular' => true],
                    ['menu_category' => 'Byrekë & Pite', 'name' => 'Byrek me Djathë të Bardhë Fshati', 'description' => 'Krokant nga jashtë dhe i butë e kremoz nga brenda.', 'price' => 1.30, 'is_popular' => true],
                    ['menu_category' => 'Bukë & Samunë', 'name' => 'Bukë Fshati me Miell Integral', 'description' => 'Bukë natyrale me maja origjinale pa aditivë.', 'price' => 0.70, 'is_popular' => false],
                    ['menu_category' => 'Ëmbëlsira të Furrës', 'name' => 'Kroasant me Çokollatë Nutella', 'description' => 'I mbushur bujarisht me çokollatë të shkrirë.', 'price' => 1.00, 'is_popular' => true],
                ],
            ],

            // 8. Argjend Barbershop
            'argjend-barbershop' => [
                'photos' => [
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Salloni profesional Argjend Barbershop me karrige klasike berberi',
                        'is_primary' => true,
                    ],
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Prerje moderne Fade, rregullim i mjekrës dhe trajtim me peshqir të ngrohtë',
                        'is_primary' => false,
                    ],
                ],
                'menu' => [
                    ['menu_category' => 'Shërbimet & Çmimet', 'name' => 'Qethje Moderne Fade & Larje Flokësh', 'description' => 'Përfshin stilim të flokëve me dyllë ose pomadë profesionale.', 'price' => 5.00, 'is_popular' => true],
                    ['menu_category' => 'Shërbimet & Çmimet', 'name' => 'Rregullim & Formësim Mjekre me Brisk Klasik', 'description' => 'Trajtim me vajra zbutëse dhe peshqir me avull.', 'price' => 3.50, 'is_popular' => true],
                    ['menu_category' => 'Shërbimet & Çmimet', 'name' => 'Pakoja VIP (Qethje + Mjekër + Maskë Fytyre)', 'description' => 'Pastrim lëkure me maskë të zezë aktive dhe masazh i lehtë koke.', 'price' => 10.00, 'is_popular' => true],
                ],
            ],

            // 9. HAPPY CHICKEN AEH SHPK
            'happy-chicken-aeh-shpk' => [
                'photos' => [
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Crispy Chicken krokant dhe ushqim i shpejtë i përgatitur në çast',
                        'is_primary' => true,
                    ],
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Burger i freskët me mish pule dhe patate të skuqura me erëza',
                        'is_primary' => false,
                    ],
                ],
                'menu' => [
                    ['menu_category' => 'Kombinimet Crispy', 'name' => 'Pakoja Crispy Strips (6 copë)', 'description' => 'Fileto pule krokante të shoqëruara me patate dhe salcë hudhre.', 'price' => 4.50, 'is_popular' => true],
                    ['menu_category' => 'Kombinimet Crispy', 'name' => 'Happy Chicken Burger Menu', 'description' => 'Burger me pulë krokante, sallatë kål, patate dhe pije 0.33l.', 'price' => 4.00, 'is_popular' => true],
                    ['menu_category' => 'Kombinimet Crispy', 'name' => 'Kova Familjare (12 Crispy Wings)', 'description' => 'Krahë pule pikantë me 2 porcione patate dhe 2 salca zgjedhjeje.', 'price' => 9.50, 'is_popular' => true],
                ],
            ],

            // 10. RESTAURANT HOME
            'restaurant-home' => [
                'photos' => [
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Ambienti komod si në shtëpi i Restaurant Home',
                        'is_primary' => true,
                    ],
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Pica italiane me brumë të hollë dhe djathë mocarela',
                        'is_primary' => false,
                    ],
                ],
                'menu' => [
                    ['menu_category' => 'Pica & Furrë', 'name' => 'Pica Home Speciale', 'description' => 'Salcë domate, mocarela, suxhuk vendor, kërpudha, proshutë dhe ullinj.', 'price' => 5.50, 'is_popular' => true],
                    ['menu_category' => 'Pica & Furrë', 'name' => 'Pica Margherita Tradicionale', 'description' => 'Salcë domate e freskët, borzilok dhe mocarela e vërtetë.', 'price' => 4.00, 'is_vegetarian' => true],
                    ['menu_category' => 'Pasta & Rizoto', 'name' => 'Tagliatelle me Pulë dhe Kërpudha në Salcë të Bardhë', 'description' => 'Makarona të freskëta me parmixhan të grirë sipër.', 'price' => 5.50, 'is_popular' => true],
                ],
            ],

            // 11. GREEN GARDEN
            'green-garden' => [
                'photos' => [
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Kopshti i gjelbëruar dhe terasa e jashtme e Green Garden',
                        'is_primary' => true,
                    ],
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Darka nën dritat e ngrohta të mbrëmjes me ushqime mesdhetare',
                        'is_primary' => false,
                    ],
                ],
                'menu' => [
                    ['menu_category' => 'Specialitete në Natyrë', 'name' => 'Pjatë e Përzier Mishi për 2 Persona', 'description' => 'Qebapa, pleskavicë me djathë, bërxollë dhe patate fshati.', 'price' => 14.00, 'is_popular' => true],
                    ['menu_category' => 'Specialitete në Natyrë', 'name' => 'Sallatë Mesdhetare Green Garden', 'description' => 'Rukolë, domate qershi, arra, djathë dhie dhe salcë balsamike.', 'price' => 4.50, 'is_vegetarian' => true],
                ],
            ],

            // 12. BLUECHIP INTERNATIONAL - Comodita Lipjan 1
            'comodita-lipjan-1' => [
                'photos' => [
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Salloni i ekspozimit të dyshekëve dhe kompleteve të dhomave të gjumit Comodita',
                        'is_primary' => true,
                    ],
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Jastëkë ortopedikë me shkumë memorie dhe aksesorë gjumi',
                        'is_primary' => false,
                    ],
                ],
            ],

            // 13. Auto Dardania
            'auto-dardania' => [
                'photos' => [
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Servisi i pajisur me ura ngritëse dhe diagnostikim kompjuterik të veturave',
                        'is_primary' => true,
                    ],
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Ndërrim vaji, filtra, frenim dhe kontroll teknik i rregullt',
                        'is_primary' => false,
                    ],
                ],
                'menu' => [
                    ['menu_category' => 'Shërbimet e Servisit & Çmimet', 'name' => 'Servisi i Vogël (Ndërrim Vaji & 4 Filtra)', 'description' => 'Vaj sintetik Castrol/Motul me filtra cilësorë gjermanë.', 'price' => 65.00, 'is_popular' => true],
                    ['menu_category' => 'Shërbimet e Servisit & Çmimet', 'name' => 'Diagnostikim Elektronik Kompjuterik', 'description' => 'Zbulim i shpejtë i të gjitha defekteve me tester profesional.', 'price' => 15.00, 'is_popular' => true],
                    ['menu_category' => 'Shërbimet e Servisit & Çmimet', 'name' => 'Mbushje & Servisim i Klimës së Automjetit', 'description' => 'Pastrim me gaz ekologjik R134a dhe dezinfektim me ozon.', 'price' => 25.00, 'is_popular' => false],
                ],
            ],

            // 14. LIRA JEWELRY
            'lira-jewelry' => [
                'photos' => [
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Koleksioni i unazave të fejesës dhe stolive me flori 14k dhe 18k',
                        'is_primary' => true,
                    ],
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Gjerdanë, vathë dhe varëse artizanale me punim preciz',
                        'is_primary' => false,
                    ],
                ],
            ],

            // 15. SuperViva 1
            'superviva-1' => [
                'photos' => [
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Market modern SuperViva 1 Lipjan – të gjitha produktet ushqimore të freskëta',
                        'is_primary' => true,
                    ],
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Zgjedhje e gjerë e produkteve për familjen dhe ofertat e javës',
                        'is_primary' => false,
                    ],
                ],
            ],

            // 16. BARNATORE SHENDETI & BARNATORE HANA
            'barnatore-shendeti' => [
                'photos' => [
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Barnatorja me gamë të plotë medikamentesh, suplementesh dhe dermokozmetikë',
                        'is_primary' => true,
                    ],
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Këshillim profesional farmaceutik për çdo recetë mjekësore',
                        'is_primary' => false,
                    ],
                ],
            ],

            // 17. 7 Vëllezerit Center
            '7-vellezerit-center' => [
                'photos' => [
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Qendra tregtare 7 Vëllezerit Center Lipjan me departamente të shumëfishta',
                        'is_primary' => true,
                    ],
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Artikuj shtëpiakë, pajisje elektroshtëpiake dhe vegla pune',
                        'is_primary' => false,
                    ],
                ],
            ],

            // 18. Elite Beauty Studio
            'elite-beauty-studio' => [
                'photos' => [
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Salloni estetik Elite Beauty Studio – grim profesional dhe thonj me xhel',
                        'is_primary' => true,
                    ],
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Kujdes i lëkurës me trajtime rigjeneruese të fytyrës dhe maska ushqyese',
                        'is_primary' => false,
                    ],
                ],
                'menu' => [
                    ['menu_category' => 'Shërbimet Estetike', 'name' => 'Grim Profesional Festiv (Makeup)', 'description' => 'Me produkte origjinale Huda Beauty, MAC dhe fiksim 24-orësh.', 'price' => 25.00, 'is_popular' => true],
                    ['menu_category' => 'Shërbimet Estetike', 'name' => 'Zgjatje & Dizajn Thonjsh me Xhel', 'description' => 'Formësim, kutikula dhe dizajn artistik i personalizuar.', 'price' => 15.00, 'is_popular' => true],
                    ['menu_category' => 'Shërbimet Estetike', 'name' => 'Trajtim i Thellë Fytyre HydraFacial', 'description' => 'Pastrim me vakum, hidratim intensiv dhe serum vitaminik.', 'price' => 35.00, 'is_popular' => true],
                ],
            ],

            // 19. Rent a Car Kaoni
            'rent-a-car-kaoni' => [
                'photos' => [
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Flota e veturave komode dhe ekonomike për qira ditore e mujore',
                        'is_primary' => true,
                    ],
                    [
                        'image_url' => 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
                        'caption' => 'Veturat tona dorëzohen të pastra, me sigurim të plotë Kasko dhe kilometra pa limit',
                        'is_primary' => false,
                    ],
                ],
                'menu' => [
                    ['menu_category' => 'Çmimet Ditore të Qirasë', 'name' => 'VW Golf 7 / 8 Automatik (Diesel)', 'description' => 'Konsum shumë ekonomik, komoditet maksimal dhe klimatizim.', 'price' => 30.00, 'is_popular' => true],
                    ['menu_category' => 'Çmimet Ditore të Qirasë', 'name' => 'Audi A4 / BMW Seria 3 (Premium)', 'description' => 'Luks dhe siguri për udhëtime biznesi dhe pushime familjare.', 'price' => 45.00, 'is_popular' => true],
                    ['menu_category' => 'Çmimet Ditore të Qirasë', 'name' => 'Renault Clio / VW Polo (Ekonomik)', 'description' => 'Ideale për qytet dhe parkim të lehtë.', 'price' => 22.00, 'is_popular' => false],
                ],
            ],
        ];

        foreach ($mediaData as $slug => $data) {
            $business = Business::where('slug', $slug)->first();
            if (! $business) {
                continue;
            }

            // Shto fotot nëse nuk ekzistojnë tashmë
            if (! empty($data['photos'])) {
                foreach ($data['photos'] as $idx => $photo) {
                    $exists = BusinessPhoto::where('business_id', $business->id)
                        ->where('image_url', $photo['image_url'])
                        ->exists();

                    if (! $exists) {
                        BusinessPhoto::create([
                            'business_id' => $business->id,
                            'image_url' => $photo['image_url'],
                            'caption' => $photo['caption'] ?? null,
                            'is_primary' => $photo['is_primary'] ?? ($idx === 0),
                            'sort_order' => $idx,
                        ]);
                    }
                }
            }

            // Shto artikujt e menysë nëse nuk ekzistojnë tashmë
            if (! empty($data['menu'])) {
                foreach ($data['menu'] as $idx => $item) {
                    $exists = BusinessMenuItem::where('business_id', $business->id)
                        ->where('name', $item['name'])
                        ->exists();

                    if (! $exists) {
                        BusinessMenuItem::create([
                            'business_id' => $business->id,
                            'menu_category' => $item['menu_category'] ?? 'Pjatat Kryesore',
                            'name' => $item['name'],
                            'description' => $item['description'] ?? null,
                            'price' => $item['price'] ?? 0.00,
                            'currency' => 'EUR',
                            'is_vegetarian' => $item['is_vegetarian'] ?? false,
                            'is_popular' => $item['is_popular'] ?? false,
                            'is_available' => true,
                            'sort_order' => $idx,
                        ]);
                    }
                }
            }
        }
    }
}
