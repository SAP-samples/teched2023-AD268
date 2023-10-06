'use strict';

/**
 * This handles routing and passing off to specific handlers for the CAP service.
 * Each handler function executes when srv emits the corresponding event linked to the handler.
 * @param {Object} srv - The CAP service, which will emit events that these handlers react to.
 * @param {Object} srv.entities - The entities which are fired and needed within the endpoint handlers
 */

const userVerifyHandler = require('./handlers/Usersverify');
const userCreateHandler = require('./handlers/Userscreate');
const createCountryHandler = require('./handlers/createCountry');

module.exports = async (srv) => {
  srv.on('CREATE', 'Users', async (req) => {
    return userCreateHandler.createUser(req);
  });
  srv.before('CREATE', 'Users', async (req) => {
    return userVerifyHandler.verifyEmail(req);
  });
  srv.on('createcountry', async (req) => {
    return createCountryHandler.createCountry(req);
  });
}