/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  
  migrate: 'drop',

  schema: 'true',

  attributes: {
    email: {
      type: 'string',
      email: 'true',
      unique: 'true'
    },
    password: {
      type: 'string'
    },
    // Now that I have order and delivery associations
    // is there a need for the booleans?
    orders: {
      collection:'order'
    },
    deliveries: {
      collection:'order'
    },
    basketItems: {
      collection: 'basket'
    },
    ordering: {
      type: 'boolean',
      defaultsTo: 'false'
    },
    delivering: {
      type: 'boolean',
      defaultsTo: 'false'
    },
    admin: {
      type: 'boolean',
      defaultsTo: 'false'
    },
    banned: {
      type: 'boolean',
      defaultsTo: 'false'
    },
    deleted: {
      type: 'boolean',
      defaultsTo: 'false'
    },
  }
};