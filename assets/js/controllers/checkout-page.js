

angular.module('essde').controller('checkoutPageController', [
    '$scope', '$http', '$timeout',
    function ($scope, $http, $timeout) {
        $http.get('/api/v1/basket')
            .then(function onSuccess(sailsResponse) {
                $scope.basket = sailsResponse.data;
            })
            .catch(function onError(sailsResponse) {
                console.error("An unexpected error occured " + sailsResponse.statusText);
            });

        $scope.removeFromBasket = function (itemId) {
            $http.delete('/api/v1/basket/' + itemId)
                .then(function onSuccess(sailsResponse) {
                    $scope.basket = $scope.basket.filter(function (item) {
                        return item.id != itemId;
                    })
                })
                .catch(function onError(sailsResponse) {
                    console.error("An unexpected error occured " + sailsResponse.statusText);
                });
        }

        $scope.orderItems = function() {
            var _items = [];
            $scope.basket.forEach(function(basketItem){
                _items.push(basketItem.items)
            })

            var _price = 0;
            $scope.basket.forEach(function(basketItem){
                _cleanPrice = basketItem.price;
                _price += _cleanPrice;
            })
            _price = _price.toFixed(2);

            //io.socket.post
            io.socket.post('/api/v1/order/', {
                price: _price,
                items: _items,
                location_lat: lat,
                location_lng: lng,
                completed: false
            }, function onError(resData, jwData) {
                console.log(resData);
                document.location.href = '/order/'+ resData.id;
            });       
        }

    }

]);

