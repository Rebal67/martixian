import { Hashprovider } from 'src/auth/providers/hash.provider';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { User } from '../../users/user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }
  async beforeInsert({ entity }: InsertEvent<User>): Promise<void> {
    if (entity.password) {
      entity.password = await Hashprovider.generateHash(entity.password);
    }

    if (entity.email) {
      entity.email = entity.email.toLowerCase();
    }
  }

  async beforeUpdate({
    entity,
    databaseEntity,
  }: UpdateEvent<User>): Promise<void> {
    if (entity.password) {
      const password = await Hashprovider.generateHash(entity.password);

      if (password !== databaseEntity?.password) {
        entity.password = password;
      }
    }
  }
}
