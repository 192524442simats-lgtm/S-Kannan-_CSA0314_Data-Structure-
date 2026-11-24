/**
 * Smart Grocery Price Comparison System - Application Controller
 * 
 * Title: Enhancing Grocery Cost Savings Using a Smart Grocery Price Comparison System
 *        Compared with Traditional Manual Price Comparison
 */

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});

const App = {
  activeSection: "home",
  products: [],
  currentComparisonHeap: null,
  visualizerInstance: null,
  sandboxHeap: null,
  charts: {},

  init() {
    // 1. Load initial products
    this.products = DataService.getProducts();

    // 2. Initialize visualizer instances
    this.sandboxHeap = new MinHeap();
    // Pre-populate sandbox with Indian grocery prices
    [239.00, 245.00, 255.00, 265.00, 279.00, 285.00].forEach(p => this.sandboxHeap.insert({ price: p, vendor: "Demo" }));

    this.visualizerInstance = new HeapVisualizer("treeVisualizerContainer", {
      onNodeClick: (index, item) => {
        this.showToast(`Node i=${index}: ₹${Number(item.price || item).toFixed(2)} ${item.vendor ? '(' + item.vendor + ')' : ''}`, "info");
      }
    });

    // 3. Setup Navigation & Hash Routing
    this.setupNavigation();

    // 4. Setup Event Listeners
    this.setupEventListeners();

    // 5. Render Initial Views
    this.renderHomeStats();
    this.renderProductTable();
    this.populateComparisonDropdown();
    this.runDefaultComparison();
    this.renderVisualizerView();
    this.renderRecommendationDashboard();

    // 6. Handle URL Hash
    const hash = window.location.hash.replace("#", "");
    if (hash && ["home", "products", "compare", "visualizer", "dashboard", "about"].includes(hash)) {
      this.navigateTo(hash);
    } else {
      this.navigateTo("home");
    }
  },

  // ----------------------------------------------------
  // NAVIGATION & ROUTING
  // ----------------------------------------------------
  setupNavigation() {
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = link.getAttribute("data-section");
        this.navigateTo(target);
      });
    });

    // Mobile Hamburger Toggle
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const sidebar = document.getElementById("appSidebar");
    if (mobileMenuBtn && sidebar) {
      mobileMenuBtn.addEventListener("click", () => {
        sidebar.classList.toggle("open");
      });
    }

    // Hash change listener
    window.addEventListener("hashchange", () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && hash !== this.activeSection) {
        this.navigateTo(hash);
      }
    });
  },

  navigateTo(sectionId) {
    this.activeSection = sectionId;
    window.location.hash = sectionId;

    // Update active nav link
    document.querySelectorAll(".nav-link").forEach(link => {
      if (link.getAttribute("data-section") === sectionId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Toggle sections visibility
    document.querySelectorAll(".page-section").forEach(sec => {
      if (sec.id === `section-${sectionId}`) {
        sec.classList.remove("hidden-section");
        sec.classList.add("active-section");
      } else {
        sec.classList.add("hidden-section");
        sec.classList.remove("active-section");
      }
    });

    // Close mobile menu if open
    const sidebar = document.getElementById("appSidebar");
    if (sidebar) sidebar.classList.remove("open");

    // Scroll to top of content
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Section-specific refresh
    if (sectionId === "products") {
      this.renderProductTable();
    } else if (sectionId === "compare") {
      this.populateComparisonDropdown();
    } else if (sectionId === "visualizer") {
      if (this.currentComparisonHeap && this.currentComparisonHeap.size() > 0) {
        this.visualizerInstance.bindHeap(this.currentComparisonHeap);
      } else {
        this.visualizerInstance.bindHeap(this.sandboxHeap);
      }
    } else if (sectionId === "dashboard") {
      this.renderRecommendationDashboard();
      this.initDashboardCharts();
    } else if (sectionId === "home") {
      this.renderHomeStats();
    }
  },

  // ----------------------------------------------------
  // HOME PAGE STATS
  // ----------------------------------------------------
  renderHomeStats() {
    const products = DataService.getProducts();
    const uniqueProducts = DataService.getUniqueProductNames();
    const vendors = DataService.getVendors();
    const categories = DataService.getCategories();

    const statProds = document.getElementById("statTotalProducts");
    const statUnique = document.getElementById("statUniqueItems");
    const statVendors = document.getElementById("statTotalVendors");
    const statCategories = document.getElementById("statCategories");

    if (statProds) statProds.textContent = products.length;
    if (statUnique) statUnique.textContent = uniqueProducts.length;
    if (statVendors) statVendors.textContent = vendors.length;
    if (statCategories) statCategories.textContent = categories.length;

    // Calculate sample max saving across catalog
    let totalMaxDiff = 0;
    uniqueProducts.forEach(name => {
      const items = DataService.getVendorsForProduct(name);
      if (items.length > 1) {
        const prices = items.map(p => p.price);
        totalMaxDiff += (Math.max(...prices) - Math.min(...prices));
      }
    });
    const statSavings = document.getElementById("statPotentialSavings");
    if (statSavings) statSavings.textContent = `₹${totalMaxDiff.toFixed(2)}`;
  },

  // ----------------------------------------------------
  // MODULE 1: PRODUCT DATA MANAGEMENT
  // ----------------------------------------------------
  renderProductTable() {
    this.products = DataService.getProducts();
    const tbody = document.getElementById("productTableBody");
    const countBadge = document.getElementById("productCountBadge");

    if (!tbody) return;

    // Filter values
    const searchTerm = (document.getElementById("productSearchInput")?.value || "").toLowerCase().trim();
    const selectedCategory = document.getElementById("productCategoryFilter")?.value || "ALL";
    const selectedVendor = document.getElementById("productVendorFilter")?.value || "ALL";
    const selectedAvailability = document.getElementById("productAvailabilityFilter")?.value || "ALL";
    const sortBy = document.getElementById("productSortSelect")?.value || "name_asc";

    // Populate category and vendor filters if needed
    this.populateFilterDropdowns();

    // Filter
    let filtered = this.products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm) || 
                          p.vendor.toLowerCase().includes(searchTerm) ||
                          p.category.toLowerCase().includes(searchTerm);
      const matchCat = selectedCategory === "ALL" || p.category === selectedCategory;
      const matchVendor = selectedVendor === "ALL" || p.vendor === selectedVendor;
      const matchAvail = selectedAvailability === "ALL" || p.availability === selectedAvailability;
      return matchSearch && matchCat && matchVendor && matchAvail;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price_asc": return a.price - b.price;
        case "price_desc": return b.price - a.price;
        case "name_asc": return a.name.localeCompare(b.name);
        case "name_desc": return b.name.localeCompare(a.name);
        case "vendor_asc": return a.vendor.localeCompare(b.vendor);
        default: return 0;
      }
    });

    if (countBadge) countBadge.textContent = `${filtered.length} products found`;

    // Render Table Rows
    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center py-8 text-slate-500">
            <i class="fa-solid fa-box-open text-3xl mb-2 block"></i>
            No grocery items match the search filters. Try clearing filters or adding a product.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(p => {
      const availClass = p.availability === "In Stock" 
        ? "badge-instock" 
        : (p.availability === "Limited Stock" ? "badge-limited" : "badge-outofstock");

      return `
        <tr data-id="${p.id}">
          <td class="font-semibold text-slate-800">
            <div class="product-name-cell">
              <span>${this.escapeHtml(p.name)}</span>
              ${p.discount && p.discount !== 'Standard' ? `<span class="discount-pill">${this.escapeHtml(p.discount)}</span>` : ''}
            </div>
          </td>
          <td><span class="category-chip">${this.escapeHtml(p.category)}</span></td>
          <td>
            <span class="vendor-tag vendor-${this.slugify(p.vendor)}">
              <i class="fa-solid fa-store"></i> ${this.escapeHtml(p.vendor)}
            </span>
          </td>
          <td class="font-bold text-emerald-700 text-base">
            ₹${Number(p.price).toFixed(2)}
            <span class="text-xs text-slate-400 font-normal">/ ${this.escapeHtml(p.unit || 'unit')}</span>
          </td>
          <td>
            <span class="availability-badge ${availClass}">
              <span class="status-indicator"></span>
              ${this.escapeHtml(p.availability)}
            </span>
          </td>
          <td class="text-xs text-slate-500">${p.lastUpdated || '2026-11-20'}</td>
          <td class="text-right whitespace-nowrap">
            <button 
              class="btn btn-sm btn-outline-emerald" 
              title="Compare Across Vendors using Min-Heap" 
              onclick="App.quickCompare('${encodeURIComponent(p.name)}')">
              <i class="fa-solid fa-scale-balanced"></i> Compare
            </button>
          </td>
        </tr>
      `;
    }).join("");
  },

  populateFilterDropdowns() {
    const catSelect = document.getElementById("productCategoryFilter");
    const vendorSelect = document.getElementById("productVendorFilter");

    if (catSelect && catSelect.children.length <= 1) {
      const categories = DataService.getCategories();
      categories.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c;
        opt.textContent = c;
        catSelect.appendChild(opt);
      });
    }

    if (vendorSelect && vendorSelect.children.length <= 1) {
      const vendors = DataService.getVendors();
      vendors.forEach(v => {
        const opt = document.createElement("option");
        opt.value = v;
        opt.textContent = v;
        vendorSelect.appendChild(opt);
      });
    }
  },

  resetDemoData() {
    if (confirm("Reset all products back to the original demonstration grocery catalog?")) {
      DataService.resetToDefaults();
      this.showToast("Demonstration grocery catalog restored!", "success");
      this.renderProductTable();
      this.renderHomeStats();
      this.populateComparisonDropdown();
      this.runDefaultComparison();
    }
  },

  // ----------------------------------------------------
  // MODULE 2: MIN HEAP PRICE COMPARISON & RANKING
  // ----------------------------------------------------
  populateComparisonDropdown() {
    const select = document.getElementById("comparisonProductSelect");
    if (!select) return;

    const uniqueNames = DataService.getUniqueProductNames();
    const currentVal = select.value;
    select.innerHTML = `<option value="" disabled>-- Select a Grocery Item to Compare Across Stores --</option>`;

    uniqueNames.forEach(name => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      select.appendChild(opt);
    });

    if (currentVal && uniqueNames.includes(currentVal)) {
      select.value = currentVal;
    } else if (uniqueNames.length > 0) {
      select.value = uniqueNames[0]; // Default to first item
    }
  },

  quickCompare(encodedName) {
    const name = decodeURIComponent(encodedName);
    this.navigateTo("compare");
    const select = document.getElementById("comparisonProductSelect");
    if (select) {
      select.value = name;
      this.runComparisonForProduct(name);
    }
  },

  runDefaultComparison() {
    const select = document.getElementById("comparisonProductSelect");
    if (select && select.value) {
      this.runComparisonForProduct(select.value);
    } else {
      const uniqueNames = DataService.getUniqueProductNames();
      if (uniqueNames.length > 0) {
        this.runComparisonForProduct(uniqueNames[0]);
      }
    }
  },

  runComparisonForProduct(productName) {
    if (!productName) return;

    const vendorItems = DataService.getVendorsForProduct(productName);
    const container = document.getElementById("comparisonResultsContainer");
    const rootBadgeContainer = document.getElementById("minHeapRootHighlight");
    const logsContainer = document.getElementById("heapLogsOutput");
    const rankedListContainer = document.getElementById("ascendingRankedVendors");

    if (vendorItems.length === 0) {
      if (container) {
        container.innerHTML = `<p class="p-6 text-center text-slate-500">No vendors found for "${productName}".</p>`;
      }
      return;
    }

    // 1. Create a fresh real Min-Heap instance
    const minHeap = new MinHeap();
    this.currentComparisonHeap = minHeap;

    // 2. Insert items one by one into the MinHeap
    vendorItems.forEach(item => {
      minHeap.insert(item);
    });

    // 3. Root is the absolute minimum price (O(1) peek)
    const rootItem = minHeap.peek();

    // 4. Extract all items in ascending order using repeated extract-min (Heap Sort O(n log n))
    const ascendingRanked = minHeap.getAscendingRankedList();

    // 5. Calculate Savings vs Highest and Average
    const lowestPrice = rootItem.price;
    const highestPrice = ascendingRanked[ascendingRanked.length - 1].price;
    const worstVendor = ascendingRanked[ascendingRanked.length - 1].vendor;
    const sumPrice = ascendingRanked.reduce((acc, curr) => acc + curr.price, 0);
    const avgPrice = sumPrice / ascendingRanked.length;

    const maxDollarSaving = highestPrice - lowestPrice;
    const maxPercentSaving = highestPrice > 0 ? ((maxDollarSaving / highestPrice) * 100) : 0;
    const avgDollarSaving = avgPrice - lowestPrice;

    // 6. Update Root Highlight UI
    if (rootBadgeContainer) {
      rootBadgeContainer.innerHTML = `
        <div class="root-showcase-card">
          <div class="root-badge-header">
            <span class="crown-icon"><i class="fa-solid fa-crown text-amber-400"></i> MIN HEAP ROOT (O(1) PEEK)</span>
            <span class="vendor-tag vendor-${this.slugify(rootItem.vendor)}">${rootItem.vendor}</span>
          </div>
          <div class="root-price-row">
            <div class="root-price-val">₹${Number(rootItem.price).toFixed(2)}</div>
            <div class="root-unit-text">${rootItem.unit || 'unit'} • ${rootItem.availability}</div>
          </div>
          <div class="root-savings-banner">
            <i class="fa-solid fa-circle-check text-emerald-600"></i>
            <span>Cheapest vendor! Save <strong>₹${maxDollarSaving.toFixed(2)} (${maxPercentSaving.toFixed(1)}%)</strong> vs ${worstVendor} (₹${highestPrice.toFixed(2)})</span>
          </div>
        </div>
      `;
    }

    // 7. Update Stats Summary Grid
    const statCards = document.getElementById("comparisonMetricsGrid");
    if (statCards) {
      statCards.innerHTML = `
        <div class="metric-card">
          <div class="metric-label">Vendors Analyzed</div>
          <div class="metric-value">${vendorItems.length} stores</div>
          <div class="metric-sub">Min-Heap size: n = ${vendorItems.length}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Root (Lowest Price)</div>
          <div class="metric-value text-emerald-700">₹${lowestPrice.toFixed(2)}</div>
          <div class="metric-sub">${rootItem.vendor}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Max Price (Worst)</div>
          <div class="metric-value text-rose-600">₹${highestPrice.toFixed(2)}</div>
          <div class="metric-sub">${worstVendor}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Potential Savings</div>
          <div class="metric-value text-emerald-600">₹${maxDollarSaving.toFixed(2)}</div>
          <div class="metric-sub">${maxPercentSaving.toFixed(1)}% Cost Reduction</div>
        </div>
      `;
    }

    // 8. Update Ascending Ranked List (Heap Sort output)
    if (rankedListContainer) {
      rankedListContainer.innerHTML = ascendingRanked.map((item, rank) => {
        const isBest = rank === 0;
        const diffFromMin = item.price - lowestPrice;
        const diffText = isBest 
          ? `<span class="badge-best-root"><i class="fa-solid fa-trophy"></i> Best Price (Root)</span>`
          : `<span class="badge-more-expensive">+₹${diffFromMin.toFixed(2)} (+${((diffFromMin / lowestPrice) * 100).toFixed(0)}%)</span>`;

        return `
          <div class="ranked-vendor-row ${isBest ? 'ranked-root-highlight' : ''}">
            <div class="rank-position">#${rank + 1}</div>
            <div class="rank-vendor-info">
              <div class="rank-vendor-name">
                <span class="vendor-tag vendor-${this.slugify(item.vendor)}">${item.vendor}</span>
                <span class="rank-avail-text">${item.availability}</span>
              </div>
              <div class="rank-discount-text text-xs text-slate-500">${item.discount || 'Standard Price'}</div>
            </div>
            <div class="rank-price-info">
              <div class="rank-price-val">₹${Number(item.price).toFixed(2)}</div>
              <div>${diffText}</div>
            </div>
            <div class="rank-action">
              <button class="btn-sm btn-outline-emerald" onclick="App.addSelectedToBasket('${encodeURIComponent(item.name)}')">
                <i class="fa-solid fa-cart-plus"></i> Add
              </button>
            </div>
          </div>
        `;
      }).join("");
    }

    // 9. Update Real Heap Operation Trace Logs
    if (logsContainer) {
      logsContainer.innerHTML = minHeap.logs.map((log, index) => {
        let icon = '<i class="fa-solid fa-angle-right text-emerald-500"></i>';
        if (log.includes("Swapping")) icon = '<i class="fa-solid fa-arrows-rotate text-amber-500"></i>';
        if (log.includes("Extract-Min")) icon = '<i class="fa-solid fa-minus text-rose-500"></i>';
        if (log.includes("Inserted")) icon = '<i class="fa-solid fa-plus text-emerald-600"></i>';

        return `<div class="heap-log-entry"><span class="log-step">Step ${index + 1}</span> ${icon} <span>${this.escapeHtml(log)}</span></div>`;
      }).join("");
    }

    // 10. Automatically update visualizer tree if visualizer is open or bound
    if (this.visualizerInstance) {
      this.visualizerInstance.bindHeap(minHeap);
    }
  },

  viewHeapInVisualizer() {
    this.navigateTo("visualizer");
    if (this.currentComparisonHeap && this.currentComparisonHeap.size() > 0) {
      this.visualizerInstance.bindHeap(this.currentComparisonHeap);
    }
  },

  // ----------------------------------------------------
  // MODULE 4: MIN HEAP VISUALIZATION & INTERACTIVE SANDBOX
  // ----------------------------------------------------
  renderVisualizerView() {
    const targetHeap = (this.currentComparisonHeap && this.currentComparisonHeap.size() > 0)
      ? this.currentComparisonHeap
      : this.sandboxHeap;

    if (this.visualizerInstance) {
      this.visualizerInstance.bindHeap(targetHeap);
    }
  },

  sandboxInsert() {
    const valInput = document.getElementById("sandboxPriceInput");
    const vendorInput = document.getElementById("sandboxVendorInput");
    const price = parseFloat(valInput?.value);
    const vendor = vendorInput?.value?.trim() || "Store";

    if (isNaN(price) || price <= 0) {
      this.showToast("Please enter a valid numeric price.", "error");
      return;
    }

    const currentHeap = (this.currentComparisonHeap && this.currentComparisonHeap.size() > 0)
      ? this.currentComparisonHeap
      : this.sandboxHeap;

    currentHeap.insert({ price, vendor, name: "Item" });
    this.visualizerInstance.bindHeap(currentHeap);
    this.showToast(`Inserted ₹${price.toFixed(2)} (${vendor}). Heapify-Up restored Min-Heap!`, "success");

    if (valInput) valInput.value = "";
    this.renderSandboxLogs(currentHeap);
  },

  sandboxExtractMin() {
    const currentHeap = (this.currentComparisonHeap && this.currentComparisonHeap.size() > 0)
      ? this.currentComparisonHeap
      : this.sandboxHeap;

    if (currentHeap.isEmpty()) {
      this.showToast("Heap is already empty!", "error");
      return;
    }

    const min = currentHeap.extractMin();
    this.visualizerInstance.bindHeap(currentHeap);
    const priceStr = min ? `₹${Number(min.price || min).toFixed(2)}` : '';
    this.showToast(`Extract-Min removed root: ${priceStr}. Heapify-Down restored Min-Heap!`, "info");
    this.renderSandboxLogs(currentHeap);
  },

  sandboxClear() {
    const currentHeap = (this.currentComparisonHeap && this.currentComparisonHeap.size() > 0)
      ? this.currentComparisonHeap
      : this.sandboxHeap;

    currentHeap.clear();
    this.visualizerInstance.bindHeap(currentHeap);
    this.showToast("Heap cleared.", "info");
    this.renderSandboxLogs(currentHeap);
  },

  renderSandboxLogs(heap) {
    const logsEl = document.getElementById("sandboxLogs");
    if (!logsEl) return;
    logsEl.innerHTML = heap.logs.slice(-8).map((l, i) => `
      <div class="heap-log-entry-sm">
        <i class="fa-solid fa-terminal text-emerald-600 text-xs"></i> ${this.escapeHtml(l)}
      </div>
    `).join("");
  },

  // ----------------------------------------------------
  // MODULE 5: RECOMMENDATION & USER DASHBOARD
  // ----------------------------------------------------
  renderRecommendationDashboard() {
    const uniqueProducts = DataService.getUniqueProductNames();
    const vendors = DataService.getVendors();

    // 1. Leaderboard: Which store has the most lowest prices?
    const vendorWinCounts = {};
    vendors.forEach(v => vendorWinCounts[v] = 0);

    uniqueProducts.forEach(name => {
      const items = DataService.getVendorsForProduct(name);
      if (items.length > 0) {
        const heap = new MinHeap();
        items.forEach(it => heap.insert(it));
        const root = heap.peek();
        if (root && root.vendor) {
          vendorWinCounts[root.vendor] = (vendorWinCounts[root.vendor] || 0) + 1;
        }
      }
    });

    const leaderboardEl = document.getElementById("cheapestVendorsLeaderboard");
    if (leaderboardEl) {
      const sortedVendors = Object.entries(vendorWinCounts).sort((a, b) => b[1] - a[1]);
      leaderboardEl.innerHTML = sortedVendors.map(([vendor, count], idx) => `
        <div class="leaderboard-item ${idx === 0 ? 'leaderboard-champion' : ''}">
          <div class="leaderboard-rank">#${idx + 1}</div>
          <div class="leaderboard-info">
            <span class="vendor-tag vendor-${this.slugify(vendor)}">${vendor}</span>
            <div class="text-xs text-slate-500">${count} items at lowest root price</div>
          </div>
          <div class="leaderboard-score">
            <div class="score-badge">${((count / uniqueProducts.length) * 100).toFixed(0)}%</div>
            <div class="score-sub">Dominance</div>
          </div>
        </div>
      `).join("");
    }

    // 2. Best Deals & Rollbacks Showcase
    const dealsEl = document.getElementById("bestDealsContainer");
    if (dealsEl) {
      const allProducts = DataService.getProducts();
      const dealProducts = allProducts.filter(p => p.discount && p.discount !== "Standard").slice(0, 4);
      dealsEl.innerHTML = dealProducts.map(p => `
        <div class="deal-card">
          <div class="deal-badge"><i class="fa-solid fa-tag"></i> ${this.escapeHtml(p.discount)}</div>
          <div class="deal-prod-name">${this.escapeHtml(p.name)}</div>
          <div class="deal-meta">
            <span class="vendor-tag vendor-${this.slugify(p.vendor)}">${p.vendor}</span>
            <span class="deal-price">₹${Number(p.price).toFixed(2)}</span>
          </div>
          <button class="btn-sm btn-outline-emerald w-full mt-2" onclick="App.quickCompare('${encodeURIComponent(p.name)}')">
            <i class="fa-solid fa-chart-simple"></i> Compare in Heap
          </button>
        </div>
      `).join("");
    }

    // 3. Render Cart/Basket Savings Simulation
    this.renderBasketSimulator();
  },

  renderBasketSimulator() {
    const basketContainer = document.getElementById("basketItemsList");
    const basket = DataService.getBasket();
    const uniqueProducts = DataService.getUniqueProductNames();

    // Initialize sample basket if empty
    if (basket.length === 0 && uniqueProducts.length >= 3) {
      DataService.addToBasket(uniqueProducts[0], 1);
      DataService.addToBasket(uniqueProducts[1], 1);
      DataService.addToBasket(uniqueProducts[2], 1);
    }

    const currentBasket = DataService.getBasket();

    // Populate Basket dropdown selector
    const basketSelect = document.getElementById("addBasketSelect");
    if (basketSelect) {
      basketSelect.innerHTML = `<option value="" disabled selected>-- Choose grocery item to add to basket --</option>`;
      uniqueProducts.forEach(name => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        basketSelect.appendChild(opt);
      });
    }

    if (basketContainer) {
      if (currentBasket.length === 0) {
        basketContainer.innerHTML = `<p class="p-4 text-center text-slate-500">Your basket is empty. Add grocery items above!</p>`;
      } else {
        basketContainer.innerHTML = currentBasket.map(item => {
          // Find lowest price for this item using Min-Heap
          const vendorItems = DataService.getVendorsForProduct(item.productName);
          let lowestPrice = 0;
          let lowestVendor = "N/A";
          if (vendorItems.length > 0) {
            const h = new MinHeap();
            vendorItems.forEach(v => h.insert(v));
            const root = h.peek();
            lowestPrice = root.price;
            lowestVendor = root.vendor;
          }

          return `
            <div class="basket-row">
              <div class="basket-item-title">
                <strong>${this.escapeHtml(item.productName)}</strong>
                <div class="text-xs text-emerald-700 font-semibold">Min-Heap Root: ₹${lowestPrice.toFixed(2)} at ${lowestVendor}</div>
              </div>
              <div class="basket-qty">Qty: ${item.quantity}</div>
              <div class="basket-subtotal font-bold text-slate-800">₹${(lowestPrice * item.quantity).toFixed(2)}</div>
              <button class="btn-icon-danger" title="Remove" onclick="App.removeBasketItem('${encodeURIComponent(item.productName)}')">
                <i class="fa-regular fa-trash-can"></i>
              </button>
            </div>
          `;
        }).join("");
      }
    }

    // Calculate Comparative Basket Totals
    this.calculateComparativeSavings(currentBasket);
  },

  calculateComparativeSavings(basket) {
    if (basket.length === 0) return;

    let smartTotal = 0;
    let worstTotal = 0;
    let singleVendorTotals = {};
    const vendors = DataService.getVendors();
    vendors.forEach(v => singleVendorTotals[v] = 0);

    basket.forEach(bItem => {
      const vendorItems = DataService.getVendorsForProduct(bItem.productName);
      if (vendorItems.length > 0) {
        const heap = new MinHeap();
        vendorItems.forEach(v => heap.insert(v));

        const ranked = heap.getAscendingRankedList();
        const rootMin = ranked[0];
        const maxWorst = ranked[ranked.length - 1];

        smartTotal += (rootMin.price * bItem.quantity);
        worstTotal += (maxWorst.price * bItem.quantity);

        vendors.forEach(v => {
          const match = vendorItems.find(it => it.vendor === v);
          if (match) {
            singleVendorTotals[v] += (match.price * bItem.quantity);
          } else {
            // If vendor does not carry, estimate with average
            singleVendorTotals[v] += (rootMin.price * bItem.quantity);
          }
        });
      }
    });

    const netSaving = worstTotal - smartTotal;
    const pctSaving = worstTotal > 0 ? ((netSaving / worstTotal) * 100) : 0;
    const weeklySpend = smartTotal;
    const projectedAnnualSaving = netSaving * 52; // 52 weeks

    const totalEl = document.getElementById("basketSmartTotal");
    const worstEl = document.getElementById("basketWorstTotal");
    const savingEl = document.getElementById("basketNetSavings");
    const annualEl = document.getElementById("basketAnnualSavings");

    if (totalEl) totalEl.textContent = `₹${smartTotal.toFixed(2)}`;
    if (worstEl) worstEl.textContent = `₹${worstTotal.toFixed(2)}`;
    if (savingEl) savingEl.textContent = `₹${netSaving.toFixed(2)} (${pctSaving.toFixed(1)}%)`;
    if (annualEl) annualEl.textContent = `₹${projectedAnnualSaving.toFixed(2)}/yr`;
  },

  addSelectedToBasket(encodedName) {
    const name = decodeURIComponent(encodedName);
    DataService.addToBasket(name, 1);
    this.showToast(`Added "${name}" to recommendation basket!`, "success");
    this.renderBasketSimulator();
  },

  addCustomBasketItem() {
    const select = document.getElementById("addBasketSelect");
    if (!select || !select.value) {
      this.showToast("Please select a product to add.", "error");
      return;
    }
    DataService.addToBasket(select.value, 1);
    this.showToast(`Added "${select.value}" to basket.`, "success");
    this.renderBasketSimulator();
  },

  removeBasketItem(encodedName) {
    const name = decodeURIComponent(encodedName);
    DataService.removeFromBasket(name);
    this.renderBasketSimulator();
  },

  clearBasket() {
    DataService.clearBasket();
    this.renderBasketSimulator();
  },

  initDashboardCharts() {
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') return;

    // Chart 1: Vendor Store Price Comparison Bar Chart
    const ctx1 = document.getElementById("vendorPriceChart")?.getContext("2d");
    if (ctx1) {
      if (this.charts.vendorChart) this.charts.vendorChart.destroy();

      const vendors = DataService.getVendors();
      const products = DataService.getProducts();

      // Calculate average price per vendor across inventory
      const vendorAverages = vendors.map(v => {
        const vendorProds = products.filter(p => p.vendor === v);
        if (vendorProds.length === 0) return 0;
        const sum = vendorProds.reduce((a, b) => a + b.price, 0);
        return (sum / vendorProds.length).toFixed(2);
      });

      this.charts.vendorChart = new Chart(ctx1, {
        type: 'bar',
        data: {
          labels: vendors,
          datasets: [{
            label: 'Average Grocery Price (₹)',
            data: vendorAverages,
            backgroundColor: [
              '#10b981', // Emerald
              '#047857', // Dark Emerald
              '#34d399', // Mint
              '#059669', // Teal green
              '#6ee7b7', // Light green
              '#022c22'  // Deep forest
            ],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => `Avg Price: ₹${ctx.parsed.y}`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { callback: (val) => `₹${val}` }
            }
          }
        }
      });
    }

    // Chart 2: Category Distribution
    const ctx2 = document.getElementById("categoryDistributionChart")?.getContext("2d");
    if (ctx2) {
      if (this.charts.categoryChart) this.charts.categoryChart.destroy();

      const categories = DataService.getCategories();
      const products = DataService.getProducts();
      const counts = categories.map(cat => products.filter(p => p.category === cat).length);

      this.charts.categoryChart = new Chart(ctx2, {
        type: 'doughnut',
        data: {
          labels: categories,
          datasets: [{
            data: counts,
            backgroundColor: [
              '#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#047857', '#065f46'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12 } }
          }
        }
      });
    }
  },

  // ----------------------------------------------------
  // EVENT LISTENERS & UI HELPERS
  // ----------------------------------------------------
  setupEventListeners() {
    // Product table filters
    const searchInput = document.getElementById("productSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", () => this.renderProductTable());
    }

    const catFilter = document.getElementById("productCategoryFilter");
    if (catFilter) {
      catFilter.addEventListener("change", () => this.renderProductTable());
    }

    const vendorFilter = document.getElementById("productVendorFilter");
    if (vendorFilter) {
      vendorFilter.addEventListener("change", () => this.renderProductTable());
    }

    const availFilter = document.getElementById("productAvailabilityFilter");
    if (availFilter) {
      availFilter.addEventListener("change", () => this.renderProductTable());
    }

    const sortSelect = document.getElementById("productSortSelect");
    if (sortSelect) {
      sortSelect.addEventListener("change", () => this.renderProductTable());
    }


    // Compare dropdown change
    const compSelect = document.getElementById("comparisonProductSelect");
    if (compSelect) {
      compSelect.addEventListener("change", () => {
        this.runComparisonForProduct(compSelect.value);
      });
    }
  },

  showToast(message, type = "info") {
    let container = document.getElementById("toastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast-pill toast-${type}`;
    let icon = "fa-circle-info";
    if (type === "success") icon = "fa-circle-check";
    if (type === "error") icon = "fa-triangle-exclamation";

    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${this.escapeHtml(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("toast-fadeout");
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  },

  escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  },

  slugify(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  }
};

// Global Exposure
if (typeof window !== 'undefined') {
  window.App = App;
}
