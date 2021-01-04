/*
One off example code to test if everything works.
Suggest to run this when the Arduino is plugged into your main
computer.

Usage: 
$ node simple_ex.js
(This will open a repl)
$ on()
(should turn on the built-in LED)
$ off()
(turn the LED off)
*/

var five = require("johnny-five");
var board = new five.Board();

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

board.on("ready", function() {
  console.log("Ready event. Repl instance auto-initialized!");

  var led = new five.Led(13);
  var servo = new five.Servo(9);

  this.repl.inject({
    // Allow limited on/off control access to the
    // Led instance from the REPL.
    on: function() {
      led.on();
    },
    off: function() {
      led.off();
    },
    click: function() {
        click_servo(servo);
    }
  });
});
