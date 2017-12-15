angular.module('essde').controller('ordersPageController', [
    '$scope', '$http', '$timeout',
    function ($scope, $http, $timeout) {

        // Join room
        io.socket.put('/api/v1/order/joinviewordersroom', function onSuccess(resData, jwData) {
            console.log("Orders room successfully joined: " + resData.room);
        });

        io.socket.get('/api/v1/order', function whenServerResponds(data, JWR) {

            if (JWR.statusCode >= 400) {
                console.error("An error occurred in the Socket connection attempt");
                return;
            }
           
            $scope.orders = data;
            $scope.$apply();            

            console.log( $scope.orders);

        });

        io.socket.on('neworder', function (order) {
            console.log(order);            
            
            addOrder(order);
        });

        io.socket.on('delivererunassigned', function (order) {
            console.log(order);            
            
            addOrder(order);
        });        

        io.socket.on('delivererassigned', function (id) {
            console.log(id);            
            
            removeOrder(id);
        });

        io.socket.on('orderdeleted', function (id) {
            console.log(id);            
            
            removeOrder(id);
        });
        
        io.socket.on('ordercompleted', function (id) {
            console.log(id);            
            
            removeOrder(id);
        });

        function addOrder(order) {
            $scope.orders.unshift({
                id: order.id,
                price: order.price,
                items: order.items
            });
            $scope.$apply();
        }

        function removeOrder(id) {
            $scope.orders = $scope.orders.filter(function(item){
                return item.id != id;
            })
            $scope.$apply();
        }
    }

]);