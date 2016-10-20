import joi from 'joi';

import { Model } from '../db';
import config from '../../config.json';

export default class Profile extends Model {

}

const
  id = joi.string().forbidden(),
  userId = joi.string().forbidden(),
  greeting = joi.string().max(255).required(),
  firstName = joi.string().max(255).required(),
  lastName = joi.string().max(255).required(),
  birthday = joi.date().required(),
  placeOfBirth = joi.alternatives().try(joi.string().max(255), joi.any().empty()),
  zip = joi.string().required(),
  city = joi.string().max(255).required(),
  street = joi.string().max(255).required(),
  houseNumber = joi.string().max(255).required(),
  phone = joi.alternatives().try(joi.string().max(255), joi.number(), joi.any().empty()),
  iban = joi.string().max(255).required(),
  bic = joi.alternatives().try(joi.string().max(255), joi.any().empty()),
  agreement1 = joi.alternatives().try(joi.boolean().valid(true), joi.number().valid(1)).required(),
  agreement2 = joi.alternatives().try(joi.boolean(), joi.number().valid(0, 1)).required(),
  agreement3 = joi.alternatives().try(joi.boolean(), joi.number().valid(0, 1)).required(),
  agreement4 = joi.alternatives().try(joi.boolean(), joi.number().valid(0, 1)).required(),
  identityHash = joi.forbidden();

Object.assign(Profile.prototype, {
  tableName: 'userProfile',
  hasTimestamps: false,

  // validation
  schema: {
    create: joi.object().keys({
      id,
      userId,
      greeting: greeting.required(),
      firstName: firstName.required(),
      lastName: lastName.required(),
      birthday: birthday.required(),
      placeOfBirth: placeOfBirth.required(),
      zip: zip.required(),
      city: city.required(),
      street: street.required(),
      houseNumber: houseNumber.required(),
      phone,
      iban: iban.required(),
      bic: bic.required(),
      agreement1: agreement1.required(),
      agreement2: agreement2.required(),
      agreement3: agreement3.required(),
      agreement4: agreement4.required(),
      identityHash
    }),
    update: joi.object().keys({
      id,
      userId,
      greeting,
      firstName,
      lastName,
      birthday,
      placeOfBirth,
      zip,
      city,
      street,
      houseNumber,
      phone,
      iban,
      bic,
      agreement1,
      agreement2,
      agreement3,
      agreement4,
      identityHash
    })
  }
});
