
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
    
    'GET /api/v1/order': 'OrderController.findOrders', // Either find all orders, or find order associated with me
    'POST /api/v1/order': 'OrderController.createOrder',
    'PUT /api/v1/order': 'OrderController.completeOrder',
    'DELETE /api/v1/order': 'OrderController.deleteOrder',

    'PUT /api/v1/order/joinorderitemroom': 'OrderController.joinOrderItemsRoom',
    'PUT /api/v1/order/joinviewordersroom': 'OrderController.joinViewOrdersRoom',
    'POST /api/v1/order/chat': 'OrderController.chat',
    'POST /api/v1/order/map': 'OrderController.deliveryUserLocation',
    
    'GET /api/v1/basket': 'BasketController.findItems',
    'POST /api/v1/basket': 'BasketController.createItem',
    'DELETE /api/v1/basket/:id': 'BasketController.destroyItem',
    'DELETE /basket': 'BasketController.destroyItems',
    
    'POST /api/v1/user/signup': 'UserController.signup',
    'GET /api/v1/user/admin': 'UserController.adminUsers',
    'PUT /api/v1/user/admin/:id': 'UserController.updateAdmin',
    'PUT /api/v1/user/banned/:id': 'UserController.updateBanned',
    'PUT /api/v1/user/deleted/:id': 'UserController.updateDeleted'
}   