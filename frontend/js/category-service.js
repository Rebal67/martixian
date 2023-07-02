class CategoryService {
  categoriesTree = [];
  categoriesMappedByLevel = new Map();

  /**
   *  fetches categoriestree from backend
   */
  fetch() {
    this.categoriesTree = [
      {
        id: 1,
        name: "a",
        parent: null,
        chidren: [
          {
            id: 4,
            name: "aa",
            parent: 1,
            chidren: [
              {
                parent: 4,
                name: "aaa",
                id: 8,
                chidren: [],
              },
            ],
          },
          {
            id: 5,
            name: "ab",
            parent: 1,
            chidren: [],
          },
          {
            id: 6,
            name: "ac",
            parent: 1,
            chidren: [],
          },
        ],
      },
      {
        id: 2,
        name: "b",
        parent: null,
        chidren: [
          {
            id: 7,
            name: "ba",
            parent: 2,
            chidren: [],
          },
        ],
      },
      {
        id: 3,
        name: "c",
        parent: null,
        chidren: [],
      },
    ];

    const r = this.getChildrenMappedByLevel(this.categoriesTree[1].chidren, 2);
    console.log(r);
  }

  getChildrenMappedByLevel(tree, baseLevel = 1, map = new Map()) {
    const nodes = tree.map((node) => {
      if (node.chidren) {
        const l = baseLevel + 1;
        this.getChildrenMappedByLevel(node.chidren, l, map);
      }
      // removing children from object
      const clone = (({ chidren, ...o }) => o)(node);
      return clone;
    });
    if (nodes.length) {
      const mergedValue = map.has(baseLevel)
        ? [...map.get(baseLevel), ...nodes]
        : nodes;
      map.set(baseLevel, mergedValue);
    }
    return map;
  }
}
