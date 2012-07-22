var ROCKET, test, monitor;

ROCKET = require("../../RocketScience.js/RocketScience.js");
test = require("./Squiddle.js.test.js");

monitor = new ROCKET.monitors.Console();
monitor.switchOn();

test.lab.run();