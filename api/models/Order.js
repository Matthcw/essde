/**
 * Order.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  migrate: 'drop',
  
  schema: 'true',

  autoPK: false,

  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true
    },
    price: {
      type: 'float'
    },
    items: {
      type: 'array'
    },
    location_lat: {
      type: 'float'
    },
    location_lng: {
      type: 'float'
    },
    userId: {
      type: 'objectid'
    },
    deliverUserId: {
      type: 'objectid',
      defaultsTo: null
    },
    completed: {
      type: 'boolean',
      defaultsTo: 'false'
    },
    deleted: {
      type: 'boolean',
      defaultsTo: 'false'
    }
  }
};

