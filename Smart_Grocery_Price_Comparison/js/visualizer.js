/**
 * Smart Grocery Price Comparison System
 * Min-Heap Tree and Array Visualizer
 * 
 * College Data Structures Demonstration:
 * Visualizes the Min-Heap binary tree dynamically with SVG,
 * displays index relationships (i, 2i+1, 2i+2, floor((i-1)/2)),
 * and provides step-by-step execution traces for insertions and extract-min.
 */

class HeapVisualizer {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = Object.assign({
      svgWidth: 800,
      svgHeight: 380,
      nodeRadius: 28,
      onNodeClick: null
    }, options);
    this.heapInstance = null;
    this.activeHighlightIndex = null;
  }

  /**
   * Bind a MinHeap instance to this visualizer and render
   */
  bindHeap(minHeap) {
    this.heapInstance = minHeap;
    this.render();
  }

  /**
   * Main render method: draws tree, array, and stats
   */
  render() {
    if (!this.container) return;
    this.container.innerHTML = "";

    if (!this.heapInstance || this.heapInstance.size() === 0) {
      this.container.innerHTML = `
        <div class="empty-visualizer">
          <div class="empty-icon"><i class="fa-solid fa-network-wired"></i></div>
          <p class="empty-title">Heap is currently empty</p>
          <p class="empty-desc">Select a grocery item in "Price Comparison" or insert values below to view the live Min-Heap binary tree.</p>
        </div>
      `;
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "visualizer-content-wrapper";

    // 1. Heap Tree SVG Section
    const treeCard = document.createElement("div");
    treeCard.className = "heap-tree-card";
    treeCard.innerHTML = `
      <div class="tree-card-header">
        <div class="tree-title">
          <i class="fa-solid fa-sitemap text-emerald"></i>
          <span>Min-Heap Complete Binary Tree Representation</span>
        </div>
        <div class="tree-legend">
          <span class="legend-badge root-badge"><span class="legend-dot root-dot"></span> Root / Min Price</span>
          <span class="legend-badge child-badge"><span class="legend-dot child-dot"></span> Internal / Leaf Node</span>
          <span class="legend-badge heap-size-badge">Nodes: <strong>${this.heapInstance.size()}</strong></span>
        </div>
      </div>
      <div class="svg-tree-container" id="svgTreeScroll">
        ${this.generateTreeSvg()}
      </div>
    `;
    wrapper.appendChild(treeCard);

    // 2. Linear Array & Index Mapping Representation Section
    const arrayCard = document.createElement("div");
    arrayCard.className = "heap-array-card";
    arrayCard.innerHTML = `
      <div class="array-card-header">
        <div class="tree-title">
          <i class="fa-solid fa-list-ol text-emerald"></i>
          <span>Array Representation & Index Mathematics</span>
        </div>
        <div class="formula-chips">
          <span class="formula-chip">Parent: <code>⌊(i-1)/2⌋</code></span>
          <span class="formula-chip">Left Child: <code>2i + 1</code></span>
          <span class="formula-chip">Right Child: <code>2i + 2</code></span>
        </div>
      </div>
      <div class="array-grid-container">
        ${this.generateArrayHtml()}
      </div>
    `;
    wrapper.appendChild(arrayCard);

    this.container.appendChild(wrapper);
    this.attachSvgEvents();
  }

  /**
   * Generates dynamic SVG for the binary tree
   */
  generateTreeSvg() {
    const heap = this.heapInstance.getArray();
    const count = heap.length;
    if (count === 0) return "";

    const depth = Math.floor(Math.log2(count)) + 1;
    // Dynamic width based on tree depth
    const computedWidth = Math.max(760, Math.pow(2, depth) * 55);
    const computedHeight = Math.max(340, (depth + 1) * 95);
    const levelHeight = computedHeight / (depth + 1);

    // Calculate node coordinates
    const nodes = [];
    const edges = [];

    for (let i = 0; i < count; i++) {
      const level = Math.floor(Math.log2(i + 1));
      const levelStartIndex = Math.pow(2, level) - 1;
      const indexInLevel = i - levelStartIndex;
      const maxNodesInLevel = Math.pow(2, level);

      const segmentWidth = computedWidth / (maxNodesInLevel + 1);
      const x = (indexInLevel + 1) * segmentWidth;
      const y = (level + 1) * levelHeight - 15;

      const item = heap[i];
      const price = typeof item === 'object' && item !== null && 'price' in item 
        ? Number(item.price) 
        : Number(item);
      const vendor = typeof item === 'object' && item !== null && item.vendor 
        ? item.vendor 
        : '';
      const name = typeof item === 'object' && item !== null && item.name 
        ? item.name 
        : '';

      nodes.push({ index: i, x, y, level, item, price, vendor, name, isRoot: i === 0 });

      if (i > 0) {
        const parentIdx = Math.floor((i - 1) / 2);
        edges.push({
          parentIndex: parentIdx,
          childIndex: i
        });
      }
    }

    // Build SVG string
    let svgContent = `<svg viewBox="0 0 ${computedWidth} ${computedHeight}" class="heap-svg" xmlns="http://www.w3.org/2000/svg">`;

    // Defs for gradients & shadow filters
    svgContent += `
      <defs>
        <filter id="nodeShadow" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.15" />
        </filter>
        <linearGradient id="rootGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#059669" />
          <stop offset="100%" stop-color="#047857" />
        </linearGradient>
        <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="100%" stop-color="#f0fdf4" />
        </linearGradient>
      </defs>
    `;

    // Render Edges (connecting branches)
    edges.forEach(edge => {
      const parentNode = nodes[edge.parentIndex];
      const childNode = nodes[edge.childIndex];
      svgContent += `
        <line 
          x1="${parentNode.x}" 
          y1="${parentNode.y}" 
          x2="${childNode.x}" 
          y2="${childNode.y}" 
          class="tree-branch-line" 
          stroke="#94a3b8" 
          stroke-width="2.5" 
          stroke-dasharray="0"
        />
      `;
    });

    // Render Nodes
    nodes.forEach(node => {
      const isRoot = node.isRoot;
      const circleFill = isRoot ? "url(#rootGradient)" : "url(#nodeGradient)";
      const strokeColor = isRoot ? "#065f46" : "#10b981";
      const textColor = isRoot ? "#ffffff" : "#0f172a";
      const subTextColor = isRoot ? "#d1fae5" : "#059669";
      const strokeWidth = isRoot ? "3" : "2";

      svgContent += `
        <g class="tree-node-group" data-index="${node.index}" data-price="${node.price}" data-vendor="${node.vendor}">
          <!-- Halo on hover / highlight -->
          <circle cx="${node.x}" cy="${node.y}" r="${this.options.nodeRadius + 6}" class="node-halo" fill="transparent" />
          
          <!-- Main Node Circle -->
          <circle 
            cx="${node.x}" 
            cy="${node.y}" 
            r="${this.options.nodeRadius}" 
            fill="${circleFill}" 
            stroke="${strokeColor}" 
            stroke-width="${strokeWidth}" 
            filter="url(#nodeShadow)" 
            class="tree-node-circle ${isRoot ? 'root-circle' : ''}" 
          />

          <!-- Root Crown Icon / Indicator -->
          ${isRoot ? `
            <text x="${node.x}" y="${node.y - 34}" text-anchor="middle" font-size="12" fill="#047857" font-weight="700">
              ★ MIN ROOT
            </text>
          ` : ''}

          <!-- Node Index Tag Pill -->
          <rect 
            x="${node.x - 14}" 
            y="${node.y - this.options.nodeRadius - 8}" 
            width="28" 
            height="15" 
            rx="7" 
            fill="${isRoot ? '#047857' : '#e2e8f0'}" 
            stroke="${isRoot ? '#10b981' : '#cbd5e1'}" 
            stroke-width="1"
          />
          <text 
            x="${node.x}" 
            y="${node.y - this.options.nodeRadius + 3}" 
            text-anchor="middle" 
            font-size="9.5" 
            font-family="system-ui, -apple-system, sans-serif" 
            font-weight="700" 
            fill="${isRoot ? '#ecfdf5' : '#475569'}">
            i=${node.index}
          </text>

          <!-- Price Text in Center of Circle -->
          <text 
            x="${node.x}" 
            y="${node.y + 4}" 
            text-anchor="middle" 
            font-size="13.5" 
            font-weight="800" 
            font-family="system-ui, -apple-system, sans-serif" 
            fill="${textColor}">
            ₹${node.price.toFixed(2)}
          </text>

          <!-- Vendor / Sublabel beneath price -->
          ${node.vendor ? `
            <text 
              x="${node.x}" 
              y="${node.y + 17}" 
              text-anchor="middle" 
              font-size="9" 
              font-weight="700" 
              font-family="system-ui, -apple-system, sans-serif" 
              fill="${subTextColor}">
              ${node.vendor.substring(0, 10)}
            </text>
          ` : ''}
        </g>
      `;
    });

    svgContent += `</svg>`;
    return svgContent;
  }

  /**
   * Generates linear array HTML view with parent and children links
   */
  generateArrayHtml() {
    const heap = this.heapInstance.getArray();
    if (heap.length === 0) return "<p>Heap is empty.</p>";

    let html = `<div class="heap-array-flex">`;

    heap.forEach((item, i) => {
      const price = typeof item === 'object' && item !== null && 'price' in item ? Number(item.price) : Number(item);
      const vendor = typeof item === 'object' && item !== null && item.vendor ? item.vendor : '';
      const isRoot = i === 0;
      const parentIdx = i > 0 ? Math.floor((i - 1) / 2) : '-';
      const leftIdx = 2 * i + 1 < heap.length ? 2 * i + 1 : '-';
      const rightIdx = 2 * i + 2 < heap.length ? 2 * i + 2 : '-';

      html += `
        <div class="array-cell-card ${isRoot ? 'array-cell-root' : ''}" data-index="${i}">
          <div class="cell-index-badge">Index [${i}] ${isRoot ? '• ROOT' : ''}</div>
          <div class="cell-value-price">₹${price.toFixed(2)}</div>
          ${vendor ? `<div class="cell-vendor-name">${vendor}</div>` : ''}
          <div class="cell-pointers">
            <span title="Parent Index">P: <b>${parentIdx}</b></span>
            <span title="Left Child Index">L: <b>${leftIdx}</b></span>
            <span title="Right Child Index">R: <b>${rightIdx}</b></span>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    return html;
  }

  /**
   * Attach tooltip/hover interaction to SVG nodes
   */
  attachSvgEvents() {
    const groups = this.container.querySelectorAll(".tree-node-group");
    const arrayCards = this.container.querySelectorAll(".array-cell-card");

    groups.forEach(g => {
      const idx = g.getAttribute("data-index");
      g.addEventListener("mouseenter", () => {
        g.classList.add("highlighted-node");
        const matchingCard = this.container.querySelector(`.array-cell-card[data-index="${idx}"]`);
        if (matchingCard) matchingCard.classList.add("array-card-active");
      });
      g.addEventListener("mouseleave", () => {
        g.classList.remove("highlighted-node");
        const matchingCard = this.container.querySelector(`.array-cell-card[data-index="${idx}"]`);
        if (matchingCard) matchingCard.classList.remove("array-card-active");
      });
      g.addEventListener("click", () => {
        if (this.options.onNodeClick) {
          this.options.onNodeClick(idx, this.heapInstance.heap[idx]);
        }
      });
    });

    arrayCards.forEach(c => {
      const idx = c.getAttribute("data-index");
      c.addEventListener("mouseenter", () => {
        const matchingNode = this.container.querySelector(`.tree-node-group[data-index="${idx}"]`);
        if (matchingNode) matchingNode.classList.add("highlighted-node");
      });
      c.addEventListener("mouseleave", () => {
        const matchingNode = this.container.querySelector(`.tree-node-group[data-index="${idx}"]`);
        if (matchingNode) matchingNode.classList.remove("highlighted-node");
      });
    });
  }
}

// Expose globally
if (typeof window !== 'undefined') {
  window.HeapVisualizer = HeapVisualizer;
}
