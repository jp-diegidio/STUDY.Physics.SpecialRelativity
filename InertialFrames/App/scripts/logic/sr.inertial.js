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

(function ($global) {
	"use strict";

	$global.logic = $global.logic || {};

	function MOD(t, m) {
		if (t === 0) { return 0; }
		t = t > 0 ? t % m : (m + t % m) % m;
		if (t === 0) { return m; }
		return t;
	}

	function GAMMA(v) {
		return 1 / Math.sqrt(1 - v * v);
	}

	function Value(g, v, f) {
		// val = v * g^(f+p)

		this._g = g;
		this._v = v;
		this._f = f;

		this.val = function (p) {
			return v === 0 ? 0 : v * Math.pow(g, f + p);
		};
	}

	function Calc() {
		// For b in [0,1] (mod 1):    // speed
		// For t in [0,1] (mod 1):    // time (proper)

		// Let t in [0,g]:
		// Let x in [0,g]:

		var self = this;

		var _b, _g, _1d1pb, _t;

		this.setSpeed = function (b) {
			_b = MOD(b, 1);
			_g = GAMMA(_b);
			_1d1pb = 1 / (1 + _b);

			// START: Keep order!

			self.frameB.grid._onSpeed();
			self.frameA.grid._onSpeed();

			self.frameB.line._onSpeed();
			self.frameA.line._onSpeed();

			// END: Keep order!

			return _b;
		};

		this.setTime = function (t) {
			_t = MOD(t, 1);

			// START: Keep order!

			self.frameB._part._onTime();

			self.frameB.part._onTime();
			self.frameA.part._onTime();

			self.frameB.cone._onTime();
			self.frameA.cone._onTime();

			self.frameB.sync._onTime();
			self.frameA.sync._onTime();

			// END: Keep order!

			return _t;
		};

		var _pRealB = {
			// tBR(t) = t, xBR(t) = 0
			BR_t: function (t) { return new Value(_g, t, 0); },
			BR_x: function (t) { return new Value(_g, 0, 0); },
			BR_vt: function () { return new Value(_g, 1, 0); },
			BR_vx: function () { return new Value(_g, 0, 0); },

			// tAR(t) = gt, xAR(t) = gbt
			AR_t: function (t) { return new Value(_g, t, 1); },
			AR_x: function (t) { return new Value(_g, _b * t, 1); },
			AR_vt: function () { return new Value(_g, 1, 1); },
			AR_vx: function () { return new Value(_g, _b, 1); }
		};

		var _pSimB = {
			// tAS(t) = tAR(t/g) = t, xAS(t) = xAR(t/g) = bt
			AS_t: function (t) { return new Value(_g, t, 0); },
			AS_x: function (t) { return new Value(_g, _b * t, 0); },
			AS_vt: function () { return new Value(_g, 1, 0); },
			AS_vx: function () { return new Value(_g, _b, 0); },

			// tBS(t) = tBR(t/g) = t/g, xBS(t) = xBR(t/g) = 0
			BS_t: function (t) { return new Value(_g, t, -1); },
			BS_x: function (t) { return new Value(_g, 0, -1); },
			BS_vt: function () { return new Value(_g, 1, -1); },
			BS_vx: function () { return new Value(_g, 0, -1); }
		};

		var _pAppB = {
			// tAA(t) = tAR(t/(g(1+b))) = t/(1+b), xAA(t) = xAR(t/(g(1+b))) = bt/(1+b)
			AA_t: function (t) { return new Value(_g, _1d1pb * t, 0); },
			AA_x: function (t) { return new Value(_g, _1d1pb * _b * t, 0); },
			AA_vt: function () { return new Value(_g, _1d1pb, 0); },
			AA_vx: function () { return new Value(_g, _1d1pb * _b, 0); },

			// tBA(t) = tBR(t/(g(1+b))) = t/(g(1+b)), xBA(t) = xBR(t/(g(1+b))) = 0
			BA_t: function (t) { return new Value(_g, _1d1pb * t, -1); },
			BA_x: function (t) { return new Value(_g, 0, -1); },
			BA_vt: function () { return new Value(_g, _1d1pb, -1); },
			BA_vx: function () { return new Value(_g, 0, -1); }
		};

		var _cone = {
			// t = ct - cx + x
			p_t: function (x, ct, cx) { return ct - cx + x; },
			// t = ct + cx - x
			n_t: function (x, ct, cx) { return ct + cx - x; }
		};

		var _sync = {
			// t = ct + v(x - cx)
			h_t: function (v, x, ct, cx) { return ct + v * (x - cx); },
			// x = cx + v(t - ct)
			v_x: function (v, t, ct, cx) { return cx + v * (t - ct); }
		};

		this.frameB = {
			_part: {
				BR: {}, AR: {}, AS: {}, BS: {}, AA: {}, BA: {},
				_onTime: function () {
					this.BR.t = _pRealB.BR_t(_t);
					this.BR.x = _pRealB.BR_x(_t);
					this.BR.vt = _pRealB.BR_vt();
					this.BR.vx = _pRealB.BR_vx();

					this.AR.t = _pRealB.AR_t(_t);
					this.AR.x = _pRealB.AR_x(_t);
					this.AR.vt = _pRealB.AR_vt();
					this.AR.vx = _pRealB.AR_vx();

					this.AS.t = _pSimB.AS_t(_t);
					this.AS.x = _pSimB.AS_x(_t);
					this.AS.vt = _pSimB.AS_vt();
					this.AS.vx = _pSimB.AS_vx();

					this.BS.t = _pSimB.BS_t(_t);
					this.BS.x = _pSimB.BS_x(_t);
					this.BS.vt = _pSimB.BS_vt();
					this.BS.vx = _pSimB.BS_vx();

					this.AA.t = _pAppB.AA_t(_t);
					this.AA.x = _pAppB.AA_x(_t);
					this.AA.vt = _pAppB.AA_vt();
					this.AA.vx = _pAppB.AA_vx();

					this.BA.t = _pAppB.BA_t(_t);
					this.BA.x = _pAppB.BA_x(_t);
					this.BA.vt = _pAppB.BA_vt();
					this.BA.vx = _pAppB.BA_vx();
				}
			},
			grid: {
				T: {}, X: {},
				_onSpeed: function () {
					this.T["1/g"] = 1 / _g;

					this.X["gb/g"] = _b;
				}
			},
			line: {
				B: {}, A: {},
				_onSpeed: function () {
					this.B.t0_dg = _pRealB.BR_t(0).val(-1);
					this.B.t1_dg = _pRealB.BR_t(1).val(-1);
					this.B.x0_dg = _pRealB.BR_x(0).val(-1);
					this.B.x1_dg = _pRealB.BR_x(1).val(-1);

					this.A.t0_dg = _pRealB.AR_t(0).val(-1);
					this.A.t1_dg = _pRealB.AR_t(1).val(-1);
					this.A.x0_dg = _pRealB.AR_x(0).val(-1);
					this.A.x1_dg = _pRealB.AR_x(1).val(-1);
				}
			},
			part: {
				BR: {}, AR: {}, AS: {}, BS: {}, AA: {}, BA: {},
				_onTime: function () {
					var _BR = self.frameB._part.BR,
						_AR = self.frameB._part.AR,
						_AS = self.frameB._part.AS,
						_BS = self.frameB._part.BS,
						_AA = self.frameB._part.AA,
						_BA = self.frameB._part.BA;

					this.BR.t = _BR.t.val(0);
					this.BR.x = _BR.x.val(0);
					this.BR.vt = _BR.vt.val(0);
					this.BR.vx = _BR.vx.val(0);

					this.AR.t = _AR.t.val(0);
					this.AR.x = _AR.x.val(0);
					this.AR.vt = _AR.vt.val(0);
					this.AR.vx = _AR.vx.val(0);

					this.AS.t = _AS.t.val(0);
					this.AS.x = _AS.x.val(0);
					this.AS.vt = _AS.vt.val(0);
					this.AS.vx = _AS.vx.val(0);

					this.BS.t = _BS.t.val(0);
					this.BS.x = _BS.x.val(0);
					this.BS.vt = _BS.vt.val(0);
					this.BS.vx = _BS.vx.val(0);

					this.AA.t = _AA.t.val(0);
					this.AA.x = _AA.x.val(0);
					this.AA.vt = _AA.vt.val(0);
					this.AA.vx = _AA.vx.val(0);

					this.BA.t = _BA.t.val(0);
					this.BA.x = _BA.x.val(0);
					this.BA.vt = _BA.vt.val(0);
					this.BA.vx = _BA.vx.val(0);

					this.BR.t_dg = _BR.t.val(-1);
					this.BR.x_dg = _BR.x.val(-1);
					this.BR.vt_dg = _BR.vt.val(-1);
					this.BR.vx_dg = _BR.vx.val(-1);

					this.AR.t_dg = _AR.t.val(-1);
					this.AR.x_dg = _AR.x.val(-1);
					this.AR.vt_dg = _AR.vt.val(-1);
					this.AR.vx_dg = _AR.vx.val(-1);

					this.AS.t_dg = _AS.t.val(-1);
					this.AS.x_dg = _AS.x.val(-1);
					this.AS.vt_dg = _AS.vt.val(-1);
					this.AS.vx_dg = _AS.vx.val(-1);

					this.BS.t_dg = _BS.t.val(-1);
					this.BS.x_dg = _BS.x.val(-1);
					this.BS.vt_dg = _BS.vt.val(-1);
					this.BS.vx_dg = _BS.vx.val(-1);

					this.AA.t_dg = _AA.t.val(-1);
					this.AA.x_dg = _AA.x.val(-1);
					this.AA.vt_dg = _AA.vt.val(-1);
					this.AA.vx_dg = _AA.vx.val(-1);

					this.BA.t_dg = _BA.t.val(-1);
					this.BA.x_dg = _BA.x.val(-1);
					this.BA.vt_dg = _BA.vt.val(-1);
					this.BA.vx_dg = _BA.vx.val(-1);
				}
			},
			cone: {
				Bp: {}, Bn: {}, Ap: {}, An: {},
				_onTime: function () {
					var _BR = self.frameB.part.BR,
						_AR = self.frameB.part.AR;

					this.Bp.t0_dg = _cone.p_t(0, _BR.t_dg, _BR.x_dg);
					this.Bp.t1_dg = _cone.p_t(1, _BR.t_dg, _BR.x_dg);
					this.Bn.t0_dg = _cone.n_t(0, _BR.t_dg, _BR.x_dg);
					this.Bn.t1_dg = _cone.n_t(1, _BR.t_dg, _BR.x_dg);

					this.Ap.t0_dg = _cone.p_t(0, _AR.t_dg, _AR.x_dg);
					this.Ap.t1_dg = _cone.p_t(1, _AR.t_dg, _AR.x_dg);
					this.An.t0_dg = _cone.n_t(0, _AR.t_dg, _AR.x_dg);
					this.An.t1_dg = _cone.n_t(1, _AR.t_dg, _AR.x_dg);
				}
			},
			sync: {
				BRv: {}, BRh: {}, ARv: {}, ARh: {},
				_onTime: function () {
					var _BR = self.frameB.part.BR,
						_AR = self.frameB.part.AR;

					this.BRh.t0_dg = _sync.h_t(0, 0, _BR.t_dg, _BR.x_dg);
					this.BRh.t1_dg = _sync.h_t(0, 1, _BR.t_dg, _BR.x_dg);
					this.BRv.x0_dg = _sync.v_x(0, 0, _BR.t_dg, _BR.x_dg);
					this.BRv.x1_dg = _sync.v_x(0, 1, _BR.t_dg, _BR.x_dg);

					this.ARh.t0_dg = _sync.h_t(_b, 0, _AR.t_dg, _AR.x_dg);
					this.ARh.t1_dg = _sync.h_t(_b, 1, _AR.t_dg, _AR.x_dg);
					this.ARv.x0_dg = _sync.v_x(_b, 0, _AR.t_dg, _AR.x_dg);
					this.ARv.x1_dg = _sync.v_x(_b, 1, _AR.t_dg, _AR.x_dg);
				}
			}
		};

		this.frameA = {
			grid: {
				T: {}, X: {},
				_onSpeed: function () {
					var _T = self.frameB.grid.T,
						_X = self.frameB.grid.X;

					this.T["1/g"] = _T["1/g"];

					this.X["-gb/g"] = -_X["gb/g"];
				}
			},
			line: {
				A: {}, B: {},
				_onSpeed: function () {
					var _B = self.frameB.line.B,
						_A = self.frameB.line.A;

					this.A.t0_dg = _B.t0_dg;
					this.A.t1_dg = _B.t1_dg;
					this.A.x0_dg = -_B.x0_dg;
					this.A.x1_dg = -_B.x1_dg;

					this.B.t0_dg = _A.t0_dg;
					this.B.t1_dg = _A.t1_dg;
					this.B.x0_dg = -_A.x0_dg;
					this.B.x1_dg = -_A.x1_dg;
				}
			},
			part: {
				AR: {}, BR: {}, BS: {}, AS: {}, BA: {}, AA: {},
				_onTime: function () {
					var _BR = self.frameB.part.BR,
						_AR = self.frameB.part.AR,
						_AS = self.frameB.part.AS,
						_BS = self.frameB.part.BS,
						_AA = self.frameB.part.AA,
						_BA = self.frameB.part.BA;

					this.AR.t = _BR.t;
					this.AR.x = -_BR.x;
					this.AR.vt = _BR.vt;
					this.AR.vx = -_BR.vx;

					this.BR.t = _AR.t;
					this.BR.x = -_AR.x;
					this.BR.vt = _AR.vt;
					this.BR.vx = -_AR.vx;

					this.BS.t = _AS.t;
					this.BS.x = -_AS.x;
					this.BS.vt = _AS.vt;
					this.BS.vx = -_AS.vx;

					this.AS.t = _BS.t;
					this.AS.x = -_BS.x;
					this.AS.vt = _BS.vt;
					this.AS.vx = -_BS.vx;

					this.BA.t = _AA.t;
					this.BA.x = -_AA.x;
					this.BA.vt = _AA.vt;
					this.BA.vx = -_AA.vx;

					this.AA.t = _BA.t;
					this.AA.x = -_BA.x;
					this.AA.vt = _BA.vt;
					this.AA.vx = -_BA.vx;

					this.AR.t_dg = _BR.t_dg;
					this.AR.x_dg = -_BR.x_dg;
					this.AR.vt_dg = _BR.vt_dg;
					this.AR.vx_dg = -_BR.vx_dg;

					this.BR.t_dg = _AR.t_dg;
					this.BR.x_dg = -_AR.x_dg;
					this.BR.vt_dg = _AR.vt_dg;
					this.BR.vx_dg = -_AR.vx_dg;

					this.BS.t_dg = _AS.t_dg;
					this.BS.x_dg = -_AS.x_dg;
					this.BS.vt_dg = _AS.vt_dg;
					this.BS.vx_dg = -_AS.vx_dg;

					this.AS.t_dg = _BS.t_dg;
					this.AS.x_dg = -_BS.x_dg;
					this.AS.vt_dg = _BS.vt_dg;
					this.AS.vx_dg = -_BS.vx_dg;

					this.BA.t_dg = _AA.t_dg;
					this.BA.x_dg = -_AA.x_dg;
					this.BA.vt_dg = _AA.vt_dg;
					this.BA.vx_dg = -_AA.vx_dg;

					this.AA.t_dg = _BA.t_dg;
					this.AA.x_dg = -_BA.x_dg;
					this.AA.vt_dg = _BA.vt_dg;
					this.AA.vx_dg = -_BA.vx_dg;
				}
			},
			cone: {
				Ap: {}, An: {}, Bp: {}, Bn: {},
				_onTime: function () {
					var _AR = self.frameA.part.AR,
						_BR = self.frameA.part.BR;

					this.Ap.t0_dg = _cone.p_t(0, _AR.t_dg, _AR.x_dg);
					this.Ap.t1_dg = _cone.p_t(-1, _AR.t_dg, _AR.x_dg);
					this.An.t0_dg = _cone.n_t(0, _AR.t_dg, _AR.x_dg);
					this.An.t1_dg = _cone.n_t(-1, _AR.t_dg, _AR.x_dg);

					this.Bp.t0_dg = _cone.p_t(0, _BR.t_dg, _BR.x_dg);
					this.Bp.t1_dg = _cone.p_t(-1, _BR.t_dg, _BR.x_dg);
					this.Bn.t0_dg = _cone.n_t(0, _BR.t_dg, _BR.x_dg);
					this.Bn.t1_dg = _cone.n_t(-1, _BR.t_dg, _BR.x_dg);
				}
			},
			sync: {
				ARv: {}, ARh: {}, BRv: {}, BRh: {},
				_onTime: function () {
					var _AR = self.frameA.part.AR,
						_BR = self.frameA.part.BR;

					this.ARh.t0_dg = _sync.h_t(0, 0, _AR.t_dg, _AR.x_dg);
					this.ARh.t1_dg = _sync.h_t(0, -1, _AR.t_dg, _AR.x_dg);
					this.ARv.x0_dg = _sync.v_x(0, 0, _AR.t_dg, _AR.x_dg);
					this.ARv.x1_dg = _sync.v_x(0, 1, _AR.t_dg, _AR.x_dg);

					this.BRh.t0_dg = _sync.h_t(-_b, 0, _BR.t_dg, _BR.x_dg);
					this.BRh.t1_dg = _sync.h_t(-_b, -1, _BR.t_dg, _BR.x_dg);
					this.BRv.x0_dg = _sync.v_x(-_b, 0, _BR.t_dg, _BR.x_dg);
					this.BRv.x1_dg = _sync.v_x(-_b, 1, _BR.t_dg, _BR.x_dg);
				}
			}
		};
	}

	// Inertial(onSpeed: Function(), onTime: Function()): Inertial
	// In natural units, cycle time is 1.
	function Inertial(onSpeed, onTime) {
		var _b, _t;

		var _calc = new Calc();

		function setSpeed(b, t) {
			_b = _calc.setSpeed(b);

			setTime(t);
		}

		function setTime(t) {
			_t = _calc.setTime(t);
		}

		this.CYCLE_TIME = 1;
		this.GAMMA = GAMMA;

		this.speed = function () { return _b; };
		this.time = function () { return _t; };

		this.frameB = _calc.frameB;
		this.frameA = _calc.frameA;

		this.setSpeed = function (b) {
			setSpeed(b, _t);

			onSpeed();
			onTime();
		};

		this.setTime = function (t) {
			setTime(t);

			onTime();
		};

		this.init = function () {
			setSpeed(0, 0);
		};
	}

	$global.logic.SR = {
		Inertial: Inertial
	};
})(window);
