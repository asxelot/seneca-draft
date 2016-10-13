import web from 'seneca-web';
import adapter from 'seneca-web-adapter-express';
import express from 'express';
import bodyParser from 'body-parser';

import { seneca } from './seneca';
import config from '../config.json';

const routes = [];

// register each microservice
config.services.forEach(service => {
  const Service = require(`${config.servicesLocation}/${service}`).default;

  seneca.use(Service.register());
  Service.route && routes.push(Service.route);
});

const webConfig = {
  routes,
  adapter,
  context: express()
};

seneca
  .use('rabbitmq-transport')
  .use(web, webConfig)
  .ready(() => {
    const app = seneca.export('web/context')();

    app.use(bodyParser.json());
    app.listen(config.http.port, () => {
      console.log(`server started on ${config.http.port}`);
    });

    seneca.act({ name: 'math', method: 'sum', left: 1, right: 2 }, console.log)
  });
