

angular.module('essde').controller('orderItemPageController', [
    '$scope', '$http', '$timeout',
    function ($scope, $http, $timeout) {

        $scope.me = window.SAILS_LOCALS.me;
        $scope.orderId = window.SAILS_LOCALS.order.id;
        $scope.complete = false;
        $scope.chats = [];

        // TODO: Code to check order affiliated with this user's userId  
        // TODO: Send this page's orderId to db to poll for the: deliveryUserId, deleted, and completed flags

        io.socket.get('/api/v1/order/', {
            orderId: $scope.orderId
        }, function onSuccess(resData, jwData) {
            console.log(resData);

            // Set: $scope.hasDeliverer, $scope.wasDeliverer, $scope.orderDeleted, $scope.orderComplete

        });

        // Join room
        io.socket.put('/api/v1/order/joinchat', function onSuccess(resData, jwData) {
            console.log("Chat successfully joined" + resData);
        });

        // New message received from server
        io.socket.on('chat', function (e) {
            console.log('new Chat received', e)
            console.log(e.userId);
            console.log($scope.me.id);
            prefix = (e.userId == $scope.me.id) ? 'You: ' : 'Them: ';

            $scope.chats.push({message: prefix + e.message});
            $scope.$apply();
        });

        $scope.sendMessage = function () {

            io.socket.post('/api/v1/order/chat', {
                message: $scope.chatMessage
            }, function onSuccess(resData, jwData) {
                //$scope.chats.push({message: "Hi"});
            });
            
        }


        $http.get('/api/v1/order/')
            .then(function onSuccess(sailsResponse) {
                console.log(sailsResponse.data);

                $scope.order = sailsResponse.data;

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

            })
            .catch(function onError(sailsResponse) {
                console.error("An unexpected error occured " + sailsResponse.statusText);
            });


        $scope.markOrderComplete = function () {
            $http.delete('/api/v1/order/')
                .then(function onSuccess(sailsResponse) {
                    document.location.href = '/dashboard';
                })
                .catch(function onError(sailsResponse) {
                    console.error("An unexpected error occured " + sailsResponse.statusText);
                });
            $scope.complete = !$scope.complete;
        }

        $scope.cancelDelivery = function () {

            $http.delete('/api/v1/order/')
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