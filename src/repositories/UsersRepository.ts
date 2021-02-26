import { EntityRepository, Repository } from 'typeorm';
import { User } from '../models/Users';

@EntityRepository(User)
class UsersRepository extends Repository<User> {}
export { UsersRepository };
