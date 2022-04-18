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

	// requires:
	var $Logic = $global.logic.SR.Inertial,
		$Model = $global.app.Model,
		$Control = $global.app.Control,
		$View = $global.app.View;

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
			precision: 3,
			resetHard: true,
			visible: {
				grid: true,
				line: true,
				part: true,
				cone: true,
				sync: true,
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
})(window, ko);
