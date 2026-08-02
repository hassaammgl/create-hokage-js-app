/**
 * Style strategies: directory under templates/ + optional client install suffix.
 */
const DEFAULT_STYLE = Object.freeze({
  directory: 'normalcss',
  extraClientInstallSuffix: '',
});

const TAILWIND_DEV_PACKAGES =
  ' && npm install -D tailwindcss postcss autoprefixer';

const SHADCN_PACKAGES =
  ' && npm install class-variance-authority clsx tailwind-merge lucide-react @radix-ui/react-slot && npm install -D tailwindcss postcss autoprefixer tailwindcss-animate @types/node';

export const STYLE_STRATEGIES = Object.freeze({
  css: DEFAULT_STYLE,
  scss: Object.freeze({
    directory: 'scss',
    extraClientInstallSuffix: ' && npm install sass',
  }),
  tailwindcss: Object.freeze({
    directory: 'tailwindcss',
    extraClientInstallSuffix: TAILWIND_DEV_PACKAGES,
  }),
  'shadcn-ui': Object.freeze({
    directory: 'shadcn-ui',
    extraClientInstallSuffix: SHADCN_PACKAGES,
  }),
});

/**
 * @param {string} styleId
 * @returns {{ directory: string, extraClientInstallSuffix: string }}
 */
export function getStyleStrategy(styleId) {
  return STYLE_STRATEGIES[styleId] ?? DEFAULT_STYLE;
}
