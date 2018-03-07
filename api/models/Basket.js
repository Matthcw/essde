/**
 * Basket.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  migrate: 'drop',
  
  schema: 'true',

  attributes: {
    id: {
      type: 'integer',
      unique: true,
      autoIncrement: true
    },
    price: {
      type: 'float'
    },
    items: {
      type: 'string'
    },
    userId: {
      type: 'integer'
    }
  }

};

