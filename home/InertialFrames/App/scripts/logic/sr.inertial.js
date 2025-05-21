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

(function ($global) {
	"use strict";

	// requires:
	var $Math = $global["nan"].common.Math;

	// For b in [0,1] (mod 1)  // frame speed ("beta")
	// For t in [0,1] (mod 1)  // proper time ("tau")
	// 
	// Let t in [0,g]  // coordinate time
	// Let x in [-g,g]
	// Let v in [-1,1]

	/**
	 * Reference constructors: computed on speed.
	 * 
	 * @constructor
	 * @param {number} _b
	 */
	function Logic(_b) {
		var _g = $Math.gamma(_b);
		var _e = 1 / (1 + _b);

		function Part(f, b, p) {
			// t(tau) = f * tau * g^p
			// x(tau) = f*b * tau * g^p
			this.St = (t) => new $Math.Scalar(f * t, _g, p);
			this.Sx = (t) => new $Math.Scalar(f * b * t, _g, p);
			this.Svt = () => new $Math.Scalar(f, _g, p);
			this.Svx = () => new $Math.Scalar(f * b, _g, p);
		}

		function Simul() {
			// t(v, x, ct, cx) = ct + v(x - cx)
			// x(v, t, ct, cx) = cx + v(t - ct)
			this.h_t = (v, x, ct, cx) => ct + v * (x - cx);
			this.v_x = (v, t, ct, cx) => cx + v * (t - ct);
		}

		function Cone() {
			// t(x, ct, cx) = ct - cx + x
			// t(x, ct, cx) = ct + cx - x
			this.p_t = (x, ct, cx) => ct - cx + x;
			this.n_t = (x, ct, cx) => ct + cx - x;
		}

		this.partB = {
			B: {
				// tBA(tau) := tau
				// xBA(tau) := 0
				act: new Part(1, 0, 0),
				// tBS(tau) := tBA(tau/g) = tau/g
				// xBS(tau) := xBA(tau/g) = 0
				sim: new Part(1, 0, -1),
				// tBV(tau) := tBA(tau/(g(1+b))) = tau/(g(1+b))
				// xBV(tau) := xBA(tau/(g(1+b))) = 0
				vis: new Part(_e, 0, -1)
			},
			A: {
				// tAA(tau) := g*tau
				// xAA(tau) := gb*tau
				act: new Part(1, _b, 1),
				// tAS(tau) := tAA(tau/g) = tau
				// xAS(tau) := xAA(tau/g) = b*tau
				sim: new Part(1, _b, 0),
				// tAV(tau) := tAA(tau/(g(1+b))) = tau/(1+b)
				// xAV(tau) := xAA(tau/(g(1+b))) = b*tau/(1+b)
				vis: new Part(_e, _b, 0)
			}
		};

		this.simul = new Simul();
		this.cone = new Cone();
	}

	/**
	 * Particle B reference elements: computed on time.
	 * 
	 * @constructor
	 * @param {Logic} _logic
	 * @param {number} _t
	 */
	function Logic_PartB(_logic, _t) {
		return ["B", "A"].reduce((partB, pk1) => {
			partB[pk1] = ["act", "sim", "vis"].reduce((part, pk2) => {
				part[pk2] = {
					St: _logic.partB[pk1][pk2].St(_t),
					Sx: _logic.partB[pk1][pk2].Sx(_t),
					Svt: _logic.partB[pk1][pk2].Svt(),
					Svx: _logic.partB[pk1][pk2].Svx()
				};

				return part;
			}, {});

			return partB;
		}, {});
	}

	/**
	 * Frame B elements computed on speed.
	 * 
	 * @constructor
	 * @param {Logic} _logic
	 * @param {number} _b
	 */
	function FrameB_forSpeed(_logic, _b) {
		var _g = $Math.gamma(_b);

		this.grid = {
			T: {
				"gb/g": new $Math.Scalar(_b, _g, 1).val(-1)
			},
			X: {
				"1/g": new $Math.Scalar(1, _g, 0).val(-1)
			}
		};

		this.line = {
			B: {
				t0_dg: _logic.partB.B.act.St(0).val(-1),
				t1_dg: _logic.partB.B.act.St(1).val(-1),
				x0_dg: _logic.partB.B.act.Sx(0).val(-1),
				x1_dg: _logic.partB.B.act.Sx(1).val(-1)
			},
			A: {
				t0_dg: _logic.partB.A.act.St(0).val(-1),
				t1_dg: _logic.partB.A.act.St(1).val(-1),
				x0_dg: _logic.partB.A.act.Sx(0).val(-1),
				x1_dg: _logic.partB.A.act.Sx(1).val(-1)
			}
		};
	}

	/**
	 * Frame B elements computed on time.
	 * 
	 * @constructor
	 * @param {Logic} _logic
	 * @param {number} _b
	 * @param {number} _t
	 */
	function FrameB_forTime(_logic, _b, _t) {
		function _Part(part) {
			return {
				t: part.St.val(0),
				x: part.Sx.val(0),
				vt: part.Svt.val(0),
				vx: part.Svx.val(0),

				t_dg: part.St.val(-1),
				x_dg: part.Sx.val(-1),
				vt_dg: part.Svt.val(-1),
				vx_dg: part.Svx.val(-1)
			};
		}

		/** @type {*} */
		var _part = new Logic_PartB(_logic, _t);

		var _Ba = {
			t_dg: _part.B.act.St.val(-1),
			x_dg: _part.B.act.Sx.val(-1)
		};

		var _Aa = {
			t_dg: _part.A.act.St.val(-1),
			x_dg: _part.A.act.Sx.val(-1)
		};

		this.part = {
			B: {
				act: _Part(_part.B.act),
				sim: _Part(_part.B.sim),
				vis: _Part(_part.B.vis)
			},
			A: {
				act: _Part(_part.A.act),
				sim: _Part(_part.A.sim),
				vis: _Part(_part.A.vis)
			},
		};

		this.simul = {
			B: {
				v: {
					x0_dg: _logic.simul.v_x(0, 0, _Ba.t_dg, _Ba.x_dg),
					x1_dg: _logic.simul.v_x(0, 1, _Ba.t_dg, _Ba.x_dg)
				},
				h: {
					t0_dg: _logic.simul.h_t(0, 0, _Ba.t_dg, _Ba.x_dg),
					t1_dg: _logic.simul.h_t(0, 1, _Ba.t_dg, _Ba.x_dg)
				},
			},
			A: {
				v: {
					x0_dg: _logic.simul.v_x(_b, 0, _Aa.t_dg, _Aa.x_dg),
					x1_dg: _logic.simul.v_x(_b, 1, _Aa.t_dg, _Aa.x_dg)
				},
				h: {
					t0_dg: _logic.simul.h_t(_b, 0, _Aa.t_dg, _Aa.x_dg),
					t1_dg: _logic.simul.h_t(_b, 1, _Aa.t_dg, _Aa.x_dg)
				},
			}
		};

		this.cone = {
			B: {
				p: {
					t0_dg: _logic.cone.p_t(0, _Ba.t_dg, _Ba.x_dg),
					t1_dg: _logic.cone.p_t(1, _Ba.t_dg, _Ba.x_dg)
				},
				n: {
					t0_dg: _logic.cone.n_t(0, _Ba.t_dg, _Ba.x_dg),
					t1_dg: _logic.cone.n_t(1, _Ba.t_dg, _Ba.x_dg)
				}
			},
			A: {
				p: {
					t0_dg: _logic.cone.p_t(0, _Aa.t_dg, _Aa.x_dg),
					t1_dg: _logic.cone.p_t(1, _Aa.t_dg, _Aa.x_dg)
				},
				n: {
					t0_dg: _logic.cone.n_t(0, _Aa.t_dg, _Aa.x_dg),
					t1_dg: _logic.cone.n_t(1, _Aa.t_dg, _Aa.x_dg)
				}
			}
		};
	}

	/**
	 * Diagram logic.
	 * 
	 * @constructor
	 */
	function Diagram() {
		var _logic, _b, _t;

		this.setSpeed = function (b) {
			_b = $Math.cmod(b, 1);

			_logic = new Logic(_b);

			var frameB = new FrameB_forSpeed(_logic, _b);

			this.frameB.grid._onSpeed(frameB);
			this.frameA.grid._onSpeed(frameB);

			this.frameB.line._onSpeed(frameB);
			this.frameA.line._onSpeed(frameB);

			return _b;
		};

		this.setTime = function (t) {
			_t = $Math.cmod(t, 1);

			var frameB = new FrameB_forTime(_logic, _b, _t);

			this.frameB.part._onTime(frameB);
			this.frameA.part._onTime(frameB);

			this.frameB.simul._onTime(frameB);
			this.frameA.simul._onTime(frameB);

			this.frameB.cone._onTime(frameB);
			this.frameA.cone._onTime(frameB);

			this.hyper._onTime(frameB);

			return _t;
		};

		this.frameB = {
			grid: {
				T: {}, X: {},

				_onSpeed: function (/** @type {FrameB_forSpeed} */ frameB) {
					this.T = frameB.grid.T;

					this.X = frameB.grid.X;
				}
			},
			line: {
				B: {}, A: {},

				_onSpeed: function (/** @type {FrameB_forSpeed} */ frameB) {
					this.B = frameB.line.B;

					this.A = frameB.line.A;
				}
			},
			part: {
				B: {}, A: {},

				_onTime: function (/** @type {FrameB_forTime} */ frameB) {
					this.B = frameB.part.B;

					this.A = frameB.part.A;
				}
			},
			simul: {
				B: {}, A: {},

				_onTime: function (/** @type {FrameB_forTime} */ frameB) {
					this.B = frameB.simul.B;

					this.A = frameB.simul.A;
				}
			},
			cone: {
				B: {}, A: {},

				_onTime: function (/** @type {FrameB_forTime} */ frameB) {
					this.B = frameB.cone.B;

					this.A = frameB.cone.A;
				}
			}
		};

		this.frameA = {
			grid: {
				T: {}, X: {},

				_onSpeed: function (/** @type {FrameB_forSpeed} */ frameB) {
					this.T["-gb/g"] = -frameB.grid.T["gb/g"];

					this.X["1/g"] = frameB.grid.X["1/g"];
				}
			},
			line: {
				A: {}, B: {},

				_onSpeed: function (/** @type {FrameB_forSpeed} */ frameB) {
					this.A.t0_dg = frameB.line.B.t0_dg;
					this.A.t1_dg = frameB.line.B.t1_dg;
					this.A.x0_dg = -frameB.line.B.x0_dg;
					this.A.x1_dg = -frameB.line.B.x1_dg;

					this.B.t0_dg = frameB.line.A.t0_dg;
					this.B.t1_dg = frameB.line.A.t1_dg;
					this.B.x0_dg = -frameB.line.A.x0_dg;
					this.B.x1_dg = -frameB.line.A.x1_dg;
				}
			},
			part: {
				A: {}, B: {},

				_onTime: function (/** @type {FrameB_forTime} */ frameB) {
					function _Part(part) {
						return {
							t: part.t,
							x: -part.x,
							vt: part.vt,
							vx: -part.vx,

							t_dg: part.t_dg,
							x_dg: -part.x_dg,
							vt_dg: part.vt_dg,
							vx_dg: -part.vx_dg
						};
					}

					this.A.act = _Part(frameB.part.B.act);
					this.B.act = _Part(frameB.part.A.act);

					this.B.sim = _Part(frameB.part.A.sim);
					this.A.sim = _Part(frameB.part.B.sim);

					this.B.vis = _Part(frameB.part.A.vis);
					this.A.vis = _Part(frameB.part.B.vis);
				}
			},
			simul: {
				A: { h: {}, v: {} }, B: { h: {}, v: {} },

				_onTime: function (/** @type {FrameB_forTime} */ frameB) {
					this.A.h.t0_dg = frameB.simul.B.h.t0_dg;
					this.A.h.t1_dg = frameB.simul.B.h.t1_dg;
					this.A.v.x0_dg = -frameB.simul.B.v.x0_dg;
					this.A.v.x1_dg = -frameB.simul.B.v.x1_dg;

					this.B.h.t0_dg = frameB.simul.A.h.t0_dg;
					this.B.h.t1_dg = frameB.simul.A.h.t1_dg;
					this.B.v.x0_dg = -frameB.simul.A.v.x0_dg;
					this.B.v.x1_dg = -frameB.simul.A.v.x1_dg;
				}
			},
			cone: {
				A: {}, B: {},

				_onTime: function (/** @type {FrameB_forTime} */ frameB) {
					this.A = frameB.cone.B;

					this.B = frameB.cone.A;
				}
			}
		};

		this.hyper = {
			act: {}, sim: {}, vis: {},

			_onTime: function (/** @type {FrameB_forTime} */ frameB) {
				function Hyper_T_dg(p0, p1) {
					return function (x_dg, clipped) {
						if (!clipped || x_dg <= p1.x_dg) {
							return Math.sqrt(p0.t_dg * p0.t_dg + x_dg * x_dg);
						}
					};
				}

				var _B = frameB.part.B,
					_A = frameB.part.A;

				this.act = { T_dg: Hyper_T_dg(_B.act, _A.act) };
				this.sim = { T_dg: Hyper_T_dg(_B.sim, _A.sim) };
				this.vis = { T_dg: Hyper_T_dg(_B.vis, _A.vis) };
			}
		};
	}

	// Inertial(onSpeed: Function(), onTime: Function()): Inertial
	// SR in 1+1 dimensions, with c = 1, and cycle time = 1.
	function Inertial(onSpeed, onTime) {
		var _b, _t;

		var _diag = new Diagram();

		function setSpeed(b, t) {
			_b = _diag.setSpeed(b);

			setTime(t);
		}

		function setTime(t) {
			_t = _diag.setTime(t);
		}

		this.CYCLE_TIME = 1;
		this.gamma = $Math.gamma;

		this.speed = () => _b;
		this.time = () => _t;

		this.frameB = _diag.frameB;
		this.frameA = _diag.frameA;
		this.hyper = _diag.hyper;

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

	///////////////////////////////////////////////////////////////////////////

	// TODO: Export jsdoc, too... #####
	var $logic = $global["logic"] || {};
	$logic.SR = $logic.SR || {};
	$logic.SR.Inertial = Inertial;
	$global["logic"] = $logic;
})(window);
