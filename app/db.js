import config from '../config.json';
import validator from 'bookshelf-joi-validator';

export const knex = require('knex')(config.db);
export const bookshelf = require('bookshelf')(knex);
export const Model = bookshelf.Model;

bookshelf.plugin(validator);
