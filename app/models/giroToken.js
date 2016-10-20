import joi from 'joi';

import { Model } from '../db';

export class GiroToken extends Model {

}

Object.assign(GiroToken.prototype, {
  tableName: 'giropayToken',
  schema: {
    create: joi.object().keys({
      id:     joi.string(),
      userId: joi.string().required(),
      token:  joi.number().required()
    })
  }
});
