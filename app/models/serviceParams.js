import { Model } from '../db';

export default class ServiceParams extends Model {

}

Object.assign(ServiceParams.prototype, {
  tableName: 'serviceParams',
  hasTimestamps: true
});
