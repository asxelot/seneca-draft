import web from 'seneca-web';
import adapter from 'seneca-web-adapter-express';
import express from 'express';
import bodyParser from 'body-parser';

import { seneca } from './seneca';
import config from '../config.json';

const routes = [];
const coreServices = [
  'UserService',
  'ServiceParamsService'
];

// register each microservice
coreServices.concat(config.services).forEach(service => {
  const Service = require(`${config.servicesLocation}/${service}`).default;

  seneca.use(Service.register());
  Service.routes && routes.push(Service.routes);
});

const context = express()
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json());

const webConfig = {
  routes,
  adapter,
  context,
  options: {
    parseBody: false
  }
};

seneca
  .use('rabbitmq-transport')
  .use(web, webConfig)
  .ready(() => {
    const app = seneca.export('web/context')();

    app.listen(config.http.port, () => {
      seneca.log.info(`server started on ${config.http.port}`);
    });
  });
