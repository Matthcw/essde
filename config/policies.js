/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions (`true` allows public     *
  * access)                                                                  *
  *                                                                          *
  ***************************************************************************/

  // '*': true,

  BasketController: {
    find: ['isLoggedIn'],
    create: ['isLoggedIn'],
    destroy: ['isLoggedIn']
  },

  OrderController: {
    find: ['isLoggedIn'],
    create: ['isLoggedIn', 'isNotOrdering', 'isNotDelivering'],
    destroy: ['isLoggedIn']
  },
  
  UserController: {
    login: ['isLoggedOut'],
    logout: ['isLoggedIn'],
    signup: ['isLoggedOut'],
    adminUsers: ['isLoggedIn', 'isAdmin'],
    updateAdmin: ['isLoggedIn', 'isAdmin'],
    updateBanned: ['isLoggedIn', 'isAdmin'],
    updateDeleted: ['isLoggedIn', 'isAdmin']
  },

  PageController: {
    showSignupPage: ['isLoggedOut'],
    showDashboardPage: ['isLoggedIn', 'isNotOrdering', 'isNotDelivering'],
    showOrdersPage: ['isLoggedIn', 'isNotOrdering', 'isNotDelivering'],
    showMakeOrderPage: ['isLoggedIn', 'isNotOrdering', 'isNotDelivering'],
    showOrderItemPage: ['isLoggedIn'],
    showCheckoutPage: ['isLoggedIn', 'isNotOrdering', 'isNotDelivering'],
    showCheckoutPage: ['isLoggedIn', 'isNotOrdering', 'isNotDelivering'],
    showAdminPage: ['isLoggedIn', 'isAdmin']
  }
  

  /***************************************************************************
  *                                                                          *
  * Here's an example of mapping some policies to run before a controller    *
  * and its actions                                                          *
  *                                                                          *
  ***************************************************************************/
	// RabbitController: {

		// Apply the `false` policy as the default for all of RabbitController's actions
		// (`false` prevents all access, which ensures that nothing bad happens to our rabbits)
		// '*': false,

		// For the action `nurture`, apply the 'isRabbitMother' policy
		// (this overrides `false` above)
		// nurture	: 'isRabbitMother',

		// Apply the `isNiceToAnimals` AND `hasRabbitFood` policies
		// before letting any users feed our rabbits
		// feed : ['isNiceToAnimals', 'hasRabbitFood']
	// }
};
