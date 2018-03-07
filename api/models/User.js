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
    id: {
      type: 'integer',
      autoIncrement: true
    },
    email: {
      type: 'string',
      email: 'true',
      unique: 'true'
    },
    password: {
      type: 'string'
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

