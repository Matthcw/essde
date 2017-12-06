angular.module('essde').controller('ordersPageController', [
    '$scope', '$http', '$timeout',
    function ($scope, $http, $timeout) {

        io.socket.get('/api/v1/order', function whenServerResponds(data, JWR) {

            if (JWR.statusCode >= 400) {
                console.error("An error occurred in the Socket connection attempt");
                return;
            }

            $scope.orders = data;
            $scope.$apply();            

            io.socket.on('order', function whenAOrderIsCreatedUpdatedOrDestroyed(event) {

                $scope.orders.unshift({
                    price: event.data.price,
                    items: event.data.items
                });
                $scope.$apply();
                
            });

        });
    }

]);