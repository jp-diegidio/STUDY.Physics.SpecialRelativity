/*
	STUDY.Physics.SpecialRelativity/Shared
	Physics case studies: Special Relativity: Shared Resources
	https://github.com/jp-diegidio/STUDY.Physics.SpecialRelativity
	Copyright (C) 2020-2025 Julio P. Di Egidio (http://julio.diegidio.name)
	This software is released under the terms of the GNU-GPLv3 license.
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
