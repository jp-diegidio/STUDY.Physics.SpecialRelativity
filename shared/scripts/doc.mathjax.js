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

	// <http://docs.mathjax.org/en/latest/options/input/tex.html>
	// <http://docs.mathjax.org/en/latest/options/output/chtml.html>
	$global["MathJax"] = {
		loader: { load: ["[tex]/ams"] },
		tex: {
			packages: { "[+]": ["ams"] },
			inlineMath: [
				["$", "$"],
				["\\(", "\\)"]
			],
			displayMath: [
				["$$", "$$"],
				["\\[", "\\]"]
			],
			processEscapes: true,        // use \$ to produce a literal dollar sign
			processEnvironments: false,  // process \begin{xxx}...\end{xxx} outside math mode
			processRefs: false,          // process \ref{...} outside of math mode
		},
		chtml: {
			scale: 0.9,               	 // global scaling factor for all expressions
		},
	};
})(window);
