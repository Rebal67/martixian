import { UnsecureBaseEntity } from 'src/common/entities/UnsercureBase.entity';
import { Column, Entity, Tree, TreeChildren, TreeParent } from 'typeorm';

@Entity()
@Tree('materialized-path')
export class Category extends UnsecureBaseEntity {
  @Column()
  name: string;

  @TreeChildren()
  children: Category[];

  @TreeParent()
  parent: Category;
}
