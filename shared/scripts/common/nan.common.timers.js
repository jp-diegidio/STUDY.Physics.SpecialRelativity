/*
	STUDY.Physics.SpecialRelativity/Common
	Physics case studies: Special Relativity: Common Resources
	https://github.com/jp-diegidio/STUDY.Physics.SpecialRelativity
	Copyright (C) 2020-2025 Julio P. Di Egidio (http://julio.diegidio.name)
	This software is released under the terms of the GNU-GPLv3 license.
	As usual, NO WARRANTY OF ANY KIND is implied.
*/

(function ($global) {
	"use strict";

	///////////////////////////////////////////////////////////////////////////
	// SimpleTimer
	///////////////////////////////////////////////////////////////////////////

	/**
	 * Constructs a new {@link SimpleTimer} object.
	 * 
	 * @constructor SimpleTimer
	 * @param {() => void} onTick
	 */
	function SimpleTimer(onTick) {
		var _handle = null;

		function clear() {
			if (_handle !== null) {
				$global.clearTimeout(_handle);

				_handle = null;

				return true;
			}

			return false
		}

		function loop(interval) {
			var startTime = new Date().getTime();

			onTick();  // (sync)

			var nextTime = startTime + interval;

			var delay = nextTime - new Date().getTime();

			_handle = $global.setTimeout(() => {
				loop(interval);
			}, Math.max(delay, 0));
		}

		/**
		 * (Re)starts the timer.
		 * 
		 * @type {(interval: number) => boolean}
		 * @returns {boolean} True iff the timer was running.
		 */
		this.start = function start(interval) {
			var wasRunning = clear();

			$global.setTimeout(() => {
				loop(interval);
			}, 0);  // desync

			return wasRunning;
		};

		/**
		 * Stops the timer (if running).
		 * 
		 * @type {() => boolean}
		 * @returns {boolean} True iff the timer was running.
		 */
		this.stop = function stop() {
			var wasRunning = clear();

			return wasRunning;
		};
	}

	///////////////////////////////////////////////////////////////////////////

	// TODO: Export jsdoc, too... #####
	var $nan = $global["nan"] || {};
	$nan.common = $nan.common || {};
	$nan.common.timers = {
		SimpleTimer: SimpleTimer
	};
	$global["nan"] = $nan;
})(window);
