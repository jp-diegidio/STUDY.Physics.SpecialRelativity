/*
	STUDY.Physics.SpecialRelativity/InertialFrames
	Physics case studies: Special Relativity: Inertial Frames
	https://github.com/jp-diegidio/STUDY.Physics.SpecialRelativity
	Copyright (C) 2020-2025 Julio P. Di Egidio (http://julio.diegidio.name)
	This software is released under the terms of the GNU-GPLv3 license.
	As usual, NO WARRANTY OF ANY KIND is implied.
*/

(function ($global, $ko) {
	"use strict";

	// requires:
	var $Logic = $global["logic"].SR.Inertial,
		$Model = $global["app"].Model,
		$Control = $global["app"].Control,
		$View = $global["app"].View;

	// mandatory:
	var OPTIONS = {
		model: {
			speed: 0.75,
			time: 1.0,
			timeMul: 0.5,
			timeFreq: 60
		},
		control: {},
		view: {
			resetHard: true,
			precision: 3,
			hyper: {
				steps: 100,
				clipped: false
			},
			visible: {
				line: true,
				part: true,
				hyper: true,
				simul: true,
				cone: true,
				grid: true,
				data: true,
				"d/g": false
			}
		}
	};

	var _model = new $Model($Logic, OPTIONS.model),
		_control = new $Control(_model, OPTIONS.control),
		_view = new $View(_model, _control, OPTIONS.view);

	$ko.options.deferUpdates = true;

	$global.addEventListener("load", function () {
		_control.init();

		$ko.applyBindings(_view);
	});
})(window, window["ko"]);
