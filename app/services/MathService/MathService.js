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

  async test() {
    const user = await this.act({ name: 'user', method: 'fetch', query: {
      id: 'ee797ad0-de56-4b31-a6ee-6a027322ddff'
    }});

    console.log('user', user)
  }

  static routes = {
    prefix: '/math',
    pin: 'name:math,method:*',
    map: {
      users: { GET: true }
    }
  };
}
