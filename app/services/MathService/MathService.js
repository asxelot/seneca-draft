import MicroService from '../MicroService';
import fetch from 'node-fetch';

export default class MathService extends MicroService {
  name = 'math';

  async sum({ left, right }) {
    this.log.info('sum log', left, right);

    const result = await this.act({ name: 'math', method: 'product', left: 2, right: 3 });

    console.log('result', result);

    return { answer: left + right };
  }

  product({ left, right }) {
    return { answer: left * right };
  }

  async users() {
    const res = await fetch('http://filltext.com/?rows=20&fname={firstName}&lname={lastName}');
    
    return await res.json();
  }

  static route = {
    prefix: '/math',
    pin: 'name:math,method:*',
    map: {
      users: { GET: true }
    }
  };
}
