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
  const meta = item.features?.join(' • ') || 'Premium Laptop'

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
  const meta = item.features?.join(' • ') || 'Reliable Accessory'

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
    id: 'l-01',
    name: 'MacBook Pro M3',
    price: 2450000,
    features: ['M3 Pro Chip', '16GB RAM'],
    desc: 'The ultimate pro laptop with the M3 chip. Handles demanding workflows with ease.',
  },
  {
    id: 'l-02',
    name: 'Dell XPS 13 Plus',
    price: 1850000,
    features: ['Intel Evo i7', '16GB RAM'],
    desc: 'Sleek, modern, and powerful. The perfect ultrabook for productivity.',
  },
  {
    id: 'l-03',
    name: 'HP Spectre x360 14',
    price: 1680000,
    features: ['2-in-1', 'OLED Display'],
    desc: 'Premium convertible with vivid OLED screen and long battery life.',
  },
  {
    id: 'l-04',
    name: 'Lenovo ThinkPad X1 Carbon',
    price: 2100000,
    features: ['Intel i7', 'Ultra Light'],
    desc: 'Business-class durability with enterprise-grade security.',
  },
  {
    id: 'l-05',
    name: 'ASUS ROG Zephyrus G14',
    price: 2400000,
    features: ['Ryzen 9', 'RTX 4060'],
    desc: 'Compact gaming powerhouse with crisp display and fast refresh.',
  },
  {
    id: 'l-06',
    name: 'Acer Swift 5',
    price: 1320000,
    features: ['Lightweight', '14" IPS'],
    desc: 'Slim, portable, and ready for travel with all-day battery.',
  },
  {
    id: 'l-07',
    name: 'MSI Stealth 16 Studio',
    price: 2950000,
    features: ['RTX 4070', 'Creator Ready'],
    desc: 'Creator-grade GPU and display tuned for high fidelity work.',
  },
  {
    id: 'l-08',
    name: 'Razer Blade 15',
    price: 3200000,
    features: ['240Hz', 'RTX 4070'],
    desc: 'Premium gaming performance in a sleek CNC aluminum build.',
  },
  {
    id: 'l-09',
    name: 'Samsung Galaxy Book4 Pro',
    price: 1700000,
    features: ['AMOLED', 'Intel Evo'],
    desc: 'Vivid AMOLED screen with seamless Galaxy ecosystem support.',
  },
  {
    id: 'l-10',
    name: 'LG Gram 17',
    price: 1950000,
    features: ['17" Display', 'Ultra Light'],
    desc: 'Big screen with surprisingly light form factor for multitasking.',
  },
  {
    id: 'l-11',
    name: 'Surface Laptop 6',
    price: 1750000,
    features: ['Touchscreen', '13.5"'],
    desc: 'Clean design with responsive touch display and premium feel.',
  },
  {
    id: 'l-12',
    name: 'Huawei MateBook X Pro',
    price: 1850000,
    features: ['3K Display', 'Touch'],
    desc: 'Edge-to-edge screen for immersive visuals and design work.',
  },
  {
    id: 'l-13',
    name: 'ASUS Zenbook 14 OLED',
    price: 1620000,
    features: ['OLED', 'Intel i7'],
    desc: 'Vibrant OLED display in a compact aluminum shell.',
  },
  {
    id: 'l-14',
    name: 'Lenovo Yoga 9i',
    price: 2050000,
    features: ['Convertible', 'Soundbar Hinge'],
    desc: '2-in-1 with premium audio and sharp touchscreen display.',
  },
  {
    id: 'l-15',
    name: 'HP Envy 16',
    price: 1550000,
    features: ['16" Screen', 'Creator Ready'],
    desc: 'Roomy display with strong performance for creative tasks.',
  },
  {
    id: 'l-16',
    name: 'Dell Inspiron 14 Plus',
    price: 1350000,
    features: ['Intel i7', '16GB RAM'],
    desc: 'Balanced performance for work and play in a sleek design.',
  },
  {
    id: 'l-17',
    name: 'Acer Predator Helios 16',
    price: 2700000,
    features: ['RTX 4070', '165Hz'],
    desc: 'Gaming beast with advanced cooling and smooth visuals.',
  },
  {
    id: 'l-18',
    name: 'MSI Raider GE78',
    price: 3300000,
    features: ['RTX 4080', 'RGB'],
    desc: 'Top-tier gaming performance with premium chassis and keyboard.',
  },
  {
    id: 'l-19',
    name: 'Alienware X16',
    price: 3400000,
    features: ['Intel i9', 'RTX 4080'],
    desc: 'Futuristic design with elite gaming power.',
  },
  {
    id: 'l-20',
    name: 'Gigabyte Aero 16',
    price: 2650000,
    features: ['4K OLED', 'RTX 4070'],
    desc: 'Creator laptop with accurate colors and strong GPU.',
  },
  {
    id: 'l-21',
    name: 'ASUS TUF Gaming A15',
    price: 1500000,
    features: ['Ryzen 7', 'RTX 4060'],
    desc: 'Durable gaming laptop with dependable thermals.',
  },
  {
    id: 'l-22',
    name: 'Lenovo Legion 5 Pro',
    price: 2100000,
    features: ['165Hz', 'RTX 4060'],
    desc: 'High refresh gaming with vibrant QHD display.',
  },
  {
    id: 'l-23',
    name: 'HP Omen 16',
    price: 1980000,
    features: ['RTX 4060', '144Hz'],
    desc: 'Gaming performance in a refined chassis.',
  },
  {
    id: 'l-24',
    name: 'Dell G16',
    price: 1750000,
    features: ['RTX 4050', '165Hz'],
    desc: 'Solid gaming performance with a spacious display.',
  },
  {
    id: 'l-25',
    name: 'Acer Nitro 5',
    price: 1320000,
    features: ['RTX 3050', '144Hz'],
    desc: 'Great entry-level gaming value with fast refresh.',
  },
  {
    id: 'l-26',
    name: 'Lenovo IdeaPad Slim 5',
    price: 980000,
    features: ['Ryzen 5', '16GB RAM'],
    desc: 'Everyday productivity with sleek build quality.',
  },
  {
    id: 'l-27',
    name: 'ASUS Vivobook S15',
    price: 920000,
    features: ['Intel i5', 'OLED'],
    desc: 'Stylish and light with a vibrant OLED screen.',
  },
  {
    id: 'l-28',
    name: 'HP Pavilion 15',
    price: 860000,
    features: ['Intel i5', '15.6"'],
    desc: 'Reliable laptop for school and office needs.',
  },
  {
    id: 'l-29',
    name: 'Dell Latitude 7440',
    price: 1650000,
    features: ['Business', 'vPro'],
    desc: 'Secure business laptop with premium build.',
  },
  {
    id: 'l-30',
    name: 'Lenovo ThinkPad T14s',
    price: 1750000,
    features: ['Ryzen Pro', 'Ultra Light'],
    desc: 'Durable business-class notebook with strong performance.',
  },
]

const baseAccessories = [
  {
    id: 'a-01',
    name: 'Sony WH-1000XM5 Headset',
    price: 450000,
    features: ['30hr Battery', 'LDAC Support'],
    desc: 'Industry-leading noise cancelling headphones with crystal clear sound.',
  },
  {
    id: 'a-02',
    name: 'Bose QuietComfort Ultra',
    price: 520000,
    features: ['Spatial Audio', 'Noise Cancel'],
    desc: 'Premium comfort with immersive audio and deep bass.',
  },
  {
    id: 'a-03',
    name: 'JBL Tune 760NC',
    price: 135000,
    features: ['Bluetooth 5.0', 'ANC'],
    desc: 'Affordable noise cancelling headphones with punchy sound.',
  },
  {
    id: 'a-04',
    name: 'Logitech MX Master 3S Mouse',
    price: 125000,
    features: ['8000 DPI', 'Quiet Clicks'],
    desc: 'The most precise and comfortable productivity mouse.',
  },
  {
    id: 'a-05',
    name: 'Razer Basilisk V3 Mouse',
    price: 115000,
    features: ['26K DPI', 'RGB'],
    desc: 'Ergonomic gaming mouse with customizable scroll wheel.',
  },
  {
    id: 'a-06',
    name: 'SteelSeries Rival 5 Mouse',
    price: 98000,
    features: ['18K DPI', '9 Buttons'],
    desc: 'Lightweight multi-genre gaming mouse.',
  },
  {
    id: 'a-07',
    name: 'Anker PowerCore 20000 Battery',
    price: 98000,
    features: ['20,000mAh', 'Fast Charge'],
    desc: 'High capacity power bank for all-day charging.',
  },
  {
    id: 'a-08',
    name: 'Baseus 65W USB-C Charger',
    price: 52000,
    features: ['65W GaN', 'Dual Port'],
    desc: 'Compact USB-C charger for laptops and phones.',
  },
  {
    id: 'a-09',
    name: 'UGREEN 100W GaN Charger',
    price: 78000,
    features: ['100W', '4 Ports'],
    desc: 'Powerful multi-port charger for all devices.',
  },
  {
    id: 'a-10',
    name: 'Anker 737 Power Bank',
    price: 145000,
    features: ['24,000mAh', '140W'],
    desc: 'High output power bank for laptops and tablets.',
  },
  {
    id: 'a-11',
    name: 'Romoss Sense 8+ Battery',
    price: 69000,
    features: ['30,000mAh', 'Triple Output'],
    desc: 'Large capacity battery pack for extended travel.',
  },
  {
    id: 'a-12',
    name: 'Oraimo Toast 3 Charger',
    price: 22000,
    features: ['18W', 'Type-C'],
    desc: 'Reliable fast charger for daily use.',
  },
  {
    id: 'a-13',
    name: 'Apple 96W USB-C Charger',
    price: 88000,
    features: ['96W', 'USB-C'],
    desc: 'Official Apple charger for MacBook Pro.',
  },
  {
    id: 'a-14',
    name: 'Samsung 45W Super Fast Charger',
    price: 38000,
    features: ['45W', 'USB-C'],
    desc: 'Super fast charging for Samsung devices.',
  },
  {
    id: 'a-15',
    name: 'Xiaomi 65W GaN Charger',
    price: 42000,
    features: ['65W', 'Compact'],
    desc: 'Portable GaN charger with high output.',
  },
  {
    id: 'a-16',
    name: 'Logitech MX Keys Keyboard',
    price: 138000,
    features: ['Backlit', 'Multi-Device'],
    desc: 'Premium keyboard with comfortable, quiet keys.',
  },
  {
    id: 'a-17',
    name: 'Keychron K2 Mechanical',
    price: 145000,
    features: ['75% Layout', 'Bluetooth 5.1'],
    desc: 'Wireless mechanical keyboard with Gateron switches.',
  },
  {
    id: 'a-18',
    name: 'HyperX Alloy Origins',
    price: 118000,
    features: ['RGB', 'Aluminum'],
    desc: 'Durable mechanical keyboard with vivid RGB lighting.',
  },
  {
    id: 'a-19',
    name: 'JBL Quantum 810 Headset',
    price: 240000,
    features: ['Wireless', 'Surround'],
    desc: 'Immersive gaming headset with surround sound.',
  },
  {
    id: 'a-20',
    name: 'HyperX Cloud II Headset',
    price: 165000,
    features: ['7.1 Surround', 'Detachable Mic'],
    desc: 'Legendary comfort for long gaming sessions.',
  },
  {
    id: 'a-21',
    name: 'Anker 7-in-1 USB-C Hub',
    price: 62000,
    features: ['HDMI', '100W PD'],
    desc: 'Expand ports with HDMI, USB, and SD card.',
  },
  {
    id: 'a-22',
    name: 'UGREEN 9-in-1 Dock',
    price: 88000,
    features: ['Dual HDMI', 'Gigabit'],
    desc: 'Full dock for monitors, USB, and ethernet.',
  },
  {
    id: 'a-23',
    name: 'Logitech C920 Webcam',
    price: 78000,
    features: ['1080p', 'Stereo Mic'],
    desc: 'Reliable HD webcam for meetings and streaming.',
  },
  {
    id: 'a-24',
    name: 'Razer Kiyo Pro Webcam',
    price: 210000,
    features: ['1080p', 'Adaptive Light'],
    desc: 'Professional webcam with excellent low-light.',
  },
  {
    id: 'a-25',
    name: 'Logitech M590 Mouse',
    price: 38000,
    features: ['Silent Clicks', 'Bluetooth'],
    desc: 'Quiet, comfortable mouse for office work.',
  },
]

const realLaptopNames = [
'Apple MacBook Air 13"',
'Dell Inspiron 15',
'HP Pavilion 14',
'Lenovo IdeaPad 3',
'ASUS VivoBook 15',
'Acer Aspire 5',
'MSI Modern 14',
'Samsung Galaxy Book 2',
'LG Gram 14',
'Microsoft Surface Laptop 4',
'Huawei MateBook D15',
'Xiaomi Mi Notebook Pro',
'Google Pixelbook Go',
'Razer Book 13',
'Framework Laptop 13',
'System76 Lemur Pro',
'Purism Librem 14',
'Tuxedo InfinityBook Pro',
'Star Labs StarBook',
'Slimbook Essential',
'TerraMaster Notebook',
'Chuwi CoreBook X',
'Teclast F15',
'Jumper EZBook',
'ONEXPLAYER Mini',
]

const generatedLaptops = Array.from({ length: 25 }, (_, index) => {
  const size = index % 2 === 0 ? '14"' : '16"'
  return {
    id: `l-auto-${index + 1}`,
    name: realLaptopNames[index],
    price: 900000 + index * 22000,
    features: ['Creator Ready', size],
    desc: 'Creator-ready laptop tuned for design, editing, and productivity.',
  }
})

const realAccessoryNames = [
'Sennheiser HD 206',
'Audio-Technica ATH-S200BT',
'Sony MDR-XB650BT',
'Bose SoundLink Around-Ear',
'JBL T450BT',
'Logitech M185',
'Microsoft Basic Optical Mouse',
'HP Wired Mouse',
'Dell KM117',
'Lenovo Go Wireless Mouse',
'Xiaomi Mi Power Bank 3',
'Samsung EB-P1100',
'Belkin Power Bank',
'Aukey Power Bank',
'RAVPower Portable Charger',
'Belkin USB-C Wall Charger',
'Anker PowerPort Atom',
'Samsung Wall Charger',
'Apple USB Power Adapter',
'Google USB-C Charger',
]

const generatedAccessories = Array.from({ length: 20 }, (_, index) => {
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
