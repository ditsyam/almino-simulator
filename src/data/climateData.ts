import { StageInfo } from '../types/climate';

export const EL_NINO_STAGES: StageInfo[] = [
  {
    id: 1,
    title: 'Melemahnya Angin Pasat (Trade Winds)',
    subtitle: 'Fase 1: Pemicu Utama Dinamika ENSO',
    tagline: 'Gaya dorong permukaan melemah, keseimbangan gradien tekanan kolaps',
    badge: 'Atmosfer & Angin',
    description:
      'Dalam kondisi normal, angin pasat tenggara/timur laut bertiup sangat kuat dari timur ke barat melintasi khatulistiwa Pasifik (dari pesisir Amerika Selatan menuju Indonesia dan Australia). Angin ini menyeret lapisan air permukaan hangat ke arah barat. Namun saat El Niño bermula, angin pasat melemah drastis atau bahkan mengalami pembalikan angin barat (Westerly Wind Bursts).',
    detailedPoints: [
      'Normal: Angin pasat kuat menggesek permukaan laut ke arah barat (Trade Winds 15-25 knot).',
      'El Niño: Tekanan udara di Pasifik barat meningkat sementara di Pasifik timur menurun (anomali SOI negatif).',
      'Pembalikan Angin Barat (Westerly Wind Bursts) terjadi di sekitar barat khatulistiwa, memotong suplai dorongan ke barat.',
      'Hilangnya gaya gesek angin menyebabkan air laut hangat tidak lagi tertahan di Pasifik barat.'
    ],
    keyParameters: {
      tradeWinds: 'Melemah / Berbalik Arah (Westerly Bursts)',
      warmPoolLocation: 'Mulai bergerak dari barat ke tengah Pasifik',
      thermoclineSlope: 'Gradien kemiringan mulai berkurang',
      upwellingStatus: 'Mulai terganggu di pesisir Peru',
      walkerConvection: 'Pusat konveksi bergeser ke arah timur',
      indonesiaRainfall: 'Curah hujan mulai menurun di bawah rata-rata',
      southAmericaWeather: 'Angin pantai melemah, suhu udara mulai menghangat'
    },
    recommendedSliderVal: 0.6
  },
  {
    id: 2,
    title: 'Migrasi Air Hangat ke Timur',
    subtitle: 'Fase 2: Aliran Gelombang Kelvin Bawah Laut',
    tagline: 'Air hangat dari Indonesia & Australia terlepas melintasi Samudra Pasifik',
    badge: 'Hidrologi & Arus Laut',
    description:
      'Karena angin pasat tidak lagi menahan massa air di barat, "Warm Pool" (kolam air laut hangat dengan suhu >28°C) yang biasanya mengumpul di dekat kepulauan Indonesia dan Papua Nugini mengalir kembali ke arah timur menuju pantai Ekuador dan Peru. Migrasi raksasa ini didorong oleh Gelombang Kelvin Equatorial (downwelling oceanic Kelvin waves) yang melintasi ribuan kilometer dalam hitungan bulan.',
    detailedPoints: [
      'Normal: Muka air laut di Indonesia sekitar 50 cm lebih tinggi daripada di Ekuador karena dorongan angin pasat.',
      'El Niño: Hilangnya penahan menyebabkan massa air hangat "tumpah" kembali ke timur (sloshing effect).',
      'Gelombang Kelvin internal menekan termoklin ke kedalaman yang jauh lebih dalam saat menjalar ke timur.',
      'Suhu permukaan laut di Pasifik tengah dan timur meningkat 1°C hingga lebih dari 3°C di atas rata-rata normal.'
    ],
    keyParameters: {
      tradeWinds: 'Sangat lemah di Pasifik tengah dan barat',
      warmPoolLocation: 'Berada di Pasifik Tengah hingga Timur (Bantalan Hangat)',
      thermoclineSlope: 'Mendatar, tidak lagi miring curam',
      upwellingStatus: 'Tertekan oleh lapisan air hangat tebal',
      walkerConvection: 'Berada di atas Pasifik Tengah / Garis Batas Penanggalan',
      indonesiaRainfall: 'Defisit hujan signifikan (awal kemarau panjang)',
      southAmericaWeather: 'Pesisir Peru & Ekuador mulai mendung tebal dan lembap'
    },
    recommendedSliderVal: 1.4
  },
  {
    id: 3,
    title: 'Terhambatnya Proses Upwelling',
    subtitle: 'Fase 3: Runtuhnya Nutrisi & Rantai Makanan Laut',
    tagline: 'Lapisan termoklin tenggelam, mengunci air dingin kaya nutrien di kedalaman',
    badge: 'Termoklin & Biologi Kelautan',
    description:
      'Akumulasi air hangat di Pasifik timur menumpuk tebal di permukaan laut Peru dan Kepulauan Galapagos. Kondisi ini menekan garis batas termoklin hingga kedalaman lebih dari 100-150 meter. Akibatnya, proses "upwelling" (naiknya air laut dalam yang dingin dan sarat nutrien seperti nitrat dan fosfat) menjadi terhambat total. Ekosistem plankton hancur, memicu kelaparan massal pada ikan teri (anchoveta) dan burung laut di Amerika Selatan.',
    detailedPoints: [
      'Normal: Angin pantai dan efek Coriolis mengangkat air dingin bersuhu 14-18°C sarat nutrisi ke permukaan (upwelling aktif).',
      'El Niño: Air permukaan hangat setebal puluhan meter membentuk selimut pembatas yang menghalangi air dingin di bawahnya.',
      'Ketiadaan nutrisi mematikan fitoplankton, memicu penurunan drastis tangkapan ikan nelayan Peru (asal mula nama El Niño / Sang Bayi Yesus oleh nelayan setempat saat Natal).',
      'Gradien suhu barat-timur yang biasanya kontras di Samudra Pasifik menjadi hampir rata atau terbalik.'
    ],
    keyParameters: {
      tradeWinds: 'Melemah total di Pasifik timur',
      warmPoolLocation: 'Menumpuk di pesisir Peru, Ekuador, dan Pasifik Timur',
      thermoclineSlope: 'Sangat dalam di Pasifik timur (100-150m)',
      upwellingStatus: 'TERHAMBAT TOTAL (Upwelling lumpuh)',
      walkerConvection: 'Sangat aktif di Pasifik timur',
      indonesiaRainfall: 'Kekeringan parah, risiko kebakaran hutan tinggi',
      southAmericaWeather: 'Suhu laut sangat hangat, curah hujan ekstrem'
    },
    recommendedSliderVal: 2.0
  },
  {
    id: 4,
    title: 'Pergeseran Sirkulasi Walker',
    subtitle: 'Fase 4: Anomali Atmosfer & Cuaca Global',
    tagline: 'Pusat konveksi awan hujan kumulonimbus berpindah ribuan kilometer',
    badge: 'Sirkulasi Global & Iklim',
    description:
      'Perubahan suhu permukaan laut yang masif merombak total pola tekanan atmosfer dan Sirkulasi Walker. Pusat tekanan rendah dan penguapan air laut yang biasanya berpusat di benua maritim Indonesia kini bergeser jauh ke Pasifik tengah dan timur. Akibatnya, Indonesia dinaungi oleh massa udara kering yang turun (subsidence), sementara Pasifik timur dihujani badai tropis dahsyat.',
    detailedPoints: [
      'Normal: Udara naik (konveksi hangat) terjadi di Indonesia membawa monsun basah, lalu mengalir di atmosfer atas ke timur dan turun sebagai udara kering di Pasifik timur.',
      'El Niño: Sel sirkulasi terbelah atau bergeser. Udara turun (subsiden) menekan pembentukan awan di atas Indonesia, memicu kekeringan ekstrem.',
      'Udara naik berpindah ke Samudra Pasifik tengah dan timur, melahirkan awan kumulonimbus raksasa dan badai destruktif.',
      'Dampak telekoneksi merambat global: gelombang panas di Asia Tenggara, kekeringan di Australia bagian timur, serta badai musim dingin di Amerika Utara.'
    ],
    keyParameters: {
      tradeWinds: 'Terkadang berbalik total dari barat ke timur',
      warmPoolLocation: 'Pasifik Tengah & Timur (Anomaly > +2.0°C)',
      thermoclineSlope: 'Datar / Kedalaman terbalik',
      upwellingStatus: 'Lumpuh total di pesisir Pasifik timur',
      walkerConvection: 'Pusat hujan berada di Pasifik Timur / Amerika Selatan',
      indonesiaRainfall: 'Kemarau ekstrem, kekeringan waduk, krisis pangan',
      southAmericaWeather: 'Banjir bandang masif, longsor, badai tropis'
    },
    recommendedSliderVal: 2.2
  }
];

export const PRESET_IMAGES = [
  {
    id: 'sst-anomaly',
    title: 'Satelit Anomali Suhu Muka Laut (SSTA)',
    subtitle: 'Lidah hangat El Niño menjalar di ekuator Pasifik',
    category: 'satellite' as const,
    aspectRatio: '16:9' as const,
    defaultPrompt: 'Cinematic satellite view of ocean temperature thermal map across the equatorial Pacific, glowing warm red thermal tongue surging eastward towards South America, subtle dynamic ocean currents and atmospheric clouds moving fluidly, 4k ultra realistic scientific visualization',
    description: 'Visualisasi anomali suhu muka laut satelit NOAA yang memperlihatkan lidah hangat melintas dari Pasifik Barat ke pantai Peru.'
  },
  {
    id: 'walker-clouds',
    title: 'Awan Konveksi Sirkulasi Walker',
    subtitle: 'Awan kumulonimbus badai di Pasifik Tengah',
    category: 'atmosphere' as const,
    aspectRatio: '16:9' as const,
    defaultPrompt: 'Epic time-lapse of massive cumulonimbus storm clouds forming over the warm tropical Pacific ocean, dramatic golden hour lightning flashes and rolling thunderclouds with ocean waves churning beneath, cinematic atmospheric dynamics',
    description: 'Pergeseran pusat konveksi Sirkulasi Walker melahirkan badai petir dan awan hujan masif di Pasifik tengah.'
  },
  {
    id: 'peru-upwelling',
    title: 'Upwelling & Perairan Pesisir Peru',
    subtitle: 'Dinamika perairan dingin vs penumpukan air hangat',
    category: 'ocean' as const,
    aspectRatio: '9:16' as const,
    defaultPrompt: 'Deep ocean cross-section showing cold blue nutrient currents battling against a thick warm red surface water cap, glowing plankton bioluminescence in underwater ocean current, vertical camera pan cinematic photorealistic',
    description: 'Pemandangan vertikal air laut dingin yang tertekan oleh lapisan air hangat permukaan di lepas pantai Pasifik.'
  },
  {
    id: 'indonesia-drought',
    title: 'Lanskap Kemarau Ekstrem Indonesia',
    subtitle: 'Dampak penurunan curah hujan akibat subsiden udara',
    category: 'impact' as const,
    aspectRatio: '16:9' as const,
    defaultPrompt: 'Aerial drone shot over dry parched tropical soil and cracked riverbed under intense golden sun haze, dust blowing across arid landscape with distant withered palm trees, cinematic drought documentary photography',
    description: 'Dampak nyata El Niño di Indonesia: penurunan debit air dan kemarau berkepanjangan pada sektor agrikultur.'
  }
];

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'Arah tiupan angin pasat (Trade Winds) dalam kondisi normal di Samudra Pasifik adalah...',
    options: [
      'Dari Barat ke Timur (dari Indonesia menuju Amerika Selatan)',
      'Dari Timur ke Barat (dari Amerika Selatan menuju Indonesia/Australia)',
      'Dari Utara ke Selatan melintasi ekuator',
      'Berputar melingkar searah jarum jam di Pasifik tengah'
    ],
    correctAnswer: 1,
    explanation: 'Dalam kondisi normal, angin pasat bertiup kencang dari timur ke barat (dari pantai Amerika Selatan menuju Asia/Australia), menumpuk air hangat di Pasifik barat.'
  },
  {
    id: 2,
    question: 'Apa yang terjadi pada "Warm Pool" (kolam air hangat) saat El Niño berlangsung?',
    options: [
      'Tenggelam ke palung samudra yang dalam',
      'Menguap sepenuhnya ke lapisan stratosfer',
      'Bermigrasi kembali ke arah timur menuju pesisir Peru dan Ekuador',
      'Membeku menjadi es laut di dekat Papua'
    ],
    correctAnswer: 2,
    explanation: 'Karena angin pasat melemah, air hangat yang biasanya terkumpul di dekat Indonesia dan Australia bermigrasi kembali ke timur menuju Amerika Selatan.'
  },
  {
    id: 3,
    question: 'Mengapa proses upwelling di pesisir Peru terhambat saat El Niño?',
    options: [
      'Karena angin pasat bertiup terlalu kencang',
      'Karena penumpukan air hangat di permukaan menekan termoklin ke kedalaman dan menghalangi naiknya air dingin kaya nutrien',
      'Karena air laut di dasar samudra habis tersedot ke daratan',
      'Karena suhu udara di kutub mendinginkan seluruh samudra'
    ],
    correctAnswer: 1,
    explanation: 'Akumulasi air hangat di Pasifik timur menumpuk tebal di permukaan dan menekan batas termoklin ke bawah, mengunci air dingin sarat nutrisi di kedalaman.'
  },
  {
    id: 4,
    question: 'Pergeseran Sirkulasi Walker menyebabkan dampak langsung terhadap cuaca di Indonesia berupa...',
    options: [
      'Hujan salju lebat di pegunungan Jawa',
      'Banjir bandang dan badai siklon setiap hari',
      'Kemarau panjang, kekeringan, dan penurunan drastis curah hujan karena massa udara turun (subsiden)',
      'Tidak ada pengaruh sama sekali pada musim hujan'
    ],
    correctAnswer: 2,
    explanation: 'Pusat konveksi pembentukan awan hujan bergeser dari Indonesia ke Pasifik tengah/timur, membuat Indonesia diliputi subsiden udara kering yang memicu kemarau ekstrem.'
  }
];
