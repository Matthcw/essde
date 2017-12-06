var lat, lng;

function initMap() {

    if (!document.getElementById('map-checkout')) {
        return;
    }

    if(!navigator.geolocation) return alert("No location access. Use a better browser bro...");    

    navigator.geolocation.getCurrentPosition(function (position) {
        lat = position.coords.latitude;
        lng = position.coords.longitude;

        // Map options
        var options = {
            zoom: 18,
            center: { lat: lat, lng: lng }
        };

        // New map
        var map = new google.maps.Map(document.getElementById('map-checkout'), options);
        addMarker({ coords: { lat: lat, lng: lng } });
        // Listen for click on map
        google.maps.event.addListener(map, 'click', function (event) {
            // Add marker

            lat = event.latLng.lat().toFixed(10);
            lng = event.latLng.lng().toFixed(10);
            addMarker({ coords: event.latLng });
        });

        var marker;
        // Add Marker Function
        function addMarker(props) {
            if (marker) {
                marker.setPosition(props.coords);
            } else {
                marker = new google.maps.Marker({
                    position: props.coords,
                    map: map
                });
            }
        }

    });
}