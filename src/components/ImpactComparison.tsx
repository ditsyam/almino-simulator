import React from 'react';
import {
  Flame,
  Droplets,
  Fish,
  Wheat,
  Globe2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  CloudLightning
} from 'lucide-react';

export const ImpactComparison: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="p-6 sm:p-8 bg-slate-950/80 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Dampak Global & Sosio-Ekonomi
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Globe2 className="w-5 h-5 text-cyan-400" />
          Perbandingan Dampak El Niño: Indonesia vs Amerika Selatan
        </h3>
        <p className="text-slate-400 text-sm mt-1">
          Dua sisi mata uang dari pergeseran Sirkulasi Walker dan runtuhnya gradien suhu Pasifik.
        </p>
      </div>

      <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Indonesia & Asia Tenggara Card */}
        <div className="bg-slate-950/60 rounded-2xl p-5 border border-rose-500/20 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2 font-bold text-slate-100 text-base">
                <Flame className="w-5 h-5 text-rose-500" />
                Indonesia & Benua Maritim
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500/20 text-rose-400">
                Kekeringan Ekstrem
              </span>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="font-bold text-rose-400 flex items-center gap-1.5 mb-1">
                  <TrendingDown className="w-4 h-4" />
                  Kemarau Panjang & Defisit Air
                </div>
                Penurunan drastis curah hujan karena massa udara kering yang turun (subsiden) menekan pembentukan awan hujan monsun.
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="font-bold text-amber-400 flex items-center gap-1.5 mb-1">
                  <Flame className="w-4 h-4" />
                  Kebakaran Hutan & Lahan (Karhutla)
                </div>
                Hutan gambut di Sumatera dan Kalimantan menjadi sangat kering dan rentan terbakar, menghasilkan bencana kabut asap lintas batas (transboundary haze).
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
                  <Wheat className="w-4 h-4" />
                  Gagal Panen Padi & Krisis Pangan
                </div>
                Waduk-waduk irigasi menyusut, memicu keterlambatan musim tanam padi dan potensi lonjakan harga beras nasional.
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-mono pt-3 border-t border-slate-850">
            Kondisi: Tekanan atmosfer tinggi (anomali SOI negatif)
          </div>
        </div>

        {/* Amerika Selatan (Peru & Ekuador) Card */}
        <div className="bg-slate-950/60 rounded-2xl p-5 border border-sky-500/20 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2 font-bold text-slate-100 text-base">
                <CloudLightning className="w-5 h-5 text-sky-400" />
                Amerika Selatan (Peru/Ekuador)
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-sky-500/20 text-sky-400">
                Banjir Bandang & Anomali Laut
              </span>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="font-bold text-sky-400 flex items-center gap-1.5 mb-1">
                  <Droplets className="w-4 h-4" />
                  Curah Hujan Ekstrem & Banjir
                </div>
                Pesisir gurun Peru yang biasanya sangat kering berubah menjadi zona banjir bandang dan tanah longsor mematikan akibat penguapan masif air laut hangat.
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="font-bold text-rose-400 flex items-center gap-1.5 mb-1">
                  <Fish className="w-4 h-4" />
                  Runtuhnya Industri Ikan Teri (Anchoveta)
                </div>
                Karena upwelling terhambat oleh air hangat, fitoplankton mati. Jutaan ton ikan teri bermigrasi ke selatan atau mati kelaparan, menghancurkan ekonomi nelayan Peru.
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="font-bold text-purple-400 flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  Wabah Penyakit Pascabanjir
                </div>
                Genangan air hangat dan sanitasi rusak memicu lonjakan nyamuk demam berdarah dan malaria di pesisir Pasifik timur.
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-mono pt-3 border-t border-slate-850">
            Kondisi: Tekanan atmosfer rendah, konveksi masif
          </div>
        </div>

        {/* Global Teleconnections Card */}
        <div className="bg-slate-950/60 rounded-2xl p-5 border border-purple-500/20 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2 font-bold text-slate-100 text-base">
                <Globe2 className="w-5 h-5 text-purple-400" />
                Telekoneksi Iklim Global
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-500/20 text-purple-400">
                Dampak Seluruh Bumi
              </span>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="font-bold text-amber-400 flex items-center gap-1.5 mb-1">
                  <TrendingUp className="w-4 h-4" />
                  Lonjakan Rekor Suhu Rata-rata Bumi
                </div>
                Pelepasan panas samudra raksasa ke atmosfer membuat tahun-tahun El Niño hampir selalu mencetak rekor tahun terpanas dalam sejarah manusia.
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="font-bold text-indigo-400 flex items-center gap-1.5 mb-1">
                  <CloudLightning className="w-4 h-4" />
                  Pergeseran Jalur Siklon Tropis
                </div>
                Aktivitas badai taifun bergeser lebih jauh ke timur di Pasifik, sementara aktivitas badai badai Atlantik justru cenderung ditekan oleh shear angin tinggi.
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="font-bold text-cyan-400 flex items-center gap-1.5 mb-1">
                  <Wheat className="w-4 h-4" />
                  Inflasi Komoditas Pangan Global
                </div>
                Kekeringan di Australia, Indonesia, dan Afrika Selatan memicu krisis gandum, kelapa sawit, gula, dan kopi di pasar internasional.
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-mono pt-3 border-t border-slate-850">
            Pengaruh: ENSO merupakan pengatur iklim tahunan terkuat di planet bumi
          </div>
        </div>
      </div>
    </div>
  );
};
