# Garage Gate Remote

Making the dumb garage gate smart!

This is a simple project to upgrade my garage gate into a phone-controllable
gate. Overall, there are two parts involved:

## Servo that click the dumb garage remote

Most critical part. I will put some pictures later.

I'm using Johnny-five and node to control the servo.

## A set of web utils to control that servo

I'm using firebase tool sets to send command to the servo.

## First move of the servo

To get started, you need to create a firebase project. Then put your web app's
config in the garage_gate_arduino.js. Something like this:

```js
const firebaseConfig = {
  apiKey: "AIzaSyBOWhM327ZpJk0hIbxkANPQRpqRClYi1qM",
  authDomain: "garage-gate-75d0a.firebaseapp.com",
  databaseURL: "https://garage-gate-75d0a-default-rtdb.firebaseio.com",
  projectId: "garage-gate-75d0a",
  storageBucket: "garage-gate-75d0a.appspot.com",
  messagingSenderId: "203844306865",
  appId: "1:203844306865:web:1e4654ce522215a2d65f90"
};
```

Run the Johnny-five repl to control the servo and listen to the cloud event:

```bash
$node garage_gate_arduino.js 
```

Then, without doing any web UI, you can login your Firebase console, and in the
Realtime Database, create the following entry:

```json
{
  "gate" : {
    "action_request" : true
  }
}
```

Your servo should rotate (a.k.a click the dumb remote) and reset the
`gate.action_request` to false.

## Rasperberry Pi setup

Rasperberry Pi is used to control the Arduino which controls the servo. It only
needs to run the `garage_gate_arduino.js`.

To kick start, git pull this repo and then `npm install` from the root. Then
`node garage_gate_arduino.js`.
