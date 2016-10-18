import joi from 'joi';

import { Model } from '../db';
import config from '../../config.json';

export default class User extends Model {
  toJSON(options) {
    const result = super.toJSON(options);

    delete result.password;
    delete result.emailHash;
    delete result.retentionEmailSent;

    return result;
  }
}

const
  id = joi.string().forbidden(),
  email = joi.string().max(255).regex(/^[\w\-\+\.]+@([\w\-]+\.)+[\w]{2,63}$/),
  password = joi.string().max(255).regex(new RegExp(config.user.passwordRegex)),
  partnerId = joi.string(),
  role = joi.string().max(255),
  isBlocked = joi.forbidden(),
  status = joi.forbidden(),
  retentionEmailSent = joi.forbidden(),
  emailHash = joi.forbidden();

Object.assign(User.prototype, {
  tableName: 'user',
  hasTimestamps: true,

  // validation
  schema: {
    create: joi.object().keys({
      id,
      email: email.required(),
      password: password.required(),
      partnerId: partnerId.required(),
      role: role.required(),
      isBlocked,
      status,
      retentionEmailSent,
      emailHash
    }),
    update: joi.object().keys({
      id,
      email,
      password,
      partnerId,
      role,
      isBlocked,
      status,
      retentionEmailSent,
      emailHash
    })
  }
});
