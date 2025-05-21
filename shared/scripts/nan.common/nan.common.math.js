/*
CommonResources/Nan.Common.Math version 1.1.0
STUDY.Physics.SpecialRelativity/CommonResources
Physics case studies: Special Relativity: Common Resources

Copyright (C) 2020-2022 Julio P. Di Egidio (http://julio.diegidio.name)
CommonResources is part of STUDY.Physics.SpecialRelativity
(see https://github.com/jp-diegidio/STUDY.Physics.SpecialRelativity).
CommonResources is released under the terms of the GNU-GPLv3 license.
As usual, NO WARRANTY OF ANY KIND is implied.
*/

(function ($global) {
	"use strict";

	///////////////////////////////////////////////////////////////////////////
	// Numbers
	///////////////////////////////////////////////////////////////////////////

	/**
	 * Computes the "closed modulo" of v by m.
	 * 
	 * @description
	 * cmod(v, m) := 0  if v == 0
	 *               m  if v <> 0 /\ v mod m == 0
	 *               v mod m  otherwise
	 * 
	 * @function cmod
	 * @param {number} v
	 * @param {number} m
	 * @returns {number}
	 */
	function cmod(v, m) {
		if (v === 0) { return 0; }
		v -= m * Math.floor(v / m);
		if (v === 0) { return m; }
		return v;
	}

	/**
	 * Computes the "clipping" of v in the interval [min, max].
	 * 
	 * @description
	 * clip(v, min, max) := min  if v < min
	 *                      max  if v > max
	 *                      v  otherwise
	 * 
	 * @function clip
	 * @param {number} v
	 * @param {number} min
	 * @param {number} max
	 * @returns {number}
	 */
	function clip(v, min, max) {
		if (v < min) { return min; }
		if (v > max) { return max; }
		return v;
	}

	/** 
	 * Computes the "relativistic gamma" of v.
	 * 
	 * @description
	 * gamma(v) := 1 / sqrt(1 - v**2)
	 * 
	 * @function gamma
	 * @param {number} v
	 * @returns {number}
	 */
	function gamma(v) {
		return 1 / Math.sqrt(1 - v * v);
	}

	///////////////////////////////////////////////////////////////////////////
	// Scalars
	///////////////////////////////////////////////////////////////////////////

	/**
	 * Constructs a new {@link Scalar} (i.e. "scalable number") object.
	 * 
	 * @description
	 * new Scalar(v, b, p).val(q) := 0  if v == 0
	 *                               v * b^(p+q)  otherwise
	 * 
	 * @constructor {Scalar} Scalar
	 * @param {number} v
	 * @param {number} b
	 * @param {number} p
	 */
	function Scalar(v, b, p) {
		/** @type {number} */ this.v = v;
		/** @type {number} */ this.b = b;
		/** @type {number} */ this.p = p;
	}

	/**
	 * Computes the scaled value of a {@link Scalar} object.
	 * 
	 * @description
	 * new Scalar(v, b, p).val(q) := 0  if v == 0
	 *                               v * b^(p+q)  otherwise
	 * 
	 * @method val
	 * @param {number} q
	 * @returns {number}
	 */
	Scalar.prototype.val = function (q) {
		if (this.v === 0) { return 0; }
		return this.v * Math.pow(this.b, this.p + q);
	};

	///////////////////////////////////////////////////////////////////////////

	// TODO: Export jsdoc, too... #####
	var $nan = $global["nan"] || {};
	$nan.common = $nan.common || {};
	$nan.common.Math = {
		cmod: cmod,
		clip: clip,
		gamma: gamma,
		Scalar: Scalar
	};
	$global["nan"] = $nan;
})(window);
