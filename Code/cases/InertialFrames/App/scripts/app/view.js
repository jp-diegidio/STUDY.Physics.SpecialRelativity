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

	// requires:
	var $common = $global.nan.common;

	function GraphView(frame) {
		var _F = frame;

		this.grid = {
			T: new $ko.pureComputed(function () { return _F.grid().T; }),
			X: new $ko.pureComputed(function () { return _F.grid().X; })
		};

		this.line = {
			B: new $ko.pureComputed(function () { return _F.line().B; }),
			A: new $ko.pureComputed(function () { return _F.line().A; })
		};

		this.part = {
			BR: new $ko.pureComputed(function () { return _F.part().BR; }),
			AR: new $ko.pureComputed(function () { return _F.part().AR; }),
			AS: new $ko.pureComputed(function () { return _F.part().AS; }),
			BS: new $ko.pureComputed(function () { return _F.part().BS; }),
			AA: new $ko.pureComputed(function () { return _F.part().AA; }),
			BA: new $ko.pureComputed(function () { return _F.part().BA; })
		};

		this.cone = {
			Bp: new $ko.pureComputed(function () { return _F.cone().Bp; }),
			Bn: new $ko.pureComputed(function () { return _F.cone().Bn; }),
			Ap: new $ko.pureComputed(function () { return _F.cone().Ap; }),
			An: new $ko.pureComputed(function () { return _F.cone().An; })
		};

		this.sync = {
			BRv: new $ko.pureComputed(function () { return _F.sync().BRv; }),
			BRh: new $ko.pureComputed(function () { return _F.sync().BRh; }),
			ARv: new $ko.pureComputed(function () { return _F.sync().ARv; }),
			ARh: new $ko.pureComputed(function () { return _F.sync().ARh; })
		};
	}

	function DataView(frame, visible_dg) {
		var _F = frame,
			_V_dg = visible_dg;

		function _DATA(p) {
			return _V_dg() ?
				{
					T: p.t_dg,
					X: p.x_dg,
					VT: p.vt_dg,
					VX: p.vx_dg
				} :
				{
					T: p.t,
					X: p.x,
					VT: p.vt,
					VX: p.vx
				};
		}

		this.dg = _V_dg;

		this.BR = new $ko.pureComputed(function () { return _DATA(_F.part().BR); });
		this.AR = new $ko.pureComputed(function () { return _DATA(_F.part().AR); });
		this.AS = new $ko.pureComputed(function () { return _DATA(_F.part().AS); });
		this.BS = new $ko.pureComputed(function () { return _DATA(_F.part().BS); });
		this.AA = new $ko.pureComputed(function () { return _DATA(_F.part().AA); });
		this.BA = new $ko.pureComputed(function () { return _DATA(_F.part().BA); });
	}

	function CtrlView(model, control, resetHard) {
		this.STATE = control.STATE;

		this.state = new $ko.pureComputed(control.state);

		this.timeMul = new $common.KoPureComputedAsNumber({
			get: model.timeMul,
			set: control.setTimeMul
		});

		this.timeFreq = new $common.KoPureComputedAsNumber({
			get: model.timeFreq,
			set: control.setTimeFreq
		});

		this.speed = new $common.KoPureComputedAsNumber({
			get: model.speed,
			set: control.setSpeed
		});

		this.time = new $common.KoPureComputedAsNumber({
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

	$global.app.View = View;
})(window, ko);
