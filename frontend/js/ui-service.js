class UiService {
  #categoryService;
  #categories;
  #selects;
  #selected = [];

  constructor(categoryService) {
    this.#categoryService = categoryService;
  }
  /**
   * initiate the app and fetches the data
   */
  async init() {
    this.#categoryService.fetch();
    this.#categories = this.#categoryService.categories;
    this.#bootstrap();
  }

  /**
   * render or rerender the Selects
   */
  #bootstrap() {
    this.#selects = this.createSelects();
    const container = document.querySelector("#container");
    container.innerHTML = ``;
    container.append(...this.#selects);
  }

  /**
   * create array of select element and putting default selected value
   * @returns array of select element
   */
  createSelects() {
    const selects = [];
    for (const [level, categories] of this.#categories.entries()) {
      const select = this.#createSelect(level, categories);
      this.$setSelected(select, level);
      selects.push(select);
    }
    return selects;
  }

  /**
   * create select element and add even listeners on change
   * @param {number} level level of the selects
   * @param {category} categories the categories to be used in the options of the select
   * @returns select element
   */
  #createSelect(level, categories) {
    const select = document.createElement("select");
    select.dataset.level = level;
    select.appendChild(this.#createOption(null, "choose a category"));

    for (const category of categories) {
      select.appendChild(this.#createOption(category.id, category.name));
    }

    select.addEventListener("change", (event) => {
      this.#selectListener(event);
    });
    return select;
  }

  /**
   * handles event when select element changes
   * @param {changeEvent} event select change event
   */
  #selectListener(event) {
    const level = parseInt(event.target.dataset.level);
    const id = parseInt(event.target.value);

    const node = this.#categoryService.findNode(id);
    const parents = this.#categoryService.getAllParents(node).reverse();
    const children = this.#categoryService.getChildrenMappedByLevel(
      node.children,
      level
    );

    // array of selected values
    this.#selected = [...parents.map((parent) => parent.id), id];

    /**
     * i would have changed this to be using a model Class Category to make sure all
     * types are the same inside the array, but i dont have much time for that
     */
    const filteredCategories = [];

    // current node data after filter
    const currentFilteredNode =
      parents[parents.length - 1]?.children ??
      this.#categoryService.categories[0];

    filteredCategories.push(...parents.map((parent) => [parent]));
    filteredCategories.push(currentFilteredNode);
    filteredCategories.push(...Array.from(children.values()).reverse());
    this.#categories = filteredCategories;
    this.#bootstrap();

    this.#selects[level].value = id;
  }

  /**
   * sets selected value of select element if exists
   * @param {HTMLSelectElement} select select element
   * @param {number} index index of the select
   */
  $setSelected(select, index) {
    if (this.#selected[index]) select.value = this.#selected[index];
  }

  /**
   * creates option element
   * @param {number} value the value of the option element
   * @param {string} name  name of the option element
   * @returns HTMLOptionElement - created option element
   */
  #createOption(value, name) {
    const option = document.createElement("option");
    option.value = value;
    option.innerText = name;
    return option;
  }

  /**
   * resets selects to default behavior
   */
  reset() {
    this.#categories = this.#categoryService.categories;
    this.#selected = [];
    this.#bootstrap();
  }
}
