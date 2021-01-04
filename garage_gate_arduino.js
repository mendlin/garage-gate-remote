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
const firebaseConfig = {
  apiKey: "AIzaSyBOWhM327ZpJk0hIbxkANPQRpqRClYi1qM",
  authDomain: "garage-gate-75d0a.firebaseapp.com",
  databaseURL: "https://garage-gate-75d0a-default-rtdb.firebaseio.com",
  projectId: "garage-gate-75d0a",
  storageBucket: "garage-gate-75d0a.appspot.com",
  messagingSenderId: "203844306865",
  appId: "1:203844306865:web:1e4654ce522215a2d65f90"
};
firebase.initializeApp(firebaseConfig);

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
