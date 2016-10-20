import joi from 'joi';
import p from 'prmsf';
import crypto from 'crypto';
import request from 'request';

import config from '../../../config.json';
import MicroService from '../MicroService';

export default class GiropayPaymentService extends MicroService {
  name = 'giropay.payment';

  async check({ args: { body, params: { userId } } }) {
    try {
      const {
        amount,
        merchantTxId = Math.random().toString(36).slice(2),
        purpose      = 'AVS Giropay Payment',
        currency     = 'EUR',
        infoLabels   = [],
        infoTexts    = []
      } = body;

      await p.wrap(cb => joi.validate(body, bodySchema, cb));

      const user = await this.act('name:user,method:fetch', { query: { id: userId } });
      const { partnerId, profile: { bic, iban } } = user;

      const form = {
        merchantId: await this.getParam(partnerId, 'merchantId'),
        projectId:  await this.getParam(partnerId, 'projectId'),
        merchantTxId,
        amount,
        currency,
        purpose,
        bic,
        iban
      };

      for (let i = 0; i < 5; i++) {
        form[`info${i+1}Label`] = infoLabels[i];
        form[`info${i+1}Text`] = infoTexts[i];
      }

      Object.assign(form, {
        urlRedirect: await this.getParam(partnerId, 'redirectUrl') || this._getRedirectUrl(partnerId, 'back'),
        urlNotify: this._getRedirectUrl(partnerId, 'notify')
      });

      const data = Object.values(form).join('');
      const password = await this.getParam(partnerId, 'projectPassword');

      form.hash = crypto.createHmac('md5', password, 'utf8').update(data).digest('hex');

      const giroRes = await p.wrap(cb => request.post(
        'https://payment.girosolution.de/girocheckout/api/v2/transaction/start', { form }, cb
      ));

      const giroJson = JSON.parse(giroRes.body);

      if (giroJson.msg) throw giroJson.msg;

      return { success: true, redirectUrl: giroJson.redirect };
    } catch (error) {
      console.error(error);

      return { success: false, error: error.toString() };
    }
  }

  async back({ args: { query } }) {
    try {
      const {
        gcReference,
        gcMerchantTxId,
        gcBackendTxId,
        gcAmount,
        gcCurrency,
        gcResultPayment,
        gcResultAVS,
        gcHash
      } = query;
      

    } catch (error) {

    }
  }

  _getRedirectUrl(partnerId, base = 'back') {
    const { http: { host, port } } = config;

    return `${host}:${port}/${this.name}/${base}`;
  }

  async _checkHash(data, partnerId) {
    const _data = Object.assign({}, data);
    delete _data.gcHash;

    const _joinedData = Object.values(_data).join('');
    const password = await this.getParam(partnerId, 'projectPassword');

    return data.gcHash === crypto.createHmac('md5', password, 'utf8').update(_joinedData).digest('hex');
  }

  static routes = {
    prefix: '/giropay.payment',
    pin: 'name:giropay.payment,method:*',
    map: {
      check: {
        POST: true,
        suffix:'/:userId'
      },
      back: { GET: true },
      notify: { GET: true }
    }
  };
}

const bodySchema = joi.object().keys({
  amount: joi.number().min(1).max(10000).required(),
  merchantTxId: joi.string().max(255),
  purpose: joi.string().max(37),
  currency: joi.string().max(3),
  infoLabels: joi.array().max(5).items(joi.string().max(30)),
  infoTextx: joi.array().max(5).items(joi.string().max(80))
});