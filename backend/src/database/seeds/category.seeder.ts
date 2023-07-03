import { Seeder, SeederFactory, SeederFactoryManager } from 'typeorm-extension';
import { DataSource, Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(Category);
    await dataSource.manager.query('truncate category');

    const categoryFactory = await factoryManager.get(Category);
    await this.saveTree(repository, categoryFactory);
  }

  async saveTree(
    repo: Repository<Category>,
    categoryFactory: SeederFactory<Category, unknown>,
    level = 3,
  ) {
    let counter = 0;
    let categories = await categoryFactory.saveMany(10);

    while (counter < level) {
      counter++;
      const childCategories: Category[] = [];

      for (let i = 0; i < 10; i++) {
        const r = await categoryFactory.make();
        childCategories.push(r);
      }

      for (let category of childCategories) {
        const random = Math.floor(Math.random() * categories.length);
        category.parent = categories[random];
        const result = await repo.save(category);

        category = result;
      }
      categories = childCategories;
    }
  }
}
