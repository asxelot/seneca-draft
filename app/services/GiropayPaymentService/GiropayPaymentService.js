import MicroService from '../MicroService';

export default class GiropayPaymentService extends MicroService {
  name = 'payment';

  async check({ args: { body, params: { userId } } }) {
    const user = await this.act('name:user,method:fetch', { query: { id: userId } });
    console.log('user', user);

    return { success: true, body };
  }

  static routes = {
    prefix: '/payment',
    pin: 'name:payment,method:*',
    map: {
      check: {
        POST: true,
        suffix:'/:userId'
      }
    }
  };
}
