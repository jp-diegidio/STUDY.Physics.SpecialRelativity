/*
InertialFrames version 1.1.0
STUDY.Physics.SpecialRelativity/InertialFrames
Physics case studies: Special Relativity: Inertial Frames

Copyright (C) 2020-2022 Julio P. Di Egidio (http://julio.diegidio.name)
InertialFrames is part of STUDY.Physics.SpecialRelativity
(see https://github.com/jp-diegidio/STUDY.Physics.SpecialRelativity).
InertialFrames is released under the terms of the GNU-GPLv3 license.
As usual, NO WARRANTY OF ANY KIND is implied.
*/

(function ($global, $ko) {
	"use strict";

	function FrameModel(frame, hyper) {
		var _grid = new $ko.observable(),
			_line = new $ko.observable(),
			_part = new $ko.observable(),
			_simul = new $ko.observable(),
			_cone = new $ko.observable(),
			_hyper = new $ko.observable();

		this.grid = new $ko.pureComputed(_grid);
		this.line = new $ko.pureComputed(_line);
		this.part = new $ko.pureComputed(_part);
		this.simul = new $ko.pureComputed(_simul);
		this.cone = new $ko.pureComputed(_cone);
		this.hyper = new $ko.pureComputed(_hyper);

		this.onSpeed = function () {
			_grid(frame.grid);
			_line(frame.line);
		};

		this.onTime = function () {
			_part(frame.part);
			_simul(frame.simul);
			_cone(frame.cone);

			_hyper(hyper);
		}
	}

	function Model(Logic, options) {
		var DEF_SPEED = options.speed,
			DEF_TIME = options.time,
			DEF_TIME_MUL = options.timeMul,
			DEF_TIME_FREQ = options.timeFreq;

		var _timeMul = new $ko.observable(),
			_timeFreq = new $ko.observable(),
			_speed = new $ko.observable(),
			_time = new $ko.observable();

		var _logic = new Logic(onSpeed, onTime);

		var _frameB = new FrameModel(_logic.frameB, _logic.hyper),
			_frameA = new FrameModel(_logic.frameA, _logic.hyper);

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

		this.timeMul = new $ko.pureComputed(_timeMul);
		this.timeFreq = new $ko.pureComputed(_timeFreq);
		this.speed = new $ko.pureComputed(_speed);
		this.time = new $ko.pureComputed(_time);

		this.frameB = _frameB;
		this.frameA = _frameA;

		this.gamma = new $ko.pureComputed(function () {
			var b = _speed();

			return _logic.gamma(b);
		});

		this.setTimeMul = function (tm) { _timeMul(tm); };
		this.setTimeFreq = function (tf) { _timeFreq(tf); };
		this.setSpeed = function (b) { _logic.setSpeed(b); };
		this.setTime = function (t) { _logic.setTime(t); };

		this.reset = function (hard) {
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

	///////////////////////////////////////////////////////////////////////////

	// TODO: Export jsdoc, too... #####
	var $app = $global["app"] || {};
	$app.Model = Model;
	$global["app"] = $app;
})(window, window["ko"]);
