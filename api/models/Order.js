/**
 * Order.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  migrate: 'drop',
  
  schema: 'true',

  attributes: {
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
      type: 'integer'
    },
    deliverUserId: {
      type: 'integer',
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

