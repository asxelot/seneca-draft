import MicroService from '../MicroService';
import User from '../../models/user';

export default class UserService extends MicroService {
  name = 'user';

  async fetch({ query }) {
    const user = await new User(query).fetch({ withRelated: ['profile'] });

    return user.toJSON();
  }
}
