$(document).ready(function () {

  // //FireBase
  // var config = {
  //   apiKey: "AIzaSyBAtqq6OLRE8qH6Cg85wu13NTJvuceB7vc",
  //   authDomain: "flights-c5a4a.firebaseapp.com",
  //   databaseURL: "https://flights-c5a4a.firebaseio.com",
  //   projectId: "flights-c5a4a",
  //   storageBucket: "flights-c5a4a.appspot.com",
  //   messagingSenderId: "962991801144"
  // };
  // firebase.initializeApp(config);

  // var database = firebase.database();

  $("#loader").hide();

  $("#submit").on("click", function () {

    console.log("has been clicked")

    $("#results").empty();

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
        $("#results").append(
          "<div id='airline_entries'>" + airlineName +
          "<br><a id='notice" + i + "'></a>" +
          "<br><a id='num" + i + "'>" + response.results[i].itineraries[0].outbound.flights[0].origin.airport +
          " --> " + response.results[i].itineraries[0].outbound.flights[0].destination.airport + "</a>" +
          "<br>" + stand_depTime + " - " + stand_arrivalTime +
          "<br> Seats Remaining: " + response.results[i].itineraries[0].outbound.flights[0].booking_info.seats_remaining +
          "<br> Duration: " + response.results[i].itineraries[0].outbound.duration +
          "<br> Price: $" + price +
          "</div><hr>");

        //Addition Stops
        if (response.results[i].itineraries[0].outbound.flights.length > 1) {
          console.log("1-stop");
          $("#notice" + i).append("1-Stop");
          $("#num" + i).append(" --> " + response.results[i].itineraries[0].outbound.flights[1].destination.airport);
        }
        else {
          console.log("non-stop");
          $("#notice" + i).append("Non-Stop");
        };

        displayLoader();
      }

    });
  });

  //Loader 
  function displayLoader() {
    if ($('#results').is(':empty')) {
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
    console.log("Has Been Selected");

    // //Putting into FireBase
    // database.ref().push({
    //   airlineName: airlineName,
    //   stand_depTime: stand_depTime,
    //   stand_arrivalTime: stand_arrivalTime,
    //   price: price
    // })

    // //Displaying into HTML
    // database.ref().on("value", function (snapshot) {

    //   // Log everything that's coming out of snapshot
    //   console.log(snapshot.val());
    //   console.log(snapshot.val().airlineName);
    //   console.log(snapshot.val().stand_depTime);
    //   console.log(snapshot.val().stand_arrivalTime);
    //   console.log(snapshot.val().price);

    //   $("#firebase_test").append(

    //     "<div>" +
    //     "<br>" + snapshot.val().airlineName + 
    //     "<br>" + snapshot.val().stand_depTime + 
    //     "<br>" + snapshot.val().stand_arrivalTime + 
    //     "<br>" + snapshot.val().price + 
    //     "</div>");

    //   // Handle the errors
    // }, function (errorObject) {
    //   console.log("Errors handled: " + errorObject.code);
    // });

  };

  $(document).on("click", "#airline_entries", isSelected);
});


//FireBase 
//Hotels

