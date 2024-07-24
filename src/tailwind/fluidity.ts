/**
 * Tailwind plugin for fluid typography based on Utopia fluid responsive design.
 * https://utopia.fyi
 */

import plugin from 'tailwindcss/plugin';
import type { CustomThemeConfig, ResolvableTo } from 'tailwindcss/types/config';

type ValueOf<T> = T[keyof T];
type ResolvedConfig<T> = T extends ResolvableTo<infer U> ? U : never;
type ScreensConfig = Exclude<
  ResolvedConfig<CustomThemeConfig['screens']>,
  string[]
>;
type FontSizeConfig = ResolvedConfig<CustomThemeConfig['fontSize']>;
type LineHeightConfig = ResolvedConfig<CustomThemeConfig['lineHeight']>;

type FluidityInputOptions = {
  minScreenWidth?: keyof ScreensConfig | number;
  maxScreenWidth?: keyof ScreensConfig | number;
};

type FluidityOptions = {
  minScreenWidth: number;
  maxScreenWidth: number;
};

type FontSizeCssVars = {
  definition: Record<string, string>;
  mapping: Record<string, string>;
};

const RootFontSize = 16;
const CssVarPrefix = '--fluidity-fs';
const CssPrecision = 4;
const DefaultMinScreenWidthKey = 'sm';
const DefaultMaxScreenWidthKey = '2xl';
const DefaultMinScreenWidth = 640;
const DefaultMaxScreenWidth = 1536;

function defaultOptions(screens: ScreensConfig): FluidityOptions {
  return Object.freeze({
    minScreenWidth:
      parseFloat(screens[DefaultMinScreenWidthKey] as string) ||
      DefaultMinScreenWidth,
    maxScreenWidth:
      parseFloat(screens[DefaultMaxScreenWidthKey] as string) ||
      DefaultMaxScreenWidth,
  });
}

function parseFontSizeValue(value: ValueOf<FontSizeConfig>) {
  const [fontSizeRange, options] = Array.isArray(value) ? value : [value];
  const [minFontSize, maxFontSize] = [fontSizeRange?.split('-')].flat();

  return {
    fontSizeRange,
    minFontSizePx: parseFloat(minFontSize),
    maxFontSizePx: parseFloat(maxFontSize || minFontSize),
    options,
  };
}

function parseOptions(
  { minScreenWidth, maxScreenWidth }: FluidityInputOptions,
  screens: ScreensConfig,
): FluidityOptions {
  const defaults = defaultOptions(screens);

  return Object.freeze({
    minScreenWidth:
      parseFloat(screens[minScreenWidth as string] as string) ||
      parseFloat(minScreenWidth as string) ||
      defaults.minScreenWidth,
    maxScreenWidth:
      parseFloat(screens[maxScreenWidth as string] as string) ||
      parseFloat(maxScreenWidth as string) ||
      defaults.maxScreenWidth,
  });
}

export default plugin.withOptions(
  (options: FluidityInputOptions = {}) =>
    ({ addBase, matchUtilities, theme }) => {
      const fontSizes: FontSizeConfig = theme('fluidFontSize');
      const lineHeights: LineHeightConfig = theme('lineHeight');
      const screens: ScreensConfig = theme('screens');

      const { minScreenWidth, maxScreenWidth } = parseOptions(options, screens);

      const fontSizeCssVars: FontSizeCssVars = Object.entries(fontSizes).reduce(
        (acc, [key, value]) => {
          const { fontSizeRange, minFontSizePx, maxFontSizePx } =
            parseFontSizeValue(value);

          const minFontSizeRem = +(minFontSizePx / RootFontSize).toFixed(
            CssPrecision,
          );
          const maxFontSizeRem = +(maxFontSizePx / RootFontSize).toFixed(
            CssPrecision,
          );
          const fontSizeRatio =
            (maxFontSizePx - minFontSizePx) / (maxScreenWidth - minScreenWidth);
          const fontSizeVi = (fontSizeRatio * 100).toFixed(CssPrecision);
          const fontSizeRem = (
            (minFontSizePx - minScreenWidth * fontSizeRatio) /
            RootFontSize
          ).toFixed(CssPrecision);
          const cssVar = `${CssVarPrefix}-${key}`;

          // CSS variable definition for the font size.
          acc.definition[cssVar] = `clamp(
            ${minFontSizeRem}rem, ${fontSizeRem}rem + ${fontSizeVi}vi, ${maxFontSizeRem}rem
          )`;

          // Map font size theme config key to the CSS variable.
          acc.mapping[fontSizeRange] = `var(${cssVar})`;

          return acc;
        },
        {
          definition: {},
          mapping: {},
        } as FontSizeCssVars,
      );

      addBase({ ':root': fontSizeCssVars.definition });

      matchUtilities(
        {
          text: (value, { modifier }) => {
            const [fontSizeRange, options] = Array.isArray(value)
              ? value
              : [value];
            const fontSizeCssVar = fontSizeCssVars.mapping[fontSizeRange];

            if (modifier) {
              return {
                'font-size': fontSizeCssVar,
                'line-height': modifier,
              };
            }

            const {
              lineHeight = null,
              letterSpacing = null,
              fontWeight = null,
            } = typeof options === 'object' &&
            !Array.isArray(options) &&
            options !== null
              ? options
              : { lineHeight: options };

            return {
              'font-size': fontSizeCssVar,
              ...(lineHeight === null ? {} : { 'line-height': lineHeight }),
              ...(letterSpacing === null
                ? {}
                : { 'letter-spacing': letterSpacing }),
              ...(fontWeight === null
                ? {}
                : { 'font-weight': fontWeight.toString() }),
            };
          },
        },
        {
          values: fontSizes,
          modifiers: lineHeights,
          type: ['absolute-size'],
        },
      );
    },
);
