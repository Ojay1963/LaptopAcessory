const productTones = ['#111111', '#404040', '#707070', '#9a9a9a']
const accentTones = ['#d43f2f', '#0f766e', '#1d4ed8', '#ca8a04', '#9333ea']

const pickTone = (name, index) => {
  const seed = `${name}${index}`.split('').reduce((total, char) => total + char.charCodeAt(0), 0)
  return productTones[seed % productTones.length]
}

const pickAccent = (name, index) => {
  const seed = `${index}${name}`.split('').reduce((total, char) => total + char.charCodeAt(0) * 3, 0)
  return accentTones[seed % accentTones.length]
}

const cleanLabel = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const buildCatalogSvg = (name, category, tone, accent, shape, meta = '') =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#f7f7f7"/>
        </linearGradient>
      </defs>
      <rect width="900" height="900" fill="#ffffff"/>
      <rect x="40" y="40" width="820" height="820" rx="28" fill="url(#bg)" stroke="#efefef" stroke-width="2"/>
      <rect x="96" y="108" width="152" height="34" rx="17" fill="${accent}" fill-opacity="0.12"/>
      <text x="172" y="130" text-anchor="middle" fill="${accent}" font-family="Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="2">${cleanLabel(category.toUpperCase())}</text>
      <g fill="${tone}">
        ${shape}
      </g>
      <text x="450" y="734" text-anchor="middle" fill="#171717" font-family="Arial, sans-serif" font-size="30" font-weight="700">${cleanLabel(name.slice(0, 34))}</text>
      <text x="450" y="782" text-anchor="middle" fill="#6d6d6d" font-family="Arial, sans-serif" font-size="24" letter-spacing="1">${cleanLabel(meta.slice(0, 40))}</text>
    </svg>`
  )

const laptopShape = `
  <rect x="220" y="230" width="460" height="270" rx="18"/>
  <rect x="250" y="260" width="400" height="210" rx="10" fill="#ffffff"/>
  <path d="M180 555h540l-44 56H224z"/>
`

const convertibleLaptopShape = `
  <rect x="290" y="208" width="320" height="432" rx="28"/>
  <rect x="325" y="250" width="250" height="310" rx="14" fill="#ffffff"/>
  <rect x="360" y="160" width="180" height="28" rx="14"/>
  <path d="M260 622c50 26 126 42 190 42s140-16 190-42l18 36c-56 34-136 52-208 52s-152-18-208-52z"/>
`

const gamingLaptopShape = `
  <rect x="214" y="220" width="472" height="286" rx="20"/>
  <rect x="252" y="258" width="396" height="210" rx="12" fill="#ffffff"/>
  <path d="M176 560h548l-52 62H228z"/>
  <path d="M398 340l34 62h-42l24 46 88-94h-50l32-50z" fill="${'#ffffff'}"/>
`

const businessLaptopShape = `
  <rect x="224" y="236" width="452" height="260" rx="18"/>
  <rect x="256" y="268" width="388" height="196" rx="10" fill="#ffffff"/>
  <circle cx="610" cy="366" r="10" fill="#d8d8d8"/>
  <path d="M188 548h524l-36 48H224z"/>
`

const batteryShape = `
  <rect x="285" y="255" width="330" height="380" rx="34"/>
  <rect x="395" y="220" width="110" height="34" rx="10"/>
  <rect x="360" y="320" width="180" height="26" rx="10" fill="#ffffff"/>
`

const mouseShape = `
  <path d="M450 235c95 0 160 82 160 192v78c0 120-71 190-160 190s-160-70-160-190v-78c0-110 65-192 160-192z"/>
  <rect x="430" y="255" width="40" height="96" rx="18" fill="#ffffff"/>
`

const keyboardShape = `
  <rect x="180" y="330" width="540" height="220" rx="26"/>
  <g fill="#ffffff">
    <rect x="220" y="370" width="70" height="30" rx="6"/>
    <rect x="305" y="370" width="70" height="30" rx="6"/>
    <rect x="390" y="370" width="70" height="30" rx="6"/>
    <rect x="475" y="370" width="70" height="30" rx="6"/>
    <rect x="560" y="370" width="70" height="30" rx="6"/>
    <rect x="220" y="415" width="70" height="30" rx="6"/>
    <rect x="305" y="415" width="70" height="30" rx="6"/>
    <rect x="390" y="415" width="70" height="30" rx="6"/>
    <rect x="475" y="415" width="70" height="30" rx="6"/>
    <rect x="560" y="415" width="70" height="30" rx="6"/>
    <rect x="260" y="470" width="380" height="32" rx="8"/>
  </g>
`

const headsetShape = `
  <path d="M270 470v-72c0-110 72-188 180-188s180 78 180 188v72h-52v-70c0-77-48-132-128-132s-128 55-128 132v70z"/>
  <rect x="250" y="470" width="70" height="150" rx="28"/>
  <rect x="580" y="470" width="70" height="150" rx="28"/>
`

const earbudsShape = `
  <rect x="292" y="334" width="316" height="178" rx="56"/>
  <circle cx="378" cy="422" r="46" fill="#ffffff"/>
  <circle cx="522" cy="422" r="46" fill="#ffffff"/>
  <path d="M334 548c26 68 64 108 116 108s90-40 116-108h-52c-18 38-36 60-64 60s-46-22-64-60z"/>
`

const webcamShape = `
  <rect x="252" y="292" width="396" height="224" rx="50"/>
  <circle cx="450" cy="404" r="68" fill="#ffffff"/>
  <circle cx="450" cy="404" r="30"/>
  <path d="M324 566h252l48 56H276z"/>
`

const powerBankShape = `
  <rect x="312" y="236" width="276" height="428" rx="38"/>
  <rect x="392" y="206" width="116" height="28" rx="14"/>
  <rect x="350" y="320" width="200" height="26" rx="10" fill="#ffffff"/>
  <rect x="350" y="374" width="146" height="26" rx="10" fill="#ffffff"/>
`

const wallChargerShape = `
  <rect x="318" y="254" width="264" height="250" rx="28"/>
  <rect x="396" y="198" width="18" height="80"/>
  <rect x="486" y="198" width="18" height="80"/>
  <path d="M360 548h180l46 104H314z"/>
`

const dockShape = `
  <rect x="236" y="370" width="428" height="154" rx="30"/>
  <rect x="276" y="416" width="34" height="18" rx="5" fill="#ffffff"/>
  <rect x="324" y="416" width="34" height="18" rx="5" fill="#ffffff"/>
  <rect x="372" y="416" width="34" height="18" rx="5" fill="#ffffff"/>
  <rect x="420" y="416" width="94" height="18" rx="5" fill="#ffffff"/>
  <path d="M664 432h84v30h-84z"/>
`

const chargerShape = `
  <rect x="290" y="260" width="320" height="260" rx="24"/>
  <rect x="370" y="220" width="26" height="60"/>
  <rect x="504" y="220" width="26" height="60"/>
  <path d="M610 480c80 40 110 95 110 145 0 68-46 118-118 118h-32v-44h28c46 0 76-30 76-74 0-30-16-62-76-97z"/>
`

const bagShape = `
  <rect x="260" y="290" width="380" height="360" rx="32"/>
  <path d="M335 300c0-68 48-116 115-116s115 48 115 116h-48c0-38-28-68-67-68s-67 30-67 68z"/>
  <rect x="340" y="420" width="220" height="28" rx="12" fill="#ffffff"/>
`

const adapterShape = `
  <rect x="300" y="320" width="300" height="170" rx="22"/>
  <rect x="560" y="360" width="96" height="26" rx="8"/>
  <rect x="560" y="414" width="96" height="26" rx="8"/>
  <path d="M244 406h56v14h-56c-34 0-56 18-82 52l-34-22c34-50 72-44 116-44z"/>
`

const printerShape = `
  <rect x="220" y="360" width="460" height="210" rx="20"/>
  <rect x="300" y="250" width="300" height="120" rx="16"/>
  <rect x="320" y="520" width="260" height="110" rx="14" fill="#ffffff"/>
`

const driveShape = `
  <rect x="250" y="340" width="400" height="210" rx="34"/>
  <circle cx="586" cy="446" r="18" fill="#ffffff"/>
`

const hasAny = (value, list) => list.some((item) => value.includes(item))

export const fallbackImage =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900">
      <rect width="100%" height="100%" fill="#ffffff"/>
      <rect x="40" y="40" width="820" height="820" fill="#ffffff" stroke="#efefef" stroke-width="2"/>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="#999999" font-family="Arial, sans-serif" font-size="34" font-weight="700">
        Image Unavailable
      </text>
    </svg>`
  )

const laptopSpecSets = [
  { cpu: 'Apple M3 Pro', memory: '16GB', storage: '512GB SSD', display: '14" Retina', battery: 'Up to 18 hours' },
  { cpu: 'Intel Core i7', memory: '16GB', storage: '1TB SSD', display: '13.5" Touch', battery: 'Up to 15 hours' },
  { cpu: 'AMD Ryzen 7', memory: '32GB', storage: '1TB SSD', display: '16" QHD', battery: 'Up to 12 hours' },
  { cpu: 'Intel Core i5', memory: '16GB', storage: '512GB SSD', display: '14" IPS', battery: 'Up to 13 hours' },
  { cpu: 'Intel Core i9', memory: '32GB', storage: '2TB SSD', display: '16" OLED', battery: 'Up to 10 hours' },
]

const accessorySpecSets = [
  { connectivity: 'Bluetooth 5.3', warranty: '12 months', weight: '240g', compatibility: 'Windows, macOS, iOS, Android' },
  { connectivity: 'USB-C', warranty: '18 months', weight: '180g', compatibility: 'Windows, macOS, ChromeOS' },
  { connectivity: 'Wireless 2.4GHz', warranty: '12 months', weight: '95g', compatibility: 'Windows, macOS' },
  { connectivity: 'USB-A', warranty: '24 months', weight: '320g', compatibility: 'Universal' },
]

const buildLaptopSpecs = (index) => {
  const spec = laptopSpecSets[index % laptopSpecSets.length]
  return [
    { label: 'Processor', value: spec.cpu },
    { label: 'Memory', value: spec.memory },
    { label: 'Storage', value: spec.storage },
    { label: 'Display', value: spec.display },
    { label: 'Battery', value: spec.battery },
  ]
}

const buildAccessorySpecs = (index) => {
  const spec = accessorySpecSets[index % accessorySpecSets.length]
  return [
    { label: 'Connectivity', value: spec.connectivity },
    { label: 'Compatibility', value: spec.compatibility },
    { label: 'Warranty', value: spec.warranty },
    { label: 'Weight', value: spec.weight },
    { label: 'Included', value: 'Quick-start guide, support' },
  ]
}

const buildProductPlaceholder = (name, category) => {
  const label = category ? `${name} - ${category}` : name
  return (
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="675">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#1a1f2f"/>
            <stop offset="100%" stop-color="#30384d"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#g)"/>
        <rect x="70" y="70" width="760" height="535" rx="24" fill="none" stroke="#ffffff" stroke-opacity="0.18" stroke-width="3"/>
        <text x="50%" y="46%" text-anchor="middle" dominant-baseline="middle" fill="#f4c073" font-family="Arial, sans-serif" font-size="32" font-weight="700">
          ${label}
        </text>
        <text x="50%" y="56%" text-anchor="middle" dominant-baseline="middle" fill="#cbd1e7" font-family="Arial, sans-serif" font-size="18">
          Image unavailable
        </text>
      </svg>`
    )
  )
}

const resolveLaptopImage = (item, index) => {
  const lower = item.name.toLowerCase()
  const tone = pickTone(item.name, index)
  const accent = pickAccent(item.name, index)
  const meta = item.features?.join(' | ') || 'Premium Laptop'

  if (hasAny(lower, ['x360', 'yoga', '2-in-1', 'convertible'])) {
    return buildCatalogSvg(item.name, 'Laptop', tone, accent, convertibleLaptopShape, meta)
  }

  if (hasAny(lower, ['rog', 'gaming', 'predator', 'nitro', 'raider', 'alienware', 'legion', 'omen', 'tuf', 'blade'])) {
    return buildCatalogSvg(item.name, 'Laptop', tone, accent, gamingLaptopShape, meta)
  }

  if (hasAny(lower, ['thinkpad', 'latitude', 'librem', 'lemur', 'infinitybook'])) {
    return buildCatalogSvg(item.name, 'Laptop', tone, accent, businessLaptopShape, meta)
  }

  return buildCatalogSvg(item.name, 'Laptop', tone, accent, laptopShape, meta)
}

const resolveAccessoryImage = (item, index) => {
  const lower = item.name.toLowerCase()
  const tone = pickTone(item.name, index)
  const accent = pickAccent(item.name, index)
  const meta = item.features?.join(' | ') || 'Reliable Accessory'

  if (hasAny(lower, ['earbuds', 'airpods', 'buds'])) {
    return buildCatalogSvg(item.name, 'Accessory', tone, accent, earbudsShape, meta)
  }
  if (hasAny(lower, ['headset', 'headphone', 'wh-', 'quantum', 'hd ', 'ath-', 'mdr-', 'around-ear', 't450bt', 'cloud'])) {
    return buildCatalogSvg(item.name, 'Accessory', tone, accent, headsetShape, meta)
  }
  if (hasAny(lower, ['mouse', 'mx master', 'basilisk', 'm185', 'optical'])) {
    return buildCatalogSvg(item.name, 'Accessory', tone, accent, mouseShape, meta)
  }
  if (hasAny(lower, ['webcam', 'c920', 'kiyo'])) {
    return buildCatalogSvg(item.name, 'Accessory', tone, accent, webcamShape, meta)
  }
  if (hasAny(lower, ['wall charger', 'power adapter'])) {
    return buildCatalogSvg(item.name, 'Accessory', tone, accent, wallChargerShape, meta)
  }
  if (hasAny(lower, ['charger', 'gan', 'powerport'])) {
    return buildCatalogSvg(item.name, 'Accessory', tone, accent, chargerShape, meta)
  }
  if (hasAny(lower, ['power bank', 'powercore', 'sense', 'portable charger'])) {
    return buildCatalogSvg(item.name, 'Accessory', tone, accent, powerBankShape, meta)
  }
  if (lower.includes('battery')) {
    return buildCatalogSvg(item.name, 'Accessory', tone, accent, batteryShape, meta)
  }
  if (hasAny(lower, ['keyboard', 'keychron', 'alloy', 'km117'])) {
    return buildCatalogSvg(item.name, 'Accessory', tone, accent, keyboardShape, meta)
  }
  if (hasAny(lower, ['backpack', 'bag'])) {
    return buildCatalogSvg(item.name, 'Accessory', tone, accent, bagShape, meta)
  }
  if (lower.includes('printer')) {
    return buildCatalogSvg(item.name, 'Accessory', tone, accent, printerShape, meta)
  }
  if (hasAny(lower, ['ssd', 'drive', 'portable'])) {
    return buildCatalogSvg(item.name, 'Accessory', tone, accent, driveShape, meta)
  }
  if (
    hasAny(lower, ['hub', 'dock', 'adapter', 'cable', 'hdmi'])
  ) {
    const shape = hasAny(lower, ['hub', 'dock']) ? dockShape : adapterShape
    return buildCatalogSvg(item.name, 'Accessory', tone, accent, shape, meta)
  }
  return buildCatalogSvg(item.name, 'Accessory', tone, accent, chargerShape, meta)
}

const buildRating = (index) => {
  const rating = 4.1 + (index % 9) * 0.1
  return Number(Math.min(4.9, rating).toFixed(1))
}

const buildReviewCount = (index) => 40 + ((index * 7) % 180)

const buildStock = (index) => {
  const seed = (index * 7) % 11
  if (seed === 0) return 0
  if (seed < 3) return 4 + seed
  return 12 + seed * 3
}

const baseLaptops = [
  {
    id: 'cv-l-01',
    name: 'Dell Inspiron 3520 12th Gen Core i3 8GB 256GB SSD',
    price: 560000,
    features: ['12th Gen Core i3', '8GB RAM'],
    desc: 'Entry-level Dell laptop from the Computer Village catalog with fast SSD storage and a practical everyday configuration.',
  },
  {
    id: 'cv-l-02',
    name: 'Dell Latitude 7340',
    price: 1155000,
    features: ['Business Laptop', 'Premium Build'],
    desc: 'Business-focused Dell Latitude designed for office productivity, meetings, and travel-friendly work.',
  },
  {
    id: 'cv-l-03',
    name: 'HP EliteBook 640 G11 Ultra 5 125H',
    price: 1400000,
    features: ['EliteBook', 'Ultra 5 125H'],
    desc: 'Corporate-class HP EliteBook with a newer Intel platform aimed at performance, security, and long work sessions.',
  },
  {
    id: 'cv-l-04',
    name: 'HP Laptop 15 Core i5 13th Gen',
    price: 780000,
    features: ['13th Gen Core i5', '15-inch'],
    desc: 'Mainstream HP 15-inch laptop for students, home use, and everyday business tasks.',
  },
  {
    id: 'cv-l-05',
    name: 'HP Pavilion x360 14-ek1008nia Core i5-1335U',
    price: 999000,
    features: ['x360 Convertible', 'Core i5-1335U'],
    desc: 'Convertible HP Pavilion with a flexible hinge for work, streaming, note-taking, and casual creative use.',
  },
  {
    id: 'cv-l-06',
    name: 'HP Pavilion 15-eg3148nia Core i5-1335U',
    price: 980000,
    features: ['Core i5-1335U', 'Pavilion Series'],
    desc: 'Balanced Pavilion 15 configuration with modern Intel performance for office work and multitasking.',
  },
  {
    id: 'cv-l-07',
    name: 'HP 15-FD0095 Core i5-1235U',
    price: 651000,
    features: ['Core i5-1235U', '15-inch'],
    desc: 'Well-priced HP 15 model with solid everyday performance and a practical full-size layout.',
  },
  {
    id: 'cv-l-08',
    name: 'HP 15-FD0131 Core i3 N305',
    price: 560000,
    features: ['Core i3 N305', 'Value Laptop'],
    desc: 'Affordable HP notebook suited for browsing, documents, schoolwork, and light daily use.',
  },
  {
    id: 'cv-l-09',
    name: 'HP Victus 15-fa0033 Core i5-12450H RTX 3050',
    price: 1089000,
    features: ['RTX 3050', 'Gaming Ready'],
    desc: 'Gaming-oriented HP Victus laptop built for esports, media creation, and stronger graphics workloads.',
  },
  {
    id: 'cv-l-10',
    name: 'HP Envy x360 14-es1013 Core 5',
    price: 1000000,
    features: ['Envy x360', 'Convertible'],
    desc: 'Premium HP Envy convertible for users who want a sleeker design, flexible form factor, and touchscreen workflow.',
  },
  {
    id: 'cv-l-11',
    name: 'HP Spectre x360 14t-es000',
    price: 2198000,
    features: ['Spectre x360', 'Premium Convertible'],
    desc: 'Flagship Spectre class laptop with a premium convertible design for executive use and high-end portability.',
  },
  {
    id: 'cv-l-12',
    name: 'Lenovo ThinkBook 13s G2-ITL',
    price: 890500,
    features: ['ThinkBook', 'Slim Design'],
    desc: 'Compact Lenovo ThinkBook with a business-friendly design for professionals who want portability and clean styling.',
  },
  {
    id: 'cv-l-13',
    name: 'Lenovo ThinkPad L14 Gen 2',
    price: 940000,
    features: ['ThinkPad', 'Business Series'],
    desc: 'Reliable ThinkPad model built around business durability, keyboard comfort, and practical work performance.',
  },
  {
    id: 'cv-l-14',
    name: 'Lenovo ThinkPad L13 Yoga Gen 2',
    price: 1068000,
    features: ['Yoga Convertible', 'ThinkPad Series'],
    desc: 'Convertible ThinkPad option for professionals who need tablet flexibility with ThinkPad ergonomics.',
  },
  {
    id: 'cv-l-15',
    name: 'Lenovo ThinkBook 14 G4 Convertible Ultra 7',
    price: 1490000,
    features: ['Ultra 7', 'Convertible'],
    desc: 'Modern ThinkBook convertible with stronger performance and a clean business-focused chassis.',
  },
  {
    id: 'cv-l-16',
    name: 'Lenovo Legion 5 16IRX9 Core i7-14650HX RTX 4060',
    price: 2475000,
    features: ['RTX 4060', 'Core i7-14650HX'],
    desc: 'High-performance Lenovo Legion gaming laptop built for heavier gaming, rendering, and multitasking.',
  },
  {
    id: 'cv-l-17',
    name: 'Lenovo V15 Intel Celeron N4500',
    price: 330000,
    features: ['Intel Celeron N4500', 'Budget Friendly'],
    desc: 'Low-cost Lenovo V15 option for office basics, web use, and entry-level productivity.',
  },
  {
    id: 'cv-l-18',
    name: 'Lenovo V15-IRU Core i3-1315U',
    price: 490000,
    features: ['Core i3-1315U', 'V15 Series'],
    desc: 'Value-focused Lenovo V15 with a newer Intel chip for day-to-day office work and school use.',
  },
  {
    id: 'cv-l-19',
    name: 'Lenovo IdeaPad 1 Intel Celeron N4020',
    price: 310000,
    features: ['IdeaPad 1', 'Intel N4020'],
    desc: 'Entry-level IdeaPad suitable for browsing, online learning, and light productivity.',
  },
  {
    id: 'cv-l-20',
    name: 'Acer Predator Helios Neo 16 PHN16-72-97',
    price: 2496500,
    features: ['Predator Series', 'Gaming Laptop'],
    desc: 'Performance-focused Acer Predator laptop designed for gaming sessions and GPU-heavy tasks.',
  },
  {
    id: 'cv-l-21',
    name: 'MSI Thin GF63 12UCX',
    price: 1200000,
    features: ['Thin GF63', 'Gaming Ready'],
    desc: 'Slimmer MSI gaming notebook for users who want dedicated graphics in a more portable shell.',
  },
  {
    id: 'cv-l-22',
    name: 'MSI WF66 12UI',
    price: 1411000,
    features: ['WF66 Series', 'Workstation Class'],
    desc: 'Professional MSI machine aimed at creative work, design software, and business-grade performance.',
  },
  {
    id: 'cv-l-23',
    name: 'ASUS X515EA Core i7',
    price: 710000,
    features: ['Core i7', 'Everyday Performance'],
    desc: 'Affordable ASUS laptop with a stronger Intel tier for general productivity and home-office tasks.',
  },
]

const baseAccessories = [
  {
    id: 'cv-a-01',
    name: 'HP 125 Wired Mouse',
    price: 10500,
    features: ['Wired', 'HP Accessory'],
    desc: 'Simple wired mouse from the Computer Village catalog for office desks, schools, and shared workstations.',
  },
  {
    id: 'cv-a-02',
    name: 'HP 150 Wired Mouse',
    price: 8000,
    features: ['Wired', 'Budget Accessory'],
    desc: 'Affordable wired HP mouse for everyday navigation and basic laptop setups.',
  },
  {
    id: 'cv-a-03',
    name: 'CANYON Multimedia Stereo Headset HSC-1',
    price: 15000,
    features: ['Stereo Headset', 'Multimedia'],
    desc: 'Entry-level wired headset for calls, online classes, and light listening.',
  },
  {
    id: 'cv-a-04',
    name: 'Micropack Apollo GP-800 RGB Gaming Mouse Pad',
    price: 25000,
    features: ['RGB Lighting', 'Gaming Mouse Pad'],
    desc: 'Extended gaming mouse pad with RGB styling for cleaner desk setups and smoother tracking.',
  },
  {
    id: 'cv-a-05',
    name: 'Apple Power Adapter Extension Cable',
    price: 37000,
    features: ['Apple Accessory', 'Power Extension'],
    desc: 'Power extension cable designed for compatible Apple chargers and laptop power adapters.',
  },
  {
    id: 'cv-a-06',
    name: 'Apple Charger for iPhone and iPad',
    price: 9000,
    features: ['Apple Charger', 'Compact'],
    desc: 'Compact Apple charging accessory suitable for phones, tablets, and light travel use.',
  },
  {
    id: 'cv-a-07',
    name: 'Apple Lightning to USB Cable',
    price: 16000,
    features: ['Lightning Cable', 'Apple Accessory'],
    desc: 'Apple cable for charging and syncing compatible devices with a USB connection.',
  },
]

const realLaptopNames = []

const generatedLaptops = Array.from({ length: realLaptopNames.length }, (_, index) => {
  const size = index % 2 === 0 ? '14"' : '16"'
  return {
    id: `l-auto-${index + 1}`,
    name: realLaptopNames[index],
    price: 900000 + index * 22000,
    features: ['Creator Ready', size],
    desc: 'Creator-ready laptop tuned for design, editing, and productivity.',
  }
})

const realAccessoryNames = []

const generatedAccessories = Array.from({ length: realAccessoryNames.length }, (_, index) => {
  const type = index % 4
  const name = realAccessoryNames[index]
  const features =
    type === 0
      ? ['Noise Cancel', 'Wireless']
      : type === 1
        ? ['Adjustable DPI', 'Silent Clicks']
        : type === 2
          ? ['20,000mAh', 'Fast Charge']
          : ['65W', 'USB-C']
  return {
    id: `a-auto-${index + 1}`,
    name,
    price: 28000 + index * 4000,
    features,
    desc: 'Reliable everyday accessory designed for modern workflows.',
  }
})

export const products = [
  ...baseLaptops.map((item, index) => ({
    ...item,
    category: 'Laptop',
    tag: 'LAPTOP',
    image: resolveLaptopImage(item, index),
    imageFallback: buildProductPlaceholder(item.name, 'Laptop'),
    specs: buildLaptopSpecs(index),
    rating: buildRating(index),
    reviewCount: buildReviewCount(index),
    stock: buildStock(index),
    sku: `OJ-LAP-${String(index + 1).padStart(3, '0')}`,
  })),
  ...generatedLaptops.map((item, index) => ({
    ...item,
    category: 'Laptop',
    tag: 'LAPTOP',
    image: resolveLaptopImage(item, index + 2),
    imageFallback: buildProductPlaceholder(item.name, 'Laptop'),
    specs: buildLaptopSpecs(index + 3),
    rating: buildRating(index + 12),
    reviewCount: buildReviewCount(index + 12),
    stock: buildStock(index + 12),
    sku: `OJ-LAP-G${String(index + 1).padStart(3, '0')}`,
  })),
  ...baseAccessories.map((item, index) => ({
    ...item,
    category: 'Accessory',
    tag: 'ACCESSORY',
    image: resolveAccessoryImage(item, index),
    imageFallback: buildProductPlaceholder(item.name, 'Accessory'),
    specs: buildAccessorySpecs(index),
    rating: buildRating(index + 20),
    reviewCount: buildReviewCount(index + 20),
    stock: buildStock(index + 20),
    sku: `OJ-ACC-${String(index + 1).padStart(3, '0')}`,
  })),
  ...generatedAccessories.map((item, index) => ({
    ...item,
    category: 'Accessory',
    tag: 'ACCESSORY',
    image: resolveAccessoryImage(item, index + 3),
    imageFallback: buildProductPlaceholder(item.name, 'Accessory'),
    specs: buildAccessorySpecs(index + 2),
    rating: buildRating(index + 33),
    reviewCount: buildReviewCount(index + 33),
    stock: buildStock(index + 33),
    sku: `OJ-ACC-G${String(index + 1).padStart(3, '0')}`,
  })),
]

export const features = [
  {
    title: 'Genuine Products',
    desc: '100% original products with manufacturer warranty included.',
  },
  {
    title: 'Fast Delivery',
    desc: 'Same day delivery within Lagos, 2-3 days nationwide.',
  },
  {
    title: 'Secure Payment',
    desc: 'Pay securely online or choose Pay on Delivery.',
  },
]

export const footerLinks = {
  shop: ['Laptops', 'Accessories', 'New Arrivals', 'Deals of the Week'],
  support: ['Contact Us', 'FAQs', 'Shipping & Returns', 'Warranty Policy'],
}
