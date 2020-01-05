/*
InertialFrames version 1.0.0-alpha
STUDY.Physics.SpecialRelativity/InertialFrames
Physics case studies: Special Relativity: Inertial Frames

Copyright (C) 2020 Julio P. Di Egidio (http://julio.diegidio.name)
InertialFrames is part of the STUDY.Physics.SpecialRelativity collection
(see https://github.com/jp-diegidio/STUDY.Physics.SpecialRelativity).
InertialFrames is released under the terms of the GNU-GPLv3 license.
As usual, NO WARRANTY OF ANY KIND is implied.
*/

(function ($global, $ko) {
	"use strict";

	$global.app = $global.app || {};

	var STATE = {
		BOOTING: "BOOTING",
		STOPPED: "STOPPED",
		RUNNING: "RUNNING",
	};

	function FrameModel(frame) {
		var _grid = new $ko.observable(),
			_line = new $ko.observable(),
			_part = new $ko.observable(),
			_cone = new $ko.observable(),
			_sync = new $ko.observable();

		this.grid = new $ko.pureComputed(_grid);
		this.line = new $ko.pureComputed(_line);
		this.part = new $ko.pureComputed(_part);
		this.cone = new $ko.pureComputed(_cone);
		this.sync = new $ko.pureComputed(_sync);

		this.onSpeed = function () {
			_grid(frame.grid);
			_line(frame.line);
		};

		this.onTime = function () {
			_part(frame.part);
			_cone(frame.cone);
			_sync(frame.sync);
		}
	}

	function Model(Logic, options) {
		var DEF_SPEED = options.speed,
			DEF_TIME = options.time,
			DEF_TIME_MUL = options.timeMul,
			DEF_TIME_FREQ = options.timeFreq;

		var _state = new $ko.observable(STATE.BOOTING),
			_timeMul = new $ko.observable(),
			_timeFreq = new $ko.observable(),
			_speed = new $ko.observable(),
			_time = new $ko.observable();

		var _logic = new Logic(onSpeed, onTime);

		var _frameB = new FrameModel(_logic.frameB),
			_frameA = new FrameModel(_logic.frameA);

		function onSpeed() {
			_speed(_logic.speed());

			_frameB.onSpeed();
			_frameA.onSpeed();
		}

		function onTime() {
			_time(_logic.time());

			_frameB.onTime();
			_frameA.onTime();
		}

		this.CYCLE_TIME = _logic.CYCLE_TIME;

		this.STATE = STATE;

		this.state = new $ko.pureComputed(_state);
		this.timeMul = new $ko.pureComputed(_timeMul);
		this.timeFreq = new $ko.pureComputed(_timeFreq);
		this.speed = new $ko.pureComputed(_speed);
		this.time = new $ko.pureComputed(_time);

		this.frameB = _frameB;
		this.frameA = _frameA;

		this.gamma = new $ko.pureComputed(function () {
			var b = _speed();

			return _logic.GAMMA(b);
		});

		this.setTimeMul = function (tm) {
			_timeMul(tm);
		};

		this.setTimeFreq = function (tf) {
			_timeFreq(tf);
		};

		this.setSpeed = function (b) {
			_logic.setSpeed(b);
		};

		this.setTime = function (t) {
			_logic.setTime(t);
		};

		this.start = function () {
			_state(STATE.RUNNING);
		};

		this.stop = function () {
			_state(STATE.STOPPED);
		};

		this.reset = function (hard) {
			_state(STATE.STOPPED);

			if (hard) {
				_timeMul(DEF_TIME_MUL);
				_timeFreq(DEF_TIME_FREQ);
			}

			_logic.setSpeed(DEF_SPEED);
			_logic.setTime(DEF_TIME);
		};

		this.init = function () {
			_logic.init();

			this.reset(true);
		};
	}

	$global.app.Model = Model;
})(window, ko);
