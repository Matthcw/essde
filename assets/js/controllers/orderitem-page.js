

angular.module('essde').controller('orderItemPageController', [
    '$scope', '$http', '$timeout',
    function ($scope, $http, $timeout) {

        $scope.me = window.SAILS_LOCALS.me;
        $scope.orderId = window.SAILS_LOCALS.order.id;
        $scope.complete = false;

        $http.get('/api/v1/order/' + $scope.orderId)
            .then(function onSuccess(sailsResponse) {
                console.log(sailsResponse.data);
                lat = sailsResponse.data.location_lat
                lng = sailsResponse.data.location_lng

                if (!navigator.geolocation) return alert("No location access. Use a better browser bro...");

                navigator.geolocation.getCurrentPosition(function (position) {

                    // Map options
                    var options = {
                        zoom: 15,
                        center: { lat: lat, lng: lng }
                    };

                    // New map
                    var map = new google.maps.Map(document.getElementById('map-orderitem'), options);
                    addMarker({ coords: { lat: lat, lng: lng } });


                    var marker;
                    // Add Marker Function
                    function addMarker(props) {
                        if (marker) {
                            marker.setPosition(props.coords);
                        } else {
                            marker = new google.maps.Marker({
                                position: props.coords,
                                map: map,
                                icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
                            });
                        }
                    }

                });

                $scope.order = sailsResponse.data;
            })
            .catch(function onError(sailsResponse) {
                console.error("An unexpected error occured " + sailsResponse.statusText);
            });


        $scope.markOrderComplete = function () {
            $http.delete('/api/v1/order/' + $scope.orderId)
                .then(function onSuccess(sailsResponse) {
                    document.location.href = '/dashboard';
                })
                .catch(function onError(sailsResponse) {
                    console.error("An unexpected error occured " + sailsResponse.statusText);
                });
            $scope.complete = !$scope.complete;
        }

        $scope.cancelDelivery = function () {

            $http.delete('/api/v1/order/' + $scope.orderId)
                .then(function onSuccess(sailsResponse) {
                    if ($scope.order.userId == window.SAILS_LOCALS.me.id) {
                        document.location.href = '/dashboard';
                    } else {
                        document.location.href = '/orders';
                    }
                })
                .catch(function onError(sailsResponse) {
                    console.error("An unexpected error occured " + sailsResponse.statusText);
                });

        }

    }
]);