const slugify = require("slugify");

/**
 * Takes an array of tokens and sends back and array of name
 * and clamp pairs for CSS fluid values.
 *
 * @param      {[{name: string, min: number, max: number}]}  tokens           The tokens
 * @param      {object}  [viewports={}]        Viewports
 * @param      {number}  [viewports.min=320]   Minimum viewport width
 * @param      {number}  [viewports.max=1240]   Maximum viewport width
 * @returns {Array<string|{name: string, value: string}>}
 */
const clampGenerator = (tokens, { min = 320, max = 1240 } = {}) => {
	const rootSize = 16;
	const viewportsMin = min;
	const viewportsMax = max;

	return tokens.map(({ name, min, max }) => {
		if (min === max) {
			return `${min / rootSize}rem`;
		}

		// Convert the min and max sizes to rems
		const minSize = min / rootSize;
		const maxSize = max / rootSize;

		// Convert the pixel viewport sizes into rems
		const minViewport = viewportsMin / rootSize;
		const maxViewport = viewportsMax / rootSize;

		// Slope and intersection allow us to have a fluid value but also keep that sensible
		const slope = (maxSize - minSize) / (maxViewport - minViewport);
		const intersection = -1 * minViewport * slope + minSize;

		return {
			name,
			value: `clamp(${minSize}rem, ${intersection.toFixed(2)}rem + ${(
				slope * 100
			).toFixed(2)}vw, ${maxSize}rem)`,
		};
	});
};

/**
 * Converts human readable tokens into config friendly object
 *
 * @param {Array<{name: string, value: any}>} tokens
 * @return {object} {key, value}
 */
const tokensToObject = (tokens) => {
	const nameSlug = (text) => slugify(text, { lower: true });
	let response = {};

	tokens.forEach(({ name, value }) => {
		response[nameSlug(name)] = value;
	});

	return response;
};

module.exports = { clampGenerator, tokensToObject };
