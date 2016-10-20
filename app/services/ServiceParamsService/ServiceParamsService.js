import MicroService from '../MicroService';
import ServiceParams from '../../models/serviceParams';

export default class ServiceParamsService extends MicroService {
  name = 'params';

  async get({ partnerId, service, key }) {
    let params = await new ServiceParams({ partnerId, service, key }).fetch();

    if (!params) {
      params = await new ServiceParams({ partnerId: null, service, key }).fetch();
    }

    return params.toJSON();
  }
}
