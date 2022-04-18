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
	var $cko = $global["nan"].common.ko;

	function GraphView(frame) {
		this.grid = new $ko.pureComputed(() => frame.grid());
		this.line = new $ko.pureComputed(() => frame.line());
		this.part = new $ko.pureComputed(() => frame.part());
		this.sync = new $ko.pureComputed(() => frame.sync());
		this.cone = new $ko.pureComputed(() => frame.cone());
	}

	function DataView(frame, visible_dg) {
		function _DATA(p) {
			return visible_dg() ?
				{ T: p.t_dg, X: p.x_dg, VT: p.vt_dg, VX: p.vx_dg } :
				{ T: p.t, X: p.x, VT: p.vt, VX: p.vx };
		}

		this.B = {
			act: new $ko.pureComputed(() => _DATA(frame.part().B.act)),
			sim: new $ko.pureComputed(() => _DATA(frame.part().B.sim)),
			vis: new $ko.pureComputed(() => _DATA(frame.part().B.vis))
		};

		this.A = {
			act: new $ko.pureComputed(() => _DATA(frame.part().A.act)),
			sim: new $ko.pureComputed(() => _DATA(frame.part().A.sim)),
			vis: new $ko.pureComputed(() => _DATA(frame.part().A.vis))
		};
	}

	function CtrlView(model, control, resetHard) {
		this.STATE = control.STATE;

		this.state = new $ko.pureComputed(control.state);

		this.timeMul = new $cko.PureComputedAsNumber({
			get: model.timeMul,
			set: control.setTimeMul
		});

		this.timeFreq = new $cko.PureComputedAsNumber({
			get: model.timeFreq,
			set: control.setTimeFreq
		});

		this.speed = new $cko.PureComputedAsNumber({
			get: model.speed,
			set: control.setSpeed
		});

		this.time = new $cko.PureComputedAsNumber({
			get: model.time,
			set: control.setTime
		});

		this.onStartEdit = function () {
			control.stop();

			return true;  // ko propagate event
		};

		this.canStart = control.canStart;
		this.canStop = control.canStop;
		this.canReset = control.canReset;

		this.start = function () { control.start(); };
		this.stop = function () { control.stop(); };
		this.reset = function () { control.reset(resetHard); };
	}

	function InfoView(model) {
		this.speed = model.speed;
		this.time = model.time;
		this.beta = model.speed;
		this.gamma = model.gamma;
	}

	function ViewVisible(visible) {
		this.grid = new $ko.observable(visible.grid);
		this.line = new $ko.observable(visible.line);
		this.part = new $ko.observable(visible.part);
		this.cone = new $ko.observable(visible.cone);
		this.sync = new $ko.observable(visible.sync);
		this.data = new $ko.observable(visible.data);
		this["d/g"] = new $ko.observable(visible["d/g"]);
	}

	function View(model, control, options) {
		var PRECISION = options.precision,
			RESET_HARD = options.resetHard;

		var _visible = new ViewVisible(options.visible);

		this.precision = PRECISION;
		this.visible = _visible;

		this.graphB = new GraphView(model.frameB);
		this.graphA = new GraphView(model.frameA);
		this.dataB = new DataView(model.frameB, _visible["d/g"]);
		this.dataA = new DataView(model.frameA, _visible["d/g"]);
		this.ctrl = new CtrlView(model, control, RESET_HARD);
		this.info = new InfoView(model);
	}

	///////////////////////////////////////////////////////////////////////////

	// TODO: Export jsdoc, too... #####
	var $app = $global["app"] || {};
	$app.View = View;
	$global["app"] = $app;
})(window, window["ko"]);
