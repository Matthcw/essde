angular.module('essde').controller('orderPageController', [
    '$scope', '$http', '$timeout',
    function ($scope, $http, $timeout){

        $http.get('/api/v1/basket')
        .then(function onSuccess(sailsResponse) {
            $scope.basket = sailsResponse.data;
        })
        .catch(function onError(sailsResponse) {
            console.error("An unexpected error occured " + sailsResponse.statusText);
        });
        

        $scope.addToBasket = function() {
            var price = (Math.random() * (8.99) + 1).toFixed(2);
        
            $http.post('/api/v1/basket/', {
                price: price,
                items: $scope.basketItem
            })
            .then(function onSuccess(sailsResponse) {
                $scope.basket.push(sailsResponse.data);
            })
            .catch(function onError(sailsResponse) {
                console.error("An unexpected error occured " + sailsResponse.statusText);
            });            
        }

        $scope.removeFromBasket = function(itemId) {
            $http.delete('/api/v1/basket/' + itemId)
            .then(function onSuccess(sailsResponse) {
                $scope.basket = $scope.basket.filter(function(item){
                    return item.id != itemId;
                })
            })
            .catch(function onError(sailsResponse) {
                console.error("An unexpected error occured " + sailsResponse.statusText);
            });
        }
    }
]);