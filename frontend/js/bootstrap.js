const categoryService = new CategoryService();
const uiService = new UiService(categoryService);
uiService.init();
