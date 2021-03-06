import bluebird from 'bluebird';

import { seneca } from '../seneca';

export default class MicroService {
  seneca = seneca;

  log = seneca.log;
  
  act = bluebird.promisify(seneca.act, { context: seneca });

  async getParam(partnerId, key) {
    const param = await this.act('name:params,method:get', {
      partnerId,
      key,
      service: this.name
    });

    return JSON.parse(param.value);
  }

  static register() {
    const Service = this;

    return function (options) {
      const service = new Service();
      
      // get all methods, except "constructor" and private methods
      const methods = Object.getOwnPropertyNames(Service.prototype).filter(m => {
        return m !== 'constructor' && !/^_/.test(m);
      });

      // add each method
      methods.forEach(method => {
        seneca.add({ method }, (msg, res) => {
          Promise.resolve(service[method](msg))
            .then(result => {
              res(null, result);

              seneca.watch && seneca.watch(msg, result);
            })
            .catch(error => res(error));
        });
      });

      // give a name for our service
      return service.name;
    }
  }
}
