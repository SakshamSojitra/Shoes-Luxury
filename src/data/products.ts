export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  sizes: number[];
  images: string[];
  isLimited: boolean;
  category: string;
}

const shoeImages = [
  "/products/nike-rayssa-leal-ai.png",
  "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1520256862855-398228c41684?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1623527700248-475c04551318?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1588361861040-ac9b1018f6d5?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1618898909019-010e4e234c55?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&h=600&fit=crop",
];

const allSizes = [4, 5, 6, 7, 8, 9, 10, 11, 12];

export const products: Product[] = [
  { id: "1", name: "Nike SB Dunk Low Rayssa Leal", brand: "Nike", price: 22999, description: "Premium Nike SB collaboration with standout detailing and everyday comfort.", sizes: allSizes, images: ["/products/nike-rayssa-leal-ai.png", "/products/nike-rayssa-leal-second.png", "/products/nike-rayssa-leal-third.webp"], isLimited: true, category: "Lifestyle" },
  { id: "2", name: "Adidas Samba OG Cloud White Core Black", brand: "Adidas", price: 9999, description: "Responsive BOOST cushioning meets premium Primeknit upper for an unmatched running experience.", sizes: allSizes, images: ["/products/Adidas-Smaba-OG.png", "/products/Adidas-second.png", "/products/Adidas-third.png"], isLimited: false, category: "Running" },
  { id: "3", name: "RS-X Reinvention", brand: "Puma", price: 11999, description: "Bold, chunky, and unapologetically retro. The RS-X brings 80s running tech into the future.", sizes: allSizes, images: [shoeImages[2], shoeImages[4], shoeImages[5]], isLimited: false, category: "Lifestyle" },
  { id: "4", name: "574 Legacy", brand: "New Balance", price: 12495, description: "The iconic 574 silhouette reimagined with premium suede and mesh materials.", sizes: allSizes, images: [shoeImages[3], shoeImages[6], shoeImages[7]], isLimited: false, category: "Lifestyle" },
  { id: "5", name: "Gel-Kayano 30", brand: "Asics", price: 16999, description: "Stability meets luxury. The Gel-Kayano 30 delivers premium comfort for every stride.", sizes: allSizes, images: [shoeImages[4], shoeImages[8], shoeImages[9]], isLimited: false, category: "Running" },
  { id: "6", name: "HOVR Phantom 3", brand: "Under Armour", price: 15499, description: "Zero-gravity feel meets connected fitness. The HOVR Phantom 3 is engineered for performance.", sizes: allSizes, images: [shoeImages[5], shoeImages[10], shoeImages[11]], isLimited: false, category: "Running" },
  { id: "7", name: "Nike SB Dunk Low Supreme Rammellzee", brand: "Nike", price: 39999, description: "The shoe that started it all. Premium leather construction in an iconic colorway.", sizes: allSizes, images: ["/products/nike-sb-dunk-low-supreme-rammellzee.png", "/products/nike-sb-dunk-low-supreme-rammellzee-2.jpg", "/products/nike-sb-dunk-low-supreme-rammellzee-3.png"], isLimited: true, category: "Basketball" },
  { id: "8", name: "Adidas Yeezy 350 V2 Carbon Beluga", brand: "Adidas", price: 10999, description: "Platform styling meets basketball heritage. The Forum Bold is a statement piece.", sizes: allSizes, images: ["/products/adidas-yezzy.png", "/products/adidas-yezzy-second.png", "/products/adidas-yezzy-third.png"], isLimited: true, category: "Lifestyle" },
  { id: "9", name: "Nike SB Dunk Low Ben & Jerry's Chunky Dunky", brand: "Nike", price: 123999, description: "Clean lines and classic colorways make the Dunk Low a wardrobe essential.", sizes: [4, 5, 6, 7, 8, 9, 10, 11, 12], images: ["/products/nike-chunky-dunky.png", "/products/chunky-dunky-second.png", "/products/chunky-dunky-third.png"], isLimited: true, category: "Lifestyle" },
  { id: "10", name: "Samba OG", brand: "Adidas", price: 9999, description: "From the pitch to the streets. The Samba OG is timeless versatility.", sizes: allSizes, images: [shoeImages[9], shoeImages[15], shoeImages[3]], isLimited: false, category: "Lifestyle" },
  { id: "11", name: "Suede Classic", brand: "Puma", price: 8499, description: "The Suede Classic defined an era. Premium suede upper with a sleek profile.", sizes: allSizes, images: [shoeImages[10], shoeImages[16], shoeImages[4]], isLimited: false, category: "Lifestyle" },
  { id: "12", name: "990v6", brand: "New Balance", price: 24999, description: "Made in USA. The 990v6 is the pinnacle of premium comfort and craftsmanship.", sizes: allSizes, images: [shoeImages[11], shoeImages[17], shoeImages[5]], isLimited: false, category: "Running" },
  { id: "13", name: "Gel-1130", brand: "Asics", price: 12999, description: "Y2K aesthetics meet modern comfort. The Gel-1130 is the trend-setter's choice.", sizes: allSizes, images: [shoeImages[12], shoeImages[18], shoeImages[6]], isLimited: false, category: "Running" },
  { id: "14", name: "Curry Flow 10", brand: "Under Armour", price: 17999, description: "Court-ready performance with Steph Curry's signature style and UA Flow technology.", sizes: allSizes, images: [shoeImages[13], shoeImages[19], shoeImages[7]], isLimited: false, category: "Basketball" },
  { id: "15", name: "Nike Air Force 1 Low SP Tiffany And Co.", brand: "Nike", price: 142999, description: "The legend lives on. Premium leather AF1 with the iconic Air sole.", sizes: allSizes, images: ["/products/nike-air-force-1-07-black-aqua.png", "/products/nike-air-force-1-tiffany-second.png", "/products/nike-air-force-1-tiffany-third.png"], isLimited: true, category: "Lifestyle" },
  { id: "16", name: "NMD R1", brand: "Adidas", price: 13999, description: "Nomadic inspiration meets BOOST technology. Lightweight, responsive, iconic.", sizes: allSizes, images: [shoeImages[15], shoeImages[21], shoeImages[9]], isLimited: false, category: "Lifestyle" },
  { id: "17", name: "Palermo", brand: "Puma", price: 8999, description: "Italian terrace culture meets modern streetwear. The Palermo is effortlessly cool.", sizes: allSizes, images: [shoeImages[16], shoeImages[22], shoeImages[10]], isLimited: false, category: "Lifestyle" },
  { id: "18", name: "327", brand: "New Balance", price: 11499, description: "Retro-inspired with an oversized 'N' logo. The 327 brings 70s running vibes forward.", sizes: allSizes, images: [shoeImages[17], shoeImages[23], shoeImages[11]], isLimited: false, category: "Lifestyle" },
  { id: "19", name: "Novablast 4", brand: "Asics", price: 14999, description: "Bouncy FF BLAST PLUS cushioning for an energetic ride that keeps you going.", sizes: allSizes, images: [shoeImages[18], shoeImages[24], shoeImages[12]], isLimited: false, category: "Running" },
  { id: "20", name: "SlipSpeed Mega", brand: "Under Armour", price: 19999, description: "Convertible heel technology lets you switch between slide and shoe mode.", sizes: allSizes, images: [shoeImages[19], shoeImages[0], shoeImages[13]], isLimited: false, category: "Training" },
  { id: "21", name: "Nike Air Jordan 1 Retro Low OG Zion Williamson Voodoo Alternate", brand: "Nike", price: 14999, description: "The marathon racer's weapon of choice. ZoomX foam and carbon fiber plate.", sizes: allSizes, images: ["/products/nike-zion-william-1.png", "/products/nike-zion-william-second.png", "/products/nike-zion-william-third.png"], isLimited: false, category: "Running" },
  { id: "22", name: "Yeezy Slide", brand: "Adidas", price: 7999, description: "Minimalist design with maximum comfort. The Yeezy Slide is effortless luxury.", sizes: allSizes, images: [shoeImages[21], shoeImages[2], shoeImages[15]], isLimited: false, category: "Lifestyle" },
  { id: "23", name: "MB.03", brand: "Puma", price: 16499, description: "LaMelo Ball's signature shoe with NITRO foam and vibrant colorways.", sizes: allSizes, images: [shoeImages[22], shoeImages[3], shoeImages[16]], isLimited: false, category: "Basketball" },
  { id: "24", name: "FuelCell Rebel v4", brand: "New Balance", price: 14495, description: "Lightweight speed with FuelCell midsole technology for tempo runs.", sizes: allSizes, images: [shoeImages[23], shoeImages[4], shoeImages[17]], isLimited: false, category: "Running" },
  { id: "25", name: "GT-2000 12", brand: "Asics", price: 13999, description: "Reliable stability and cushioning for daily training miles. A runner's best friend.", sizes: allSizes, images: [shoeImages[24], shoeImages[5], shoeImages[18]], isLimited: false, category: "Running" },
  { id: "26", name: "Nike Air Jordan 1 Low Travis Scott", brand: "Nike", price: 159999, description: "Exclusive Travis Scott collaboration with premium materials and signature detailing.", sizes: allSizes, images: ["/products/travis-scott-1.png", "/products/travis-scott-2.png", "/products/travis-scott-3.png"], isLimited: true, category: "Basketball" },
  { id: "27", name: "Nike Air Jordan 4", brand: "Nike", price: 26999, description: "Classic Air Jordan 4 silhouette with premium finish and all-day comfort.", sizes: allSizes, images: ["/products/nike-jordan-4.png", "/products/nike-jordan-4-2.png", "/products/nike-jordan-4-3.png"], isLimited: false, category: "Basketball" },
];

export const brands = ["Nike", "Adidas", "Puma", "New Balance", "Asics", "Under Armour"];
export const categories = ["Running", "Lifestyle", "Basketball", "Training"];

export function getProductPrice(product: Product, size?: number): number {
  if (size === undefined) {
    return product.price;
  }

  if (product.id === "1") {
    if (size >= 4 && size <= 6) return 20999;
    if (size === 7) return 22999;
    if (size === 8) return 24999;
    if (size === 9 || size === 10) return 25999;
    if (size >= 11 && size <= 12) return 27999;
  }

  if (product.id === "2") {
    if (size >= 4 && size <= 6) return 8999;
    if (size >= 7 && size <= 10) return 9999;
    if (size >= 11 && size <= 12) return 10999;
  }

  if (product.id === "7") {
    if (size >= 4 && size <= 6) return 39999;
    if (size === 7) return 42999;
    if (size === 8) return 44999;
    if (size === 9 || size === 10) return 46999;
    if (size >= 11 && size <= 12) return 49999;
  }

  if (product.id === "26") {
    if (size >= 4 && size <= 6) return 159999;
    if (size === 7) return 169999;
    if (size === 8) return 171999;
    if (size === 9) return 175999;
    if (size === 10) return 179999;
    if (size >= 11 && size <= 12) return 189999;
  }

  if (product.id === "8") {
    if (size >= 4 && size <= 6) return 11999;
    if (size === 7) return 14999;
    if (size === 8) return 15999;
    if (size === 9 || size === 10) return 16999;
    if (size >= 11 && size <= 12) return 26999;
  }

  if (product.id === "9") {
    if (size === 4) return 123999;
    if (size === 5) return 125999;
    if (size === 6) return 145999;
    if (size === 7) return 139999;
    if (size === 8) return 137999;
    if (size === 9) return 149999;
    if (size === 10) return 154999;
    if (size === 11) return 223999;
    if (size === 12) return 229999;
  }

  if (product.id === "15") {
    if (size >= 4 && size <= 6) return 129999;
    if (size === 7) return 142999;
    if (size === 8) return 149999;
    if (size === 9) return 145999;
    if (size === 10) return 152999;
    if (size >= 11 && size <= 12) return 169999;
  }

  if (product.id === "21") {
    if (size >= 4 && size <= 6) return 13999;
    if (size === 7) return 14999;
    if (size === 8) return 15999;
    if (size === 9) return 16999;
    if (size === 10) return 17499;
    if (size >= 11 && size <= 12) return 18499;
  }

  if (product.id === "27") {
    if (size === 4) return 19999;
    if (size === 5) return 24999;
    if (size === 6) return 21999;
    if (size === 7) return 26999;
    if (size === 8) return 27999;
    if (size === 9) return 28999;
    if (size === 10) return 28799;
    if (size === 11) return 30999;
    if (size === 12) return 32999;
  }

  return product.price;
}

export function formatPrice(price: number): string {
  return "₹" + price.toLocaleString("en-IN");
}
