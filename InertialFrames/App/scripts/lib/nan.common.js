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

	$global.nan = $global.nan || {};

	function SimpleTimer(onTick) {
		var _handle = null,
			_interval;

		function clear() {
			$global.clearTimeout(_handle);

			_handle = null;
		}

		function loop() {
			var startTime = new Date().getTime();

			onTick();  // (sync)

			var nextTime = startTime + _interval;

			var delay = nextTime - new Date().getTime();

			_handle = $global.setTimeout(loop, Math.max(delay, 0));
		}

		this.start = function (interval) {
			if (_handle !== null) {
				clear();
			}

			_interval = interval;

			$global.setTimeout(loop, 0);  // desync
		};

		this.stop = function () {
			if (_handle !== null) {
				clear();

				return true;
			}

			return false
		};
	}

	function KoPureComputedValue(options) {
		var _valid = new $ko.observable(true);

		this.valid = new $ko.pureComputed(_valid);

		this.value = new $ko.pureComputed({
			read: function () {
				var value = options.get();

				_valid(true);

				return value.toString();
			},
			write: function (input) {
				var value = options.parse(input);

				if (options.valid(value)) {
					_valid(true);

					options.set(value);
				}
				else {
					_valid(false);
				}
			}
		});

		this.update = function () {
			// Forcing ko update:
			var value = this.value();
			this.value("");
			this.value(value);
		};
	}

	function KoPureComputedAsNumber(options) {
		return new KoPureComputedValue({
			get: options.get,
			set: options.set,
			parse: function (input) { return Number(input); },
			valid: function (value) { return !Number.isNaN(value); }
		});
	}

	$global.nan.common = {
		SimpleTimer: SimpleTimer,
		KoPureComputedValue: KoPureComputedValue,
		KoPureComputedAsNumber: KoPureComputedAsNumber
	};
})(window, ko);
