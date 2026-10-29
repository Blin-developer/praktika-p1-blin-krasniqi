<?php

namespace Database\Seeders;

use App\Models\Business;
use App\Models\Settlement;
use Illuminate\Database\Seeder;

class UpdateBusinessLocationsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $lipjanQenderId = Settlement::where('slug', 'lipjan-qender')->value('id') ?? 1;

        // Përditësimi i saktë i të gjitha bizneseve me koordinata reale në territorin e Lipjanit
        $locationUpdates = [
            // Bizneset që kishin NULL koordinata:
            'ntp-sprint' => [
                'latitude' => 42.52180000,
                'longitude' => 21.12720000,
                'address' => 'Rruga Fehmi Lladrovci, Lipjan',
                'settlement_id' => $lipjanQenderId,
            ],
            'dpz-pasticeria-palma' => [
                'latitude' => 42.51886000,
                'longitude' => 21.12259000,
                'address' => 'Rruga Lidhja e Prizrenit, Lipjan',
                'settlement_id' => $lipjanQenderId,
            ],
            'fess-tech-shpk' => [
                'latitude' => 42.53620000,
                'longitude' => 21.01180000,
                'address' => 'Rruga Kryesore, Magure',
            ],
            'vfs-14-lipjan' => [
                'latitude' => 42.52310000,
                'longitude' => 21.12470000,
                'address' => 'Rruga Komandant Kumanova, Lipjan',
                'settlement_id' => $lipjanQenderId,
            ],
            'fresh-market-lipjani' => [
                'latitude' => 42.52210000,
                'longitude' => 21.22110000,
                'address' => 'Rruga e Re, Sllovi',
            ],
            'family-dent' => [
                'latitude' => 42.52080000,
                'longitude' => 21.12360000,
                'address' => 'Rruga Dëshmorët e Kombit, Lipjan',
                'settlement_id' => $lipjanQenderId,
            ],
            'klima-term' => [
                'latitude' => 42.52165000,
                'longitude' => 21.12080000,
                'address' => 'Rruga Isa Boletini, Lipjan',
                'settlement_id' => $lipjanQenderId,
            ],
            'lumi-construction' => [
                'latitude' => 42.52280000,
                'longitude' => 21.08150000,
                'address' => 'Zona Industriale, Rufc i Ri',
            ],
            'smart-computer' => [
                'latitude' => 42.58240000,
                'longitude' => 21.25520000,
                'address' => 'Çarshia e Vjetër, Janjevë',
            ],

            // Korrigjimi i bizneseve që kishin koordinata të pasakta:
            // Argjend Barbershop ndodhet në Rr. Isa Boletini në qendër të Lipjanit (jo në Rufc!)
            'argjend-barbershop' => [
                'latitude' => 42.52150000,
                'longitude' => 21.12060000,
                'address' => 'Rruga Isa Boletini, Lipjan',
                'settlement_id' => $lipjanQenderId,
            ],
            // TechVision Kosova po ashtu ndodhet në Rr. Isa Boletini në qendër të Lipjanit
            'techvision-kosova' => [
                'latitude' => 42.52135000,
                'longitude' => 21.12030000,
                'address' => 'Rruga Isa Boletini, Lipjan',
                'settlement_id' => $lipjanQenderId,
            ],
            // 7 Vëllezerit Center ndodhet në Haradin Bajrami (Lipjan Qendër)
            '7-vellezerit-center' => [
                'latitude' => 42.51917000,
                'longitude' => 21.12191000,
                'address' => 'Rruga Haradin Bajrami nr. 8, Lipjan',
                'settlement_id' => $lipjanQenderId,
            ],
        ];

        foreach ($locationUpdates as $slug => $data) {
            $biz = Business::where('slug', $slug)->first();
            if ($biz) {
                $biz->update($data);
            }
        }
    }
}
