class CategoryService {
  #categoriesTree = [];
  #_categoriesMappedByLevel = new Map();

  /**
   *  fetches all the categories in tree structure from backend
   */
  fetch() {
    this.#categoriesTree = [
      {
        id: 1,
        name: "a",
        parent: null,
        children: [
          {
            id: 4,
            name: "aa",
            parent: 1,
            children: [
              {
                parent: 4,
                name: "aaa",
                id: 8,
                children: [{ id: 32, parent: 8, name: "aaaa", children: [] }],
              },
              {
                parent: 4,
                name: "aab",
                children: [],
                id: 17,
              },
            ],
          },
          {
            id: 5,
            name: "ab",
            parent: 1,
            children: [
              {
                id: 12,
                parent: 5,
                name: "aba",
                children: [],
              },
            ],
          },
          {
            id: 6,
            name: "ac",
            parent: 1,
            children: [],
          },
        ],
      },
      {
        id: 2,
        name: "b",
        parent: null,
        children: [
          {
            id: 7,
            name: "ba",
            parent: 2,
            children: [
              {
                id: 13,
                parent: 7,
                name: "baa",
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: 3,
        name: "c",
        parent: null,
        children: [],
      },
    ];

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
    const parent = this.findNode(node.parent);
    if (parent) {
      parents.push(parent);
      if (parent.parent) this.getAllParents(parent, parents);
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
