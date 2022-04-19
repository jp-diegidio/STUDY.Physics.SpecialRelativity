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

	// requires:
	var $cko = $global["nan"].common.ko;

	function HyperPath(logic, steps, clipped) {
		var points = [];

		for (var i = 0; i <= steps; ++i) {
			var x_dg = i / steps;                  // x_dg in [0,1]
			var t_dg = logic.T_dg(x_dg, clipped);  // t_dg in [0,g] | undefined

			if (typeof t_dg === "undefined") { break; }

			points.push({ t_dg: t_dg, x_dg: x_dg });
		}

		return points;
	}

	function HyperPathSVG(hyperPath) {
		var pointsSVG = hyperPath.map((point, index) => {
			return (index === 0 ? "M" : "L") +
				" " + point.x_dg + "," + point.t_dg;
		});

		return pointsSVG.join(" ");
	}

	function GraphView(frame, hSteps, hClipped) {
		this.line = new $ko.pureComputed(() => frame.line());
		this.part = new $ko.pureComputed(() => frame.part());
		this.simul = new $ko.pureComputed(() => frame.simul());
		this.cone = new $ko.pureComputed(() => frame.cone());
		this.grid = new $ko.pureComputed(() => frame.grid());

		this.hyper = new $ko.pureComputed(() => {
			function PathSVG(logic) {
				var path = HyperPath(logic, hSteps, hClipped);
				var pathSVG = HyperPathSVG(path);
				return pathSVG;
			}

			var _hyper = frame.hyper();

			return {
				act: { pathSVG: PathSVG(_hyper.act) },
				sim: { pathSVG: PathSVG(_hyper.sim) },
				vis: { pathSVG: PathSVG(_hyper.vis) }
			};
		});
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
		this.line = new $ko.observable(visible.line);
		this.part = new $ko.observable(visible.part);
		this.hyper = new $ko.observable(visible.hyper);
		this.simul = new $ko.observable(visible.simul);
		this.cone = new $ko.observable(visible.cone);
		this.grid = new $ko.observable(visible.grid);
		this.data = new $ko.observable(visible.data);
		this["d/g"] = new $ko.observable(visible["d/g"]);
	}

	function View(model, control, options) {
		var RESET_HARD = options.resetHard,
			PRECISION = options.precision,
			H_STEPS = options.hyper.steps,
			H_CLIPPED = options.hyper.clipped;

		var _visible = new ViewVisible(options.visible);

		this.precision = PRECISION;
		this.visible = _visible;

		this.graphB = new GraphView(model.frameB, H_STEPS, H_CLIPPED);
		this.graphA = new GraphView(model.frameA, H_STEPS, H_CLIPPED);
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
