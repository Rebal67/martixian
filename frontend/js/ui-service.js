class UiService {
  #categoryService;
  #categories;
  #selects;

  constructor(categoryService) {
    this.#categoryService = categoryService;
  }

  async init() {
    this.#categoryService.fetch();
    this.#categories = this.#categoryService.categories;
    this.#bootstrap();
  }

  #bootstrap() {
    this.#selects = this.createSelects();
    const container = document.querySelector("#container");
    container.innerHTML = ``;
    container.append(...this.#selects);
  }

  createSelects() {
    const selects = [];
    for (const [level, categories] of this.#categories) {
      const select = this.#createSelect(level, categories);
      selects.push(select);
    }
    return selects;
  }

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

  #selectListener(event) {
    const level = parseInt(event.target.dataset.level);

    const id = parseInt(event.target.value);

    const node = this.#categoryService.findNode(id);

    const parents = this.#categoryService.getAllParents(node).reverse();
    const children = this.#categoryService.getChildrenMappedByLevel(
      node.children,
      level
    );
    console.log(this.#categories);
    console.log([parents, Array.from(...children.values())]);
    //TODO: split into 2 loops for readability
    for (const [index, select] of this.#selects.entries()) {
      if (index + 1 == level) continue;
      const options =
        index + 1 < level ? [parents[index]] : children.get(index);
      console.log(options);
      this.$hideOptions(select, options);
    }
  }

  $hideOptions(select, optionsToKeep = []) {
    this.$toggleDisableSelect(select, optionsToKeep);

    if (optionsToKeep.length === 1) select.value = optionsToKeep[0].id;
    console.log(optionsToKeep);
    let options = select.getElementsByTagName("options");
    for (const option of options) {
      console.log(option);
    }
  }

  $toggleDisableSelect(select, options = []) {
    console.log(options);
    options.length > 0 ? (select.disabled = false) : (select.disabled = true);
    return;
  }

  #createOption(value, name) {
    const option = document.createElement("option");
    option.value = value;
    option.innerText = name;
    return option;
  }
}
