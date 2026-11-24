/**
 * Smart Grocery Price Comparison System
 * Core Data Structure: Min-Heap (Priority Queue) Implementation
 * 
 * College Data Structures Project:
 * "Enhancing Grocery Cost Savings Using a Smart Grocery Price Comparison System 
 *  Compared with Traditional Manual Price Comparison"
 * 
 * Time Complexities:
 * - Insertion: O(log n)
 * - Extract-Min: O(log n)
 * - Peek (Find Min / Root): O(1)
 * - Heapify Up / Down: O(log n)
 * - Build Heap: O(n)
 * - Heap Sort (Ascending Extraction): O(n log n)
 * Space Complexity: O(n)
 */

class MinHeap {
  /**
   * @param {Function} comparator - Custom comparator function. Default compares by .price or direct value.
   */
  constructor(comparator = null) {
    this.heap = [];
    this.logs = [];
    this.comparator = comparator || ((a, b) => {
      const valA = (typeof a === 'object' && a !== null && 'price' in a) ? Number(a.price) : Number(a);
      const valB = (typeof b === 'object' && b !== null && 'price' in b) ? Number(b.price) : Number(b);
      return valA - valB;
    });
  }

  // --- Helper Index Calculations ---
  getParentIndex(i) {
    return Math.floor((i - 1) / 2);
  }

  getLeftChildIndex(i) {
    return 2 * i + 1;
  }

  getRightChildIndex(i) {
    return 2 * i + 2;
  }

  hasParent(i) {
    return this.getParentIndex(i) >= 0;
  }

  hasLeftChild(i) {
    return this.getLeftChildIndex(i) < this.heap.length;
  }

  hasRightChild(i) {
    return this.getRightChildIndex(i) < this.heap.length;
  }

  parent(i) {
    return this.heap[this.getParentIndex(i)];
  }

  leftChild(i) {
    return this.heap[this.getLeftChildIndex(i)];
  }

  rightChild(i) {
    return this.heap[this.getRightChildIndex(i)];
  }

  /**
   * Swap two elements in the heap array
   */
  swap(i, j) {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }

  /**
   * Peek at the minimum element (Root) without removing it.
   * Time Complexity: O(1)
   */
  peek() {
    if (this.heap.length === 0) return null;
    return this.heap[0];
  }

  /**
   * Return size of heap
   */
  size() {
    return this.heap.length;
  }

  /**
   * Check if heap is empty
   */
  isEmpty() {
    return this.heap.length === 0;
  }

  /**
   * Clear all items
   */
  clear() {
    this.heap = [];
    this.logs = [];
  }

  /**
   * Get formatted label for logging/visualization
   */
  formatItem(item) {
    if (typeof item === 'object' && item !== null) {
      const vendor = item.vendor ? ` [${item.vendor}]` : '';
      const name = item.name ? `${item.name}` : '';
      const price = item.price !== undefined ? `₹${Number(item.price).toFixed(2)}` : '';
      return `${vendor || name} ${price}`.trim();
    }
    return `₹${Number(item).toFixed(2)}`;
  }

  /**
   * Insert a new element into the Min-Heap.
   * Places element at end and bubbles it up (Heapify Up).
   * Time Complexity: O(log n)
   */
  insert(item) {
    this.heap.push(item);
    const newIdx = this.heap.length - 1;
    this.logs.push(`Inserted ${this.formatItem(item)} at array index ${newIdx}.`);
    this.heapifyUp(newIdx);
    return this.heap;
  }

  /**
   * Heapify Up: Restores Min-Heap property upwards from child to parent.
   * In a Min-Heap, every parent node must be <= its children.
   * Time Complexity: O(log n)
   */
  heapifyUp(startIndex = null) {
    let index = startIndex !== null ? startIndex : this.heap.length - 1;

    while (this.hasParent(index)) {
      const parentIdx = this.getParentIndex(index);
      const currentItem = this.heap[index];
      const parentItem = this.heap[parentIdx];

      // If current child is strictly smaller than its parent, swap!
      if (this.comparator(currentItem, parentItem) < 0) {
        this.logs.push(
          `Heapify Up Swap: Child index ${index} (${this.formatItem(currentItem)}) is cheaper than Parent index ${parentIdx} (${this.formatItem(parentItem)}). Swapping.`
        );
        this.swap(index, parentIdx);
        index = parentIdx;
      } else {
        // Min-Heap property satisfied
        this.logs.push(
          `Heapify Up Complete: Node (${this.formatItem(currentItem)}) is >= Parent (${this.formatItem(parentItem)}). Heap property verified.`
        );
        break;
      }
    }
  }

  /**
   * Extract the minimum element (Root) from the Min-Heap.
   * Removes root, moves the last element to the root, and bubbles down (Heapify Down).
   * Time Complexity: O(log n)
   */
  extractMin() {
    if (this.heap.length === 0) {
      this.logs.push("Extract-Min failed: Heap is empty.");
      return null;
    }

    if (this.heap.length === 1) {
      const min = this.heap.pop();
      this.logs.push(`Extract-Min: Removed solitary root element ${this.formatItem(min)}.`);
      return min;
    }

    const min = this.heap[0];
    const lastElement = this.heap.pop();
    this.heap[0] = lastElement;
    this.logs.push(
      `Extract-Min: Removed root ${this.formatItem(min)}. Moved last leaf element ${this.formatItem(lastElement)} to root (index 0).`
    );

    this.heapifyDown(0);
    return min;
  }

  /**
   * Heapify Down: Restores Min-Heap property downwards from parent to children.
   * Replaces parent with the smaller of its two children if parent > child.
   * Time Complexity: O(log n)
   */
  heapifyDown(startIndex = 0) {
    let index = startIndex;

    while (this.hasLeftChild(index)) {
      let smallestChildIndex = this.getLeftChildIndex(index);
      const rightChildIdx = this.getRightChildIndex(index);

      // If right child exists and is smaller than left child, select right child
      if (
        this.hasRightChild(index) &&
        this.comparator(this.heap[rightChildIdx], this.heap[smallestChildIndex]) < 0
      ) {
        smallestChildIndex = rightChildIdx;
      }

      // If current element is larger than the smallest child, swap!
      if (this.comparator(this.heap[index], this.heap[smallestChildIndex]) > 0) {
        this.logs.push(
          `Heapify Down Swap: Parent index ${index} (${this.formatItem(this.heap[index])}) is more expensive than Child index ${smallestChildIndex} (${this.formatItem(this.heap[smallestChildIndex])}). Swapping.`
        );
        this.swap(index, smallestChildIndex);
        index = smallestChildIndex;
      } else {
        this.logs.push(
          `Heapify Down Complete: Parent (${this.formatItem(this.heap[index])}) is <= smallest child (${this.formatItem(this.heap[smallestChildIndex])}). Min-heap property satisfied.`
        );
        break;
      }
    }
  }

  /**
   * Build heap from an unsorted array of items.
   * Bottom-up approach: O(n) time complexity.
   */
  buildHeap(items) {
    this.heap = [...items];
    this.logs.push(`Building Min-Heap from ${items.length} items using O(n) bottom-up heap construction.`);
    const firstNonLeafIndex = Math.floor(this.heap.length / 2) - 1;
    for (let i = firstNonLeafIndex; i >= 0; i--) {
      this.heapifyDown(i);
    }
  }

  /**
   * Delete an item by custom predicate or index
   */
  removeByIndex(index) {
    if (index < 0 || index >= this.heap.length) return null;
    const removed = this.heap[index];
    const last = this.heap.pop();

    if (index < this.heap.length) {
      this.heap[index] = last;
      this.heapifyDown(index);
      this.heapifyUp(index);
    }
    this.logs.push(`Removed item ${this.formatItem(removed)} from index ${index}.`);
    return removed;
  }

  /**
   * Ascending Price Ranking (Heap Sort extraction)
   * Continually extracts minimum element to produce a strictly ascending ordered list.
   * Time Complexity: O(n log n)
   */
  getAscendingRankedList() {
    // Clone heap array and comparator so original heap is untouched
    const clone = new MinHeap(this.comparator);
    clone.heap = [...this.heap];

    const ranked = [];
    while (!clone.isEmpty()) {
      ranked.push(clone.extractMin());
    }
    return ranked;
  }

  /**
   * Returns current raw array representation
   */
  getArray() {
    return [...this.heap];
  }

  /**
   * Returns detailed tree node metadata for visualization
   * Node positions (x, y), levels, children links.
   */
  getTreeStructure(svgWidth = 700, svgHeight = 360) {
    if (this.heap.length === 0) return { nodes: [], edges: [] };

    const nodes = [];
    const edges = [];
    const totalLevels = Math.floor(Math.log2(this.heap.length)) + 1;
    const levelHeight = svgHeight / (totalLevels + 1);

    for (let i = 0; i < this.heap.length; i++) {
      const level = Math.floor(Math.log2(i + 1));
      const levelStartIndex = Math.pow(2, level) - 1;
      const indexInLevel = i - levelStartIndex;
      const maxNodesInLevel = Math.pow(2, level);

      // Horizontal spacing
      const segmentWidth = svgWidth / (maxNodesInLevel + 1);
      const x = (indexInLevel + 1) * segmentWidth;
      const y = (level + 1) * levelHeight;

      const item = this.heap[i];
      const isRoot = i === 0;

      nodes.push({
        index: i,
        x,
        y,
        level,
        item,
        isRoot,
        label: this.formatItem(item),
        price: (typeof item === 'object' && item !== null && 'price' in item) ? Number(item.price) : Number(item),
        vendor: item.vendor || '',
        name: item.name || ''
      });

      // Add edge to parent
      if (i > 0) {
        const parentIdx = this.getParentIndex(i);
        edges.push({
          fromIndex: parentIdx,
          toIndex: i
        });
      }
    }

    return { nodes, edges, totalLevels };
  }
}

// Export for browser global window
if (typeof window !== 'undefined') {
  window.MinHeap = MinHeap;
}
