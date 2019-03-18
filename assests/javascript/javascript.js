$(document).ready(function() {
  //initialize firebase
  var config = {
    apiKey: "AIzaSyAMzbLJSFoKtbItO-VD4Bk-IpXqogECnes",
    authDomain: "trainschedule-69f4d.firebaseapp.com",
    databaseURL: "https://trainschedule-69f4d.firebaseio.com",
    projectId: "trainschedule-69f4d",
    storageBucket: "trainschedule-69f4d.appspot.com",
    messagingSenderId: "696330048214"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  //button to add train information
  $("#add-train-btn").on("click", function(event) {
    event.preventDefault();

    //get user input
    var trainName = $("#train-name-input")
      .val()
      .trim();
    var destinationName = $("#destination-input")
      .val()
      .trim();
    var firstTrain = moment($("#first-train-input").val(), "HH:mm").format(
      "hh:mm"
    );
    var frequency = $("#frequency-input")
      .val()
      .trim();

    var newTrain = {
      train: trainName,
      destination: destinationName,
      first: firstTrain,
      trainRate: frequency
    };

    //upload transit information to the database
    database.ref().push(newTrain);

    console.log(newTrain.train);
    console.log(newTrain.destination);
    console.log(newTrain.first);
    console.log(newTrain.trainRate);

    //clearing all the text boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
  });

  //pushing transit info to the database and add a row into html
  database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());

    //store into a variable
    var trainName = childSnapshot.val().train;
    var destinationName = childSnapshot.val().destination;
    var firstTrain = childSnapshot.val().first;
    var frequency = childSnapshot.val().trainRate;

    //transit info
    console.log(trainName);
    console.log(destinationName);
    console.log(firstTrain);
    console.log(frequency);

    //taking transit time and taking it one year back
    var trainTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");

    //Current time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

    //Difference between time
    var differenceTime = moment().diff(moment(trainTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + differenceTime);

    //Time apart (remainder)
    var timeRemainder = differenceTime % frequency;

    //Minutes until train
    var minutesTillTrain = frequency - timeRemainder;
    console.log("MINUTES TILL TRAIN: " + minutesTillTrain);

    //next train arrival
    var nextTrain = moment().add(minutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));
    var nextArrival = moment(nextTrain).format("HH:mm");
    //create new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(destinationName),
      $("<td>").text(frequency),
      $("<td>").text(nextArrival),
      $("<td>").text(minutesTillTrain)
    );

    //Append new row to the table
    $("#schedule-table > tbody").append(newRow);
  });
});
