class CategoryService {
  #categoriesTree = [];
  #_categoriesMappedByLevel = new Map();

  /**
   *  fetches all the categories in tree structure from backend
   */
  async fetch() {
    const result = await fetch("http://localhost:3000/categories/unprotected");
    this.#categoriesTree = await result.json();
    console.log(this.#categoriesTree);

    this.#_categoriesMappedByLevel = this.getChildrenMappedByLevel(
      this.#categoriesTree
    );
  }

  /**
   * gets all available children of the tree and map them by level
   * @param {*} tree the tree to map by level
   * @param {number} baseLevel the provided tree base level
   * @param {Map<number,Array<node>>} map - a map used to avoid mutation
   * @returns the tree mapped by level
   */
  getChildrenMappedByLevel(tree, baseLevel = 1, map = new Map()) {
    const nodes = tree.map((node) => {
      if (node.children) {
        const l = baseLevel + 1;
        this.getChildrenMappedByLevel(node.children, l, map);
      }
      // removing children from object
      const clone = (({ children, ...o }) => o)(node);
      return clone;
    });
    if (nodes.length) {
      // add value to the existing set if available
      const mergedValue = map.has(baseLevel)
        ? [...map.get(baseLevel), ...nodes]
        : nodes;
      map.set(baseLevel, mergedValue);
    }
    return map;
  }

  /**
   * gets all the parents of the given nodes
   * @param {node} node the node to find all its parents
   * @param {*} parents array used to save all parents of the node
   * @returns all parents of the given nodes
   */
  getAllParents(node, parents = []) {
    const parent = this.findNode(node.parentId);
    if (parent) {
      parents.push(parent);
      if (parent.parentId) this.getAllParents(parent, parents);
    }

    return parents;
  }

  /**
   * find node inside a tree
   * @param {number} id id of the node to find
   * @param {categoriesTree} tree tree variable used for recursion
   * @returns the node with the given id
   */
  findNode(id, tree = this.#categoriesTree) {
    for (const el of tree) {
      if (el.id === id) {
        return el;
      }

      if (el.children.length) {
        const found = this.findNode(id, el.children);
        if (found) return found;
      }
    }
  }

  /**
   * returns the mapped categories as an array reversing it to get the correct order
   */
  get categories() {
    return Array.from(this.#_categoriesMappedByLevel.values()).reverse();
  }
}
