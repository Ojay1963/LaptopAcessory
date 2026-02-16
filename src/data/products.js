const laptopImageSets = {
  apple: [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop',
  ],
  dell: [
    'https://images.unsplash.com/photo-1517059224940-d4af9eec41c7?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
  ],
  hp: [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517059224940-d4af9eec41c7?q=80&w=1200&auto=format&fit=crop',
  ],
  lenovo: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1200&auto=format&fit=crop',
  ],
  asus: [
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
  ],
  acer: [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop',
  ],
  msi: [
    'https://images.unsplash.com/photo-1517059224940-d4af9eec41c7?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop',
  ],
  razer: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517059224940-d4af9eec41c7?q=80&w=1200&auto=format&fit=crop',
  ],
  samsung: [
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1200&auto=format&fit=crop',
  ],
  lg: [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
  ],
  microsoft: [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517059224940-d4af9eec41c7?q=80&w=1200&auto=format&fit=crop',
  ],
  huawei: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop',
  ],
  gaming: [
    'https://images.unsplash.com/photo-1517059224940-d4af9eec41c7?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
  ],
  default: [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop',
  ],
}

const accessoryImageSets = {
  headset: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518443952246-7bcd9a14d63f?q=80&w=1200&auto=format&fit=crop',
  ],
  mouse: [
    'https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=1200&auto=format&fit=crop',
  ],
  charger: [
    'https://images.unsplash.com/photo-1580906855284-7a103dbf8122?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1601972599722-10a51a4d5f1a?q=80&w=1200&auto=format&fit=crop',
  ],
  powerbank: [
    'https://images.unsplash.com/photo-1601972599722-10a51a4d5f1a?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1580906855284-7a103dbf8122?q=80&w=1200&auto=format&fit=crop',
  ],
  keyboard: [
    'https://images.unsplash.com/photo-1518443952246-7bcd9a14d63f?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=1200&auto=format&fit=crop',
  ],
  hub: [
    'https://images.unsplash.com/photo-1580906855284-7a103dbf8122?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518443952246-7bcd9a14d63f?q=80&w=1200&auto=format&fit=crop',
  ],
  webcam: [
    'https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518443952246-7bcd9a14d63f?q=80&w=1200&auto=format&fit=crop',
  ],
  default: [
    'https://images.unsplash.com/photo-1518443952246-7bcd9a14d63f?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop',
  ],
}

export const fallbackImage =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="675">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#1f2235"/>
          <stop offset="100%" stop-color="#2f354f"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <rect x="80" y="80" width="740" height="515" rx="28" fill="none" stroke="#ffffff" stroke-opacity="0.18" stroke-width="3"/>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="#f4c073" font-family="Arial, sans-serif" font-size="34" font-weight="700">
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

const pickImageFromSet = (set, index) => set[index % set.length]

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

const resolveLaptopImage = (name, index) => {
  const lower = name.toLowerCase()
  if (lower.includes('macbook') || lower.includes('apple')) return pickImageFromSet(laptopImageSets.apple, index)
  if (lower.includes('dell')) return pickImageFromSet(laptopImageSets.dell, index)
  if (lower.includes('hp')) return pickImageFromSet(laptopImageSets.hp, index)
  if (lower.includes('lenovo') || lower.includes('thinkpad')) return pickImageFromSet(laptopImageSets.lenovo, index)
  if (lower.includes('asus') || lower.includes('rog') || lower.includes('tuf')) return pickImageFromSet(laptopImageSets.asus, index)
  if (lower.includes('acer') || lower.includes('nitro') || lower.includes('predator')) return pickImageFromSet(laptopImageSets.acer, index)
  if (lower.includes('msi')) return pickImageFromSet(laptopImageSets.msi, index)
  if (lower.includes('razer')) return pickImageFromSet(laptopImageSets.razer, index)
  if (lower.includes('samsung')) return pickImageFromSet(laptopImageSets.samsung, index)
  if (lower.includes('lg')) return pickImageFromSet(laptopImageSets.lg, index)
  if (lower.includes('surface') || lower.includes('microsoft')) return pickImageFromSet(laptopImageSets.microsoft, index)
  if (lower.includes('huawei') || lower.includes('matebook')) return pickImageFromSet(laptopImageSets.huawei, index)
  if (lower.includes('gaming') || lower.includes('legion') || lower.includes('omen') || lower.includes('alienware'))
    return pickImageFromSet(laptopImageSets.gaming, index)
  return pickImageFromSet(laptopImageSets.default, index)
}

const resolveAccessoryImage = (name, index) => {
  const lower = name.toLowerCase()
  if (lower.includes('headset') || lower.includes('headphone') || lower.includes('wh-') || lower.includes('quantum'))
    return pickImageFromSet(accessoryImageSets.headset, index)
  if (lower.includes('mouse') || lower.includes('mx master') || lower.includes('basilisk'))
    return pickImageFromSet(accessoryImageSets.mouse, index)
  if (lower.includes('charger') || lower.includes('gan') || lower.includes('powerport'))
    return pickImageFromSet(accessoryImageSets.charger, index)
  if (lower.includes('power bank') || lower.includes('powercore') || lower.includes('battery'))
    return pickImageFromSet(accessoryImageSets.powerbank, index)
  if (lower.includes('keyboard') || lower.includes('keychron') || lower.includes('alloy'))
    return pickImageFromSet(accessoryImageSets.keyboard, index)
  if (lower.includes('hub') || lower.includes('dock') || lower.includes('adapter'))
    return pickImageFromSet(accessoryImageSets.hub, index)
  if (lower.includes('webcam') || lower.includes('camera'))
    return pickImageFromSet(accessoryImageSets.webcam, index)
  return pickImageFromSet(accessoryImageSets.default, index)
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
    image: resolveLaptopImage(item.name, index),
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
    image: resolveLaptopImage(item.name, index + 2),
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
    image: resolveAccessoryImage(item.name, index),
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
    image: resolveAccessoryImage(item.name, index + 3),
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
