/* 
Main code to run on the Rasperberry Pi

To run:
$ node garage_gate_arduino.js
*/

var five = require("johnny-five");
var board = new five.Board();
var firebase = require("firebase");

// Interval between each heartbeat, in second.
var kHeartBeatInterval = 60 * 10; // 10min.

// Initialize Firebase
var config = {
  apiKey: "AIzaSyDdDBiaz3lh8RAH1zeNJwRuaYK008JRQ0o",
  authDomain: "node-with-arduino.firebaseapp.com",
  databaseURL: "https://node-with-arduino.firebaseio.com",
  projectId: "node-with-arduino",
  storageBucket: "",
  messagingSenderId: "998248645588"
};
firebase.initializeApp(config);

var database = firebase.database();

function map_value(v, v_min, v_max, o_min, o_max) {
  return (v - v_min) / (v_max - v_min) * (o_max - o_min) + o_min;
}

function click_servo(servo) {
  var animation = new five.Animation(servo);
  animation.enqueue({
    duration: 1500,
    cuePoints: [0, 0.5, 1.0],
    keyFrames: [
        {degrees: 0},
        {degrees: 90, easing: "inOutCirc"},
        {degrees: 0, easing: "inOutCirc"}]
  });
}

function write_heartbeat() {
    database.ref("arduino").set({live_at: Date.now()});
}

board.on("ready", function() {
  var servo = new five.Servo(9);
  var led = new five.Led(13);

  servo.min();

  database.ref("gate").on('value', function(snapshot) {
    var gate = snapshot.val();
    if (gate.action_request) {
      console.log("Received command: ");
      console.log(new Date());

      click_servo(servo);
      gate.action_request = false;
      database.ref("gate").set(gate);
    }
  });

  this.on("exit", function() {
    servo.min();
  });

  write_heartbeat();
  setInterval(function() {
      write_heartbeat();
  }, kHeartBeatInterval * 1000);
});
