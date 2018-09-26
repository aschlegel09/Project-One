$("#flight-body").hide();
$("#google-maps").hide();
$("#google-directions").hide();

$(".getstarted").on("click", function () {
  console.log("Started got clicked");
  $("#welcome-div").hide();
  $("#aboutus-div").hide();
  $("#flight-body").show();
})


//AMADEUS (FLIGHTS API)-------------------------------------------------------------------

//Hiding the Loading Gif
$("#loader").hide();

//Variable for linking to google maps
var airportCode = "";

//Variable to find city name with airport code
var city_Name = "";

//When "submit" is clicked it will display all the avaiable flights
$("#submit").on("click", function () {


  console.log("has been clicked")

  $("#flightResults").empty();
  $("#keys").hide();

  //Loader
  displayLoader();

  //Variables
  var apiKey = "LNwGNIvbXeYriudb2kG7usM0AZvFNZR2"

  var origin = $("#origin").val();
  console.log(origin);

  var destination = $("#destination").val();
  console.log(destination);

  var depDate = $("#depDate").val();
  console.log(depDate);

  var retDate = $("#retDate").val();
  console.log(retDate);

  //Amadeus API
  var apiURL = "https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?apikey=" + apiKey + "&origin=" + origin + "&destination=" + destination + "&departure_date=" + depDate + "&return_date=" + retDate + "&number_of_results=50"

  $.ajax({
    url: apiURL,
    method: "GET"
  }).then(function (response) {
    console.log("API is working")
    console.log(response)


    for (var i = 0; i < response.results.length; i++) {

      //Airline Code Converstion
      var airLine = response.results[i].itineraries[0].outbound.flights[0].marketing_airline;
      var airlineName = "";

      //Function for Airline Code Conversion
      function airLine_Name(code) {
        for (var i = 0; i < 946; i++) {
          if (code === Object.keys(airlineCode)[i]) {
            console.log("Correct");
            airlineName = airlineCode[Object.keys(airlineCode)[i]];
          };
        };
      };
      airLine_Name(airLine);

      //Getting the Departure Time
      var depTime = response.results[i].itineraries[0].outbound.flights[0].departs_at;
      var ConVert_depTime = depTime.substring(depTime.indexOf("T"));
      var nConVert_depTime = ConVert_depTime.substring(1);
      console.log(nConVert_depTime);

      //Getting the Arrival Time
      var dtime = nConVert_depTime;
      dtime = dtime.split(':');

      var dur = response.results[i].itineraries[0].outbound.duration;
      dur = dur.split(":");

      var mins = Number(dtime[1]) + Number(dur[1]);
      var mins_hr = 0;
      var mins_rem = 0;
      if (mins > 60) {
        mins_hr = Math.floor(mins / 60);
        mins_rem = mins % 60;
      }
      else {
        mins_rem = mins;
      };
      var hrs = Number(dtime[0]) + mins_hr;
      var arrivalTime = hrs + ":" + mins_rem;

      console.log(arrivalTime);

      //Coverting from Military Time to Standard
      var timeValue;
      function milConvert(time) {
        time = time.split(':'); // convert to array

        var hours = Number(time[0]);
        var minutes = Number(time[1]);

        if (hours > 0 && hours <= 12) {
          timeValue = "" + hours;
        } else if (hours > 12) {
          timeValue = "" + (hours - 12);
        } else if (hours == 0) {
          timeValue = "12";
        }

        timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;  // get minutes
        timeValue += (hours >= 12) ? " P.M." : " A.M.";  // get AM/PM
      };

      milConvert(nConVert_depTime);
      var stand_depTime = timeValue;
      console.log(stand_depTime);

      milConvert(arrivalTime);
      var stand_arrivalTime = timeValue;
      console.log(stand_arrivalTime);

      var price = response.results[i].fare.price_per_adult.total_fare;

      console.log(response.results[i].itineraries[0].outbound.flights[0].destination.airport);

      //Adding it to HTML
      $("#flightResults").append(
        "<div id='airline_entries' class='card shadow' style='width:20rem'><div class='card-body'><h5 id='airline-title' class='card-title'>" + airlineName +
        "</h5><br><a id='notice" + i + "'></a>" +
        "<br><a id='num" + i + "'>" + response.results[i].itineraries[0].outbound.flights[0].origin.airport + " " +
        "<i class='fa fa-arrow-circle-right' aria-hidden='true'></i>" + " " + response.results[i].itineraries[0].outbound.flights[0].destination.airport + "</a>" +
        "<br>" + stand_depTime + " - " + stand_arrivalTime +
        "<br> Seats Remaining: " + response.results[i].itineraries[0].outbound.flights[0].booking_info.seats_remaining +
        "<br> Duration: " + response.results[i].itineraries[0].outbound.duration +
        "<br> Price: $" + price +
        "</div></div>");

      //Addition Stops
      if (response.results[i].itineraries[0].outbound.flights.length > 1) {
        console.log("1-stop");
        $("#notice" + i).append("1-Stop");
        $("#num" + i).append(" " + "<i class='fa fa-arrow-circle-right' aria-hidden='true'></i>" + " " + response.results[i].itineraries[0].outbound.flights[1].destination.airport);
        airportCode = response.results[i].itineraries[0].outbound.flights[1].destination.airport;
      }
      else {
        console.log("non-stop");
        $("#notice" + i).append("Non-Stop");
        airportCode = response.results[i].itineraries[0].outbound.flights[0].destination.airport;
      };

      displayLoader();
      $(".form-group").hide();

    }

  });

});

//Loader 
function displayLoader() {
  if ($('#flightResults').is(':empty')) {
    console.log("its empty");
    $("#loader").show();
  }
  else {
    console.log("its not");
    $("#loader").hide();
  };
};

//Selecting Airline
function isSelected() {
  $("#flightResults").hide();
  console.log("Has Been Selected");
  console.log(airportCode);
  $("#google-maps").show();

  function airportName(code) {
    for (var i = 0; i < 2891; i++) {
      if (code === Object.keys(cityNames)[i]) {
        console.log("Correct");
        city_Name = cityNames[Object.keys(cityNames)[i]];
      };
    };
  };

  console.log($(this))
  console.log($(this)[0].innerHTML);

  $("#selected-airline").append($(this)[0].innerHTML);
  airportName(airportCode);
  console.log(city_Name);

};

$(document).on("click", "#airline_entries", isSelected);

//END OF AMADEUS API (FLIGHTS API) --------------------------------------------------------------------





//GOOGLE MAPS API -------------------------------------------------------------------------------------

var hotelName = "";

var map, places, infoWindow;
var markers = [];
var autocomplete;
var MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';
var hostnameRegexp = new RegExp('^https?://.+?/');

var countries = {
  'au': {
    center: { lat: -25.3, lng: 133.8 },
    zoom: 4
  },
  'br': {
    center: { lat: -14.2, lng: -51.9 },
    zoom: 3
  },
  'ca': {
    center: { lat: 62, lng: -110.0 },
    zoom: 3
  },
  'fr': {
    center: { lat: 46.2, lng: 2.2 },
    zoom: 5
  },
  'de': {
    center: { lat: 51.2, lng: 10.4 },
    zoom: 5
  },
  'mx': {
    center: { lat: 23.6, lng: -102.5 },
    zoom: 4
  },
  'nz': {
    center: { lat: -40.9, lng: 174.9 },
    zoom: 5
  },
  'it': {
    center: { lat: 41.9, lng: 12.6 },
    zoom: 5
  },
  'za': {
    center: { lat: -30.6, lng: 22.9 },
    zoom: 5
  },
  'es': {
    center: { lat: 40.5, lng: -3.7 },
    zoom: 5
  },
  'pt': {
    center: { lat: 39.4, lng: -8.2 },
    zoom: 6
  },
  'us': {
    center: { lat: 37.1, lng: -95.7 },
    zoom: 3
  },
  'uk': {
    center: { lat: 54.8, lng: -4.6 },
    zoom: 5
  }
};

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: countries['us'].zoom,
    center: countries['us'].center,
    mapTypeControl: false,
    panControl: false,
    zoomControl: false,
    streetViewControl: false
  });

  infoWindow = new google.maps.InfoWindow({
    content: document.getElementById('info-content')
  });

  // Create the autocomplete object and associate it with the UI input control.
  // Restrict the search to the default country, and to place type "cities".
  autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */(
      document.getElementById('autocomplete')), {
      types: ['(cities)'],
    });
  places = new google.maps.places.PlacesService(map);

  autocomplete.addListener('place_changed', onPlaceChanged);


  //GOOGLE DIRECTIONS API ------------------------------------------------------------------------------------------

  var directionsDisplay = new google.maps.DirectionsRenderer({
    map: map,
    panel: document.getElementById('right-panel')
  });

  directionsDisplay.addListener('directions_changed', function () {
    computeTotalDistance(directionsDisplay.getDirections());
  });

  var directionsService = new google.maps.DirectionsService;

  //Click event for showing the directions
  $("#direct-button").on("click", function () {
    console.log("directions clicked")
    $("#google-directions").show();
    console.log(hotelName);

    displayRoute(city_Name, hotelName, directionsService,
      directionsDisplay)

  });

}
//End of initMap

function displayRoute(origin, destination, service, display) {
  service.route({
    origin: origin,
    destination: destination,
    travelMode: 'DRIVING',
    avoidTolls: true
  }, function (response, status) {
    if (status === 'OK') {
      display.setDirections(response);
    } else {
      alert('Could not display directions due to: ' + status);
    }
  });
}

function computeTotalDistance(result) {
  var total = 0;
  var myroute = result.routes[0];
  for (var i = 0; i < myroute.legs.length; i++) {
    total += myroute.legs[i].distance.value;
  }
  total = Math.round(((total / 1000) / 1.609344) * 100) / 100;
  document.getElementById('total').innerHTML = " " + total + ' miles';
};
//END OF GOOGLE DIRECTIONS API ----------------------------------------------------------------------------------------


// When the user selects a city, get the place details for the city and
// zoom the map in on the city.
function onPlaceChanged() {
  var place = autocomplete.getPlace();
  if (place.geometry) {
    map.panTo(place.geometry.location);
    map.setZoom(15);
    search();
  } else {
    document.getElementById('autocomplete').placeholder = 'Destination city';
  }
};

// Search for hotels in the selected city, within the viewport of the map.
function search() {
  var search = {
    bounds: map.getBounds(),
    types: ['lodging']
  };

  places.nearbySearch(search, function (results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      clearResults();
      clearMarkers();
      // Create a marker for each hotel found, and
      // assign a letter of the alphabetic to each marker icon.
      for (var i = 0; i < results.length; i++) {
        var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
        var markerIcon = MARKER_PATH + markerLetter + '.png';
        // Use marker animation to drop the icons incrementally on the map.
        markers[i] = new google.maps.Marker({
          position: results[i].geometry.location,
          animation: google.maps.Animation.DROP,
          icon: markerIcon
        });
        // If the user clicks a hotel marker, show the details of that hotel
        // in an info window.
        markers[i].placeResult = results[i];
        google.maps.event.addListener(markers[i], 'click', showInfoWindow);
        setTimeout(dropMarker(i), i * 100);
        addResult(results[i], i);
      }
    }
  });
};

function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    if (markers[i]) {
      markers[i].setMap(null);
    }
  }
  markers = [];
};

// Set the country restriction based on user input.
function dropMarker(i) {
  return function () {
    markers[i].setMap(map);
  };
};

function addResult(result, i) {
  var results = document.getElementById('results');
  var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
  var markerIcon = MARKER_PATH + markerLetter + '.png';

  var tr = document.createElement('tr');
  tr.style.backgroundColor = (i % 2 === 0 ? '#F0F0F0' : '#FFFFFF');
  tr.onclick = function () {
    google.maps.event.trigger(markers[i], 'click');
  };

  var iconTd = document.createElement('td');
  var nameTd = document.createElement('td');
  var icon = document.createElement('img');
  icon.src = markerIcon;
  icon.setAttribute('class', 'placeIcon');
  icon.setAttribute('className', 'placeIcon');
  var name = document.createTextNode(result.name);
  iconTd.appendChild(icon);
  nameTd.appendChild(name);
  tr.appendChild(iconTd);
  tr.appendChild(nameTd);
  results.appendChild(tr);
};

function clearResults() {
  var results = document.getElementById('results');
  while (results.childNodes[0]) {
    results.removeChild(results.childNodes[0]);
  }
};

// Get the place details for a hotel. Show the information in an info window,
// anchored on the marker for the hotel that the user selected.
function showInfoWindow() {
  var marker = this;
  places.getDetails({ placeId: marker.placeResult.place_id },
    function (place, status) {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        return;
      }
      infoWindow.open(map, marker);
      buildIWContent(place);
      $("#hotelImageDiv").empty();
      var hotelImage = ("<img id='hotelImage' src=" + place.photos[0].getUrl('maxWidth: 200px;') + ">");
      $("#hotelImageDiv").append(hotelImage);
    });
  hotelName = marker.placeResult.name;
  console.log(hotelName);
  console.log(marker)

};

// Load the place information into the HTML elements used by the info window.
function buildIWContent(place) {
  document.getElementById('iw-icon').innerHTML = '<img class="hotelIcon" ' +
    'src="' + place.icon + '"/>';
  document.getElementById('iw-url').innerHTML = '<b><a href="' + place.url +
    '">' + place.name + '</a></b>';
  document.getElementById('iw-address').textContent = place.vicinity;

  if (place.formatted_phone_number) {
    document.getElementById('iw-phone-row').style.display = '';
    document.getElementById('iw-phone').textContent =
      place.formatted_phone_number;
  } else {
    document.getElementById('iw-phone-row').style.display = 'none';
  }

  // Assign a five-star rating to the hotel, using a black star ('&#10029;')
  // to indicate the rating the hotel has earned, and a white star ('&#10025;')
  // for the rating points not achieved.
  if (place.rating) {
    var ratingHtml = '';
    for (var i = 0; i < 5; i++) {
      if (place.rating < (i + 0.5)) {
        ratingHtml += '&#10025;';
      } else {
        ratingHtml += '&#10029;';
      }
      document.getElementById('iw-rating-row').style.display = '';
      document.getElementById('iw-rating').innerHTML = ratingHtml;
    }
  } else {
    document.getElementById('iw-rating-row').style.display = 'none';
  }

  // The regexp isolates the first part of the URL (domain plus subdomain)
  // to give a short URL for displaying in the info window.
  if (place.website) {
    var fullUrl = place.website;
    var website = hostnameRegexp.exec(place.website);
    if (website === null) {
      website = 'http://' + place.website + '/';
      fullUrl = website;
    }
    document.getElementById('iw-website-row').style.display = '';
    document.getElementById('iw-website').textContent = website;
  } else {
    document.getElementById('iw-website-row').style.display = 'none';
  }
};

//END OF GOOGLE MAPS API -------------------------------------------------------------------------------------------

