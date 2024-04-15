import purgecss from "@fullhuman/postcss-purgecss";
import postcssProcessTokens from "postcss-design-token-utils";
import postcssImport from "postcss-import";
import postcssImportExtGlob from "postcss-import-ext-glob";
import darkColorTokens from "./design-tokens/colors-dark.json" assert { type: "json" };
import colorTokens from "./design-tokens/colors.json" assert { type: "json" };
import fontTokens from "./design-tokens/font-family.json" assert { type: "json" };
import spacingTokens from "./design-tokens/spacing.json" assert { type: "json" };
import fontSizeTokens from "./design-tokens/text-sizes.json" assert { type: "json" };
import fontWeightTokens from "./design-tokens/text-weights.json" assert { type: "json" };
import { clampGenerator, tokensToObject } from "./utils.js";

const color = tokensToObject(colorTokens.items);
const darkColor = tokensToObject(darkColorTokens.items);
const fontFamily = tokensToObject(fontTokens.items);
const fontWeight = tokensToObject(fontWeightTokens.items);
const spacing = tokensToObject(clampGenerator(spacingTokens.items));
const fontSize = tokensToObject(clampGenerator(fontSizeTokens.items));

const tokens = { color, darkColor, fontFamily, fontWeight, fontSize, spacing };

const isProduction = process.env.NODE_ENV === "production";

const config = {
	plugins: [
		postcssImportExtGlob,
		postcssImport,
		postcssProcessTokens(tokens, {
			customProperties: [
				{
					id: "darkColor",
					prefix: "color",
					group: "dark",
				},
			],
			utilityClasses: [
				{ id: "color", prefix: "text", property: "color" },
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

export default config;
