/*
	STUDY.Physics.SpecialRelativity/Common
	Physics case studies: Special Relativity: Common Resources
	https://github.com/jp-diegidio/STUDY.Physics.SpecialRelativity
	Copyright (C) 2020-2025 Julio P. Di Egidio (http://julio.diegidio.name)
	This software is released under the terms of the GNU-GPLv3 license.
	As usual, NO WARRANTY OF ANY KIND is implied.
*/

(function ($global, $ko) {
	"use strict";

	///////////////////////////////////////////////////////////////////////////
	// PureComputedValue
	///////////////////////////////////////////////////////////////////////////

	/**
	 * @template TValue // e.g. number
	 * @typedef {Object} PureComputedOptions
	 * @property {() => TValue} get
	 * @property {(value: TValue) => void} set
	 * @property {(value: TValue) => boolean} valid
	 * @property {(input: string) => TValue} fromString
	 * @property {(value: TValue) => string} toString
	 */

	/**
	 * Constructs a new {@link PureComputedValue} object.
	 * 
	 * @template TValue
	 * @constructor {PureComputedValue<TValue>} PureComputedValue
	 * @param {PureComputedOptions<TValue>} options
	 */
	function PureComputedValue(options) {
		var _valid = new $ko.observable(true);

		/**
		 * Observable (is) valid.
		 * 
		 * @type {() => boolean}
		 */
		this.valid = new $ko.pureComputed(_valid);

		/**
		 * Observable value.
		 * 
		 * @type {{
		 * 	   (): string;
		 * 	   (input: string): void;
		 * }}
		 */
		this.value = new $ko.pureComputed({
			/** @type {() => string} */
			read: function () {
				_valid();  // ko dependency

				var value = options.get();

				return options.toString(value);
			},
			/** @type {(input: string) => void} */
			write: function (input) {
				var value = options.fromString(input);

				if (options.valid(value)) {
					options.set(value);

					_valid(true);
				}
				else {
					_valid(false);
				}
			}
		});

		/**
		 * Triggers a value update.
		 * 
		 * @type {() => void}
		 */
		this.update = function () {
			// Forcing ko to update:

			var input = this.value();

			this.value("");
			this.value(input);
		};
	}

	///////////////////////////////////////////////////////////////////////////
	// PureComputedAsNumber
	///////////////////////////////////////////////////////////////////////////

	/**
	 * @typedef {Object} PureComputedAsNumberOptions
	 * @property {() => number} get
	 * @property {(value: number) => void} set
	 */

	/**
	 * Constructs a new {@link PureComputedAsNumber} object.
	 * 
	 * @constructor {PureComputedAsNumber} PureComputedAsNumber
	 * @param {PureComputedAsNumberOptions} options
	 */
	function PureComputedAsNumber(options) {
		/** @type {PureComputedOptions<number>} */
		var pcOptions = {
			get: options.get,
			set: options.set,
			valid: function (value) { return !isNaN(value); },
			fromString: function (input) { return Number(input); },
			toString: function (value) { return value.toString(); }
		};

		PureComputedValue.call(this, pcOptions);
	}

	///////////////////////////////////////////////////////////////////////////

	// TODO: Export jsdoc, too... #####
	var $nan = $global["nan"] || {};
	$nan.common = $nan.common || {};
	$nan.common.ko = {
		PureComputedValue: PureComputedValue,
		PureComputedAsNumber: PureComputedAsNumber
	};
	$global["nan"] = $nan;
})(window, window["ko"]);
