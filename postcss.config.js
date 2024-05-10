const purgecss = require("@fullhuman/postcss-purgecss");
const postcssProcessTokens = require("postcss-design-token-utils");
const postcssImport = require("postcss-import");
const postcssImportExtGlob = require("postcss-import-ext-glob");
const darkColorTokens = require("./design-tokens/colors-dark.json");
const colorTokens = require("./design-tokens/colors.json");
const fontTokens = require("./design-tokens/font-family.json");
const spacingTokens = require("./design-tokens/spacing.json");
const fontSizeTokens = require("./design-tokens/text-sizes.json");
const fontWeightTokens = require("./design-tokens/text-weights.json");
const { clampGenerator, tokensToObject } = require("./utils.js");

const color = tokensToObject(colorTokens.items);
const darkColor = tokensToObject(darkColorTokens.items);
const fontFamily = tokensToObject(fontTokens.items);
const fontWeight = tokensToObject(fontWeightTokens.items);
const spacing = tokensToObject(clampGenerator(spacingTokens.items));
const fontSize = tokensToObject(clampGenerator(fontSizeTokens.items));

const tokens = {
	color,
	darkColor,
	fontFamily,
	fontWeight,
	fontSize,
	spacing,
};

const isProduction = process.env.NODE_ENV === "production";

const config = {
	plugins: [
		postcssImportExtGlob,
		postcssImport,
		postcssProcessTokens({
			tokens,
			breakpoints: {
				sm: "320px",
				md: "640px",
			},
			customProperties: [
				{
					id: "darkColor",
					prefix: "color",
					group: "dark",
				},
			],
			utilityClasses: [
				{
					id: "color",
					prefix: "text",
					property: "color",
					responsiveVariants: true,
				},
				{ id: "color", prefix: "bg", property: "background-color" },
				{ id: "fontFamily", prefix: "font", property: "font-family" },
				{ id: "fontWeight", property: "font-weight" },
				{ id: "fontSize", prefix: "text", property: "font-size" },
				{ id: "spacing", prefix: "flow-space", property: "--flow-space" },
			],
		}),
		...(isProduction
			? [
					purgecss({
						content: ["./pages/*.html"],
					}),
				]
			: []),
	],
};

module.exports = config;
