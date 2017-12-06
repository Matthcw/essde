module.exports.routes = {
    /*
    * Server-rendered HTML Page
    */
    'GET /': 'PageController.showHomePage',

    'GET /signup': 'PageController.showSignupPage',
    
    'GET /dashboard': 'PageController.showDashboardPage',

    'GET /order/add': 'PageController.showMakeOrderPage',

    'GET /order/checkout': 'PageController.showCheckoutPage',

    'GET /orders': 'PageController.showOrdersPage',

    'GET /admin': 'PageController.showAdminPage',

    'GET /order/:id': 'PageController.showOrderItemPage',

    /*
    * JSON API
    */
    'PUT /login': 'UserController.login',
    'GET /logout': 'UserController.logout',
    
    'GET /order': 'OrderController.find',
    'POST /order': 'OrderController.create',
    'DELETE /order': 'OrderController.destroy',

    'GET /basket': 'BasketController.find',
    'POST /basket': 'BasketController.create',
    'DELETE /basket': 'BasketController.destroy',

    'POST /user/signup': 'UserController.signup',
    'GET /user/admin': 'UserController.adminUsers',
    'PUT /user/admin/:id': 'UserController.updateAdmin',
    'PUT /user/banned/:id': 'UserController.updateBanned',
    'PUT /user/deleted/:id': 'UserController.updateDeleted'
}   