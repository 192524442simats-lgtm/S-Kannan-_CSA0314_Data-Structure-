/**
 * Smart Grocery Price Comparison System
 * Indian Retail Stores Demonstration Dataset and LocalStorage Manager
 * 
 * DISCLAIMER: All prices and product data are demonstration/sample data 
 * intended for academic evaluation of Data Structures (Min-Heap) algorithms.
 * Currency: Indian Rupees (₹ - INR)
 * Retail Vendors: D-Mart, Saravana Stores, Reliance Mart, More Supermarket, Spencer's, BigBasket
 */

const DEMO_NOTICE = "Academic Demonstration Data: Indian retail grocery prices are simulated across D-Mart, Saravana Stores, Reliance Mart, More, Spencer's, and BigBasket to evaluate Min-Heap algorithmic ranking.";

const INITIAL_GROCERY_DATA = [
  // --- Aashirvaad Shudh Chakki Atta (5 kg) ---
  {
    id: "groc-in-001",
    name: "Aashirvaad Shudh Chakki Atta (5 kg)",
    category: "Staples & Grains",
    vendor: "D-Mart",
    price: 239.00,
    unit: "5 kg bag",
    availability: "In Stock",
    discount: "D-Mart Mega Saver",
    rating: 4.8,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-002",
    name: "Aashirvaad Shudh Chakki Atta (5 kg)",
    category: "Staples & Grains",
    vendor: "Saravana Stores",
    price: 245.00,
    unit: "5 kg bag",
    availability: "In Stock",
    discount: "Super Price",
    rating: 4.7,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-003",
    name: "Aashirvaad Shudh Chakki Atta (5 kg)",
    category: "Staples & Grains",
    vendor: "Reliance Mart",
    price: 255.00,
    unit: "5 kg bag",
    availability: "In Stock",
    discount: "Smart Bazaar Deal",
    rating: 4.6,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-004",
    name: "Aashirvaad Shudh Chakki Atta (5 kg)",
    category: "Staples & Grains",
    vendor: "More Supermarket",
    price: 265.00,
    unit: "5 kg bag",
    availability: "In Stock",
    discount: "Standard",
    rating: 4.5,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-005",
    name: "Aashirvaad Shudh Chakki Atta (5 kg)",
    category: "Staples & Grains",
    vendor: "Spencer's",
    price: 279.00,
    unit: "5 kg bag",
    availability: "In Stock",
    discount: "Club Spencer's",
    rating: 4.6,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-006",
    name: "Aashirvaad Shudh Chakki Atta (5 kg)",
    category: "Staples & Grains",
    vendor: "BigBasket",
    price: 285.00,
    unit: "5 kg bag",
    availability: "In Stock",
    discount: "BB Star 5% Off",
    rating: 4.7,
    lastUpdated: "2026-11-20"
  },

  // --- Tata Salt Vacuum Evaporated Iodized (1 kg) ---
  {
    id: "groc-in-007",
    name: "Tata Salt Iodized (1 kg)",
    category: "Staples & Grains",
    vendor: "D-Mart",
    price: 24.00,
    unit: "1 kg pouch",
    availability: "In Stock",
    discount: "D-Mart Best Value",
    rating: 4.9,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-008",
    name: "Tata Salt Iodized (1 kg)",
    category: "Staples & Grains",
    vendor: "Saravana Stores",
    price: 25.00,
    unit: "1 kg pouch",
    availability: "In Stock",
    discount: "Special Rate",
    rating: 4.8,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-009",
    name: "Tata Salt Iodized (1 kg)",
    category: "Staples & Grains",
    vendor: "Reliance Mart",
    price: 26.00,
    unit: "1 kg pouch",
    availability: "In Stock",
    discount: "Everyday Low Price",
    rating: 4.7,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-010",
    name: "Tata Salt Iodized (1 kg)",
    category: "Staples & Grains",
    vendor: "More Supermarket",
    price: 27.00,
    unit: "1 kg pouch",
    availability: "In Stock",
    discount: "Standard",
    rating: 4.6,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-011",
    name: "Tata Salt Iodized (1 kg)",
    category: "Staples & Grains",
    vendor: "Spencer's",
    price: 28.00,
    unit: "1 kg pouch",
    availability: "In Stock",
    discount: "MRP Sale",
    rating: 4.7,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-012",
    name: "Tata Salt Iodized (1 kg)",
    category: "Staples & Grains",
    vendor: "BigBasket",
    price: 28.00,
    unit: "1 kg pouch",
    availability: "In Stock",
    discount: "Standard",
    rating: 4.8,
    lastUpdated: "2026-11-20"
  },

  // --- Fortune Sunlite Refined Sunflower Oil (1 Litre Pouch) ---
  {
    id: "groc-in-013",
    name: "Fortune Refined Sunflower Oil (1 L)",
    category: "Oils & Ghee",
    vendor: "D-Mart",
    price: 128.00,
    unit: "1 Litre Pouch",
    availability: "In Stock",
    discount: "Save ₹32",
    rating: 4.8,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-014",
    name: "Fortune Refined Sunflower Oil (1 L)",
    category: "Oils & Ghee",
    vendor: "Saravana Stores",
    price: 132.00,
    unit: "1 Litre Pouch",
    availability: "In Stock",
    discount: "Wholesale Rate",
    rating: 4.7,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-015",
    name: "Fortune Refined Sunflower Oil (1 L)",
    category: "Oils & Ghee",
    vendor: "Reliance Mart",
    price: 138.00,
    unit: "1 Litre Pouch",
    availability: "In Stock",
    discount: "Smart Cashback",
    rating: 4.6,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-016",
    name: "Fortune Refined Sunflower Oil (1 L)",
    category: "Oils & Ghee",
    vendor: "More Supermarket",
    price: 145.00,
    unit: "1 Litre Pouch",
    availability: "In Stock",
    discount: "Standard",
    rating: 4.5,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-017",
    name: "Fortune Refined Sunflower Oil (1 L)",
    category: "Oils & Ghee",
    vendor: "BigBasket",
    price: 149.00,
    unit: "1 Litre Pouch",
    availability: "In Stock",
    discount: "Express Delivery",
    rating: 4.6,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-018",
    name: "Fortune Refined Sunflower Oil (1 L)",
    category: "Oils & Ghee",
    vendor: "Spencer's",
    price: 155.00,
    unit: "1 Litre Pouch",
    availability: "In Stock",
    discount: "Standard",
    rating: 4.7,
    lastUpdated: "2026-11-20"
  },

  // --- India Gate Basmati Rice Feast Rozzana (5 kg) ---
  {
    id: "groc-in-019",
    name: "India Gate Basmati Rice Rozzana (5 kg)",
    category: "Staples & Grains",
    vendor: "D-Mart",
    price: 389.00,
    unit: "5 kg bag",
    availability: "In Stock",
    discount: "Mega Fest Deal",
    rating: 4.8,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-020",
    name: "India Gate Basmati Rice Rozzana (5 kg)",
    category: "Staples & Grains",
    vendor: "Saravana Stores",
    price: 399.00,
    unit: "5 kg bag",
    availability: "In Stock",
    discount: "Saravana Special",
    rating: 4.7,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-021",
    name: "India Gate Basmati Rice Rozzana (5 kg)",
    category: "Staples & Grains",
    vendor: "Reliance Mart",
    price: 425.00,
    unit: "5 kg bag",
    availability: "In Stock",
    discount: "Smart Saver",
    rating: 4.5,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-022",
    name: "India Gate Basmati Rice Rozzana (5 kg)",
    category: "Staples & Grains",
    vendor: "More Supermarket",
    price: 449.00,
    unit: "5 kg bag",
    availability: "In Stock",
    discount: "Standard",
    rating: 4.6,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-023",
    name: "India Gate Basmati Rice Rozzana (5 kg)",
    category: "Staples & Grains",
    vendor: "Spencer's",
    price: 475.00,
    unit: "5 kg bag",
    availability: "Limited Stock",
    discount: "Standard",
    rating: 4.7,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-024",
    name: "India Gate Basmati Rice Rozzana (5 kg)",
    category: "Staples & Grains",
    vendor: "BigBasket",
    price: 499.00,
    unit: "5 kg bag",
    availability: "In Stock",
    discount: "Standard",
    rating: 4.8,
    lastUpdated: "2026-11-20"
  },

  // --- Amul Taaza Homogenised Toned Milk (1 Litre Tetra) ---
  {
    id: "groc-in-025",
    name: "Amul Taaza Toned Milk (1 Litre)",
    category: "Dairy",
    vendor: "D-Mart",
    price: 70.00,
    unit: "1 Litre Tetra Pack",
    availability: "In Stock",
    discount: "D-Mart Price",
    rating: 4.9,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-026",
    name: "Amul Taaza Toned Milk (1 Litre)",
    category: "Dairy",
    vendor: "Saravana Stores",
    price: 71.00,
    unit: "1 Litre Tetra Pack",
    availability: "In Stock",
    discount: "Standard",
    rating: 4.8,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-027",
    name: "Amul Taaza Toned Milk (1 Litre)",
    category: "Dairy",
    vendor: "Reliance Mart",
    price: 72.00,
    unit: "1 Litre Tetra Pack",
    availability: "In Stock",
    discount: "Fresh Pack",
    rating: 4.7,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-028",
    name: "Amul Taaza Toned Milk (1 Litre)",
    category: "Dairy",
    vendor: "More Supermarket",
    price: 73.00,
    unit: "1 Litre Tetra Pack",
    availability: "In Stock",
    discount: "Standard",
    rating: 4.6,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-029",
    name: "Amul Taaza Toned Milk (1 Litre)",
    category: "Dairy",
    vendor: "BigBasket",
    price: 74.00,
    unit: "1 Litre Tetra Pack",
    availability: "In Stock",
    discount: "Daily Morning",
    rating: 4.7,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-030",
    name: "Amul Taaza Toned Milk (1 Litre)",
    category: "Dairy",
    vendor: "Spencer's",
    price: 75.00,
    unit: "1 Litre Tetra Pack",
    availability: "In Stock",
    discount: "MRP",
    rating: 4.8,
    lastUpdated: "2026-11-20"
  },

  // --- Tata Sampann Unpolished Toor Dal (1 kg) ---
  {
    id: "groc-in-031",
    name: "Tata Sampann Toor Dal (1 kg)",
    category: "Dals & Pulses",
    vendor: "D-Mart",
    price: 162.00,
    unit: "1 kg pack",
    availability: "In Stock",
    discount: "Save ₹36",
    rating: 4.8,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-032",
    name: "Tata Sampann Toor Dal (1 kg)",
    category: "Dals & Pulses",
    vendor: "Saravana Stores",
    price: 168.00,
    unit: "1 kg pack",
    availability: "In Stock",
    discount: "Wholesale Price",
    rating: 4.7,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-033",
    name: "Tata Sampann Toor Dal (1 kg)",
    category: "Dals & Pulses",
    vendor: "Reliance Mart",
    price: 175.00,
    unit: "1 kg pack",
    availability: "In Stock",
    discount: "Smart Dal Saver",
    rating: 4.6,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-034",
    name: "Tata Sampann Toor Dal (1 kg)",
    category: "Dals & Pulses",
    vendor: "More Supermarket",
    price: 182.00,
    unit: "1 kg pack",
    availability: "In Stock",
    discount: "Standard",
    rating: 4.5,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-035",
    name: "Tata Sampann Toor Dal (1 kg)",
    category: "Dals & Pulses",
    vendor: "BigBasket",
    price: 189.00,
    unit: "1 kg pack",
    availability: "In Stock",
    discount: "BB Royal",
    rating: 4.7,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-036",
    name: "Tata Sampann Toor Dal (1 kg)",
    category: "Dals & Pulses",
    vendor: "Spencer's",
    price: 198.00,
    unit: "1 kg pack",
    availability: "In Stock",
    discount: "Standard",
    rating: 4.8,
    lastUpdated: "2026-11-20"
  },

  // --- Maggi 2-Minute Masala Instant Noodles (Pack of 12 / 840g) ---
  {
    id: "groc-in-037",
    name: "Maggi 2-Minute Masala Noodles (Pack of 12)",
    category: "Snacks & Instant",
    vendor: "D-Mart",
    price: 138.00,
    unit: "840g Family Pack",
    availability: "In Stock",
    discount: "Family Saver Pack",
    rating: 4.9,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-038",
    name: "Maggi 2-Minute Masala Noodles (Pack of 12)",
    category: "Snacks & Instant",
    vendor: "Saravana Stores",
    price: 142.00,
    unit: "840g Family Pack",
    availability: "In Stock",
    discount: "Saravana Super Value",
    rating: 4.8,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-039",
    name: "Maggi 2-Minute Masala Noodles (Pack of 12)",
    category: "Snacks & Instant",
    vendor: "Reliance Mart",
    price: 148.00,
    unit: "840g Family Pack",
    availability: "In Stock",
    discount: "Smart Deal",
    rating: 4.7,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-040",
    name: "Maggi 2-Minute Masala Noodles (Pack of 12)",
    category: "Snacks & Instant",
    vendor: "More Supermarket",
    price: 156.00,
    unit: "840g Family Pack",
    availability: "In Stock",
    discount: "Standard",
    rating: 4.6,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-041",
    name: "Maggi 2-Minute Masala Noodles (Pack of 12)",
    category: "Snacks & Instant",
    vendor: "BigBasket",
    price: 160.00,
    unit: "840g Family Pack",
    availability: "In Stock",
    discount: "Instant 10 Min",
    rating: 4.8,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-042",
    name: "Maggi 2-Minute Masala Noodles (Pack of 12)",
    category: "Snacks & Instant",
    vendor: "Spencer's",
    price: 168.00,
    unit: "840g Family Pack",
    availability: "In Stock",
    discount: "MRP Rate",
    rating: 4.7,
    lastUpdated: "2026-11-20"
  },

  // --- Surf Excel Easy Wash Detergent Powder (1 kg) ---
  {
    id: "groc-in-043",
    name: "Surf Excel Easy Wash Powder (1 kg)",
    category: "Household & Cleaning",
    vendor: "D-Mart",
    price: 132.00,
    unit: "1 kg bag",
    availability: "In Stock",
    discount: "D-Mart Dhamaaka",
    rating: 4.9,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-044",
    name: "Surf Excel Easy Wash Powder (1 kg)",
    category: "Household & Cleaning",
    vendor: "Saravana Stores",
    price: 136.00,
    unit: "1 kg bag",
    availability: "In Stock",
    discount: "Aadi Mega Discount",
    rating: 4.8,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-045",
    name: "Surf Excel Easy Wash Powder (1 kg)",
    category: "Household & Cleaning",
    vendor: "Reliance Mart",
    price: 142.00,
    unit: "1 kg bag",
    availability: "In Stock",
    discount: "Clean Saver",
    rating: 4.7,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-046",
    name: "Surf Excel Easy Wash Powder (1 kg)",
    category: "Household & Cleaning",
    vendor: "More Supermarket",
    price: 148.00,
    unit: "1 kg bag",
    availability: "In Stock",
    discount: "Standard",
    rating: 4.6,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-047",
    name: "Surf Excel Easy Wash Powder (1 kg)",
    category: "Household & Cleaning",
    vendor: "BigBasket",
    price: 152.00,
    unit: "1 kg bag",
    availability: "In Stock",
    discount: "Standard",
    rating: 4.7,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-048",
    name: "Surf Excel Easy Wash Powder (1 kg)",
    category: "Household & Cleaning",
    vendor: "Spencer's",
    price: 158.00,
    unit: "1 kg bag",
    availability: "Limited Stock",
    discount: "Standard",
    rating: 4.8,
    lastUpdated: "2026-11-20"
  },

  // --- Britannia Good Day Cashew Cookies (600g Value Pack) ---
  {
    id: "groc-in-049",
    name: "Britannia Good Day Cashew (600g)",
    category: "Snacks & Instant",
    vendor: "D-Mart",
    price: 105.00,
    unit: "600g Value Pack",
    availability: "In Stock",
    discount: "Buy 1 Save ₹35",
    rating: 4.8,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-050",
    name: "Britannia Good Day Cashew (600g)",
    category: "Snacks & Instant",
    vendor: "Saravana Stores",
    price: 110.00,
    unit: "600g Value Pack",
    availability: "In Stock",
    discount: "Snack Saver",
    rating: 4.7,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-051",
    name: "Britannia Good Day Cashew (600g)",
    category: "Snacks & Instant",
    vendor: "Reliance Mart",
    price: 115.00,
    unit: "600g Value Pack",
    availability: "In Stock",
    discount: "Combo Deal",
    rating: 4.6,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-052",
    name: "Britannia Good Day Cashew (600g)",
    category: "Snacks & Instant",
    vendor: "More Supermarket",
    price: 125.00,
    unit: "600g Value Pack",
    availability: "In Stock",
    discount: "Standard",
    rating: 4.5,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-053",
    name: "Britannia Good Day Cashew (600g)",
    category: "Snacks & Instant",
    vendor: "Spencer's",
    price: 132.00,
    unit: "600g Value Pack",
    availability: "In Stock",
    discount: "Standard",
    rating: 4.6,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-054",
    name: "Britannia Good Day Cashew (600g)",
    category: "Snacks & Instant",
    vendor: "BigBasket",
    price: 135.00,
    unit: "600g Value Pack",
    availability: "In Stock",
    discount: "Standard",
    rating: 4.7,
    lastUpdated: "2026-11-20"
  },

  // --- Amul Pure Cow Ghee Tin (1 Litre) ---
  {
    id: "groc-in-055",
    name: "Amul Pure Cow Ghee Tin (1 Litre)",
    category: "Oils & Ghee",
    vendor: "D-Mart",
    price: 615.00,
    unit: "1 Litre Tin",
    availability: "In Stock",
    discount: "Save ₹65",
    rating: 4.9,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-056",
    name: "Amul Pure Cow Ghee Tin (1 Litre)",
    category: "Oils & Ghee",
    vendor: "Saravana Stores",
    price: 625.00,
    unit: "1 Litre Tin",
    availability: "In Stock",
    discount: "Traditional Rate",
    rating: 4.8,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-057",
    name: "Amul Pure Cow Ghee Tin (1 Litre)",
    category: "Oils & Ghee",
    vendor: "Reliance Mart",
    price: 639.00,
    unit: "1 Litre Tin",
    availability: "In Stock",
    discount: "Festive Smart Offer",
    rating: 4.7,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-058",
    name: "Amul Pure Cow Ghee Tin (1 Litre)",
    category: "Oils & Ghee",
    vendor: "More Supermarket",
    price: 655.00,
    unit: "1 Litre Tin",
    availability: "In Stock",
    discount: "Standard",
    rating: 4.6,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-059",
    name: "Amul Pure Cow Ghee Tin (1 Litre)",
    category: "Oils & Ghee",
    vendor: "BigBasket",
    price: 665.00,
    unit: "1 Litre Tin",
    availability: "In Stock",
    discount: "Genuine Amul",
    rating: 4.8,
    lastUpdated: "2026-11-20"
  },
  {
    id: "groc-in-060",
    name: "Amul Pure Cow Ghee Tin (1 Litre)",
    category: "Oils & Ghee",
    vendor: "Spencer's",
    price: 675.00,
    unit: "1 Litre Tin",
    availability: "In Stock",
    discount: "MRP Rate",
    rating: 4.7,
    lastUpdated: "2026-11-20"
  }
];

const STORAGE_KEYS = {
  PRODUCTS: "smart_grocery_indian_products_v2",
  BASKET: "smart_grocery_indian_basket_v2",
  SETTINGS: "smart_grocery_settings_v2"
};

/**
 * Data Storage Management Service
 */
const DataService = {
  /**
   * Load products from localStorage or initialize with INITIAL_GROCERY_DATA
   */
  getProducts() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Error reading localStorage, reverting to defaults:", e);
    }
    // Initialize default if not present
    this.saveProducts(INITIAL_GROCERY_DATA);
    return [...INITIAL_GROCERY_DATA];
  },

  /**
   * Persist products array to localStorage
   */
  saveProducts(products) {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      return true;
    } catch (e) {
      console.error("Error saving products to localStorage:", e);
      return false;
    }
  },

  /**
   * Reset products back to initial Indian demo data
   */
  resetToDefaults() {
    this.saveProducts(INITIAL_GROCERY_DATA);
    return [...INITIAL_GROCERY_DATA];
  },

  /**
   * Add a new product
   */
  addProduct(productData) {
    const products = this.getProducts();
    const newProduct = {
      id: "groc-in-" + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
      name: productData.name.trim(),
      category: productData.category || "General",
      vendor: productData.vendor.trim(),
      price: parseFloat(productData.price) || 0.00,
      unit: productData.unit ? productData.unit.trim() : "1 unit",
      availability: productData.availability || "In Stock",
      discount: productData.discount ? productData.discount.trim() : "Standard",
      rating: parseFloat(productData.rating) || 4.7,
      lastUpdated: new Date().toISOString().split("T")[0]
    };
    products.unshift(newProduct);
    this.saveProducts(products);
    return newProduct;
  },

  /**
   * Update an existing product
   */
  updateProduct(id, updatedFields) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    products[index] = {
      ...products[index],
      ...updatedFields,
      price: parseFloat(updatedFields.price !== undefined ? updatedFields.price : products[index].price),
      lastUpdated: new Date().toISOString().split("T")[0]
    };
    this.saveProducts(products);
    return products[index];
  },

  /**
   * Delete a product by ID
   */
  deleteProduct(id) {
    let products = this.getProducts();
    const initialLen = products.length;
    products = products.filter(p => p.id !== id);
    if (products.length !== initialLen) {
      this.saveProducts(products);
      return true;
    }
    return false;
  },

  /**
   * Get unique list of product names (for multi-vendor grouping & comparison)
   */
  getUniqueProductNames() {
    const products = this.getProducts();
    const set = new Set();
    products.forEach(p => set.add(p.name));
    return Array.from(set).sort();
  },

  /**
   * Get all vendor offerings for a specific product name
   */
  getVendorsForProduct(productName) {
    const products = this.getProducts();
    return products.filter(p => p.name.toLowerCase() === productName.toLowerCase());
  },

  /**
   * Get all categories
   */
  getCategories() {
    const products = this.getProducts();
    const set = new Set();
    products.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set).sort();
  },

  /**
   * Get all vendors
   */
  getVendors() {
    const products = this.getProducts();
    const set = new Set();
    products.forEach(p => {
      if (p.vendor) set.add(p.vendor);
    });
    return Array.from(set).sort();
  },

  /**
   * Basket operations
   */
  getBasket() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BASKET);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  saveBasket(basket) {
    try {
      localStorage.setItem(STORAGE_KEYS.BASKET, JSON.stringify(basket));
      return true;
    } catch (e) {
      return false;
    }
  },

  addToBasket(productName, quantity = 1) {
    const basket = this.getBasket();
    const existing = basket.find(item => item.productName === productName);
    if (existing) {
      existing.quantity += quantity;
    } else {
      basket.push({ productName, quantity });
    }
    this.saveBasket(basket);
    return basket;
  },

  removeFromBasket(productName) {
    let basket = this.getBasket();
    basket = basket.filter(item => item.productName !== productName);
    this.saveBasket(basket);
    return basket;
  },

  clearBasket() {
    this.saveBasket([]);
    return [];
  }
};

// Expose globally
if (typeof window !== 'undefined') {
  window.DEMO_NOTICE = DEMO_NOTICE;
  window.INITIAL_GROCERY_DATA = INITIAL_GROCERY_DATA;
  window.DataService = DataService;
}
