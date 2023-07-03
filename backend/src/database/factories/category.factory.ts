import { Category } from 'src/categories/entities/category.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(Category, (faker) => {
  const category = new Category();
  category.name = faker.commerce.productMaterial();
  return category;
});
