// Must use common-js iports
const React = require("react");
const { ThemeProvider } = require("theme-ui");
const { deep } = require("@theme-ui/presets");

// Deep preset doesn't contain sizes
// while the theme sets sizes.container as the max-width for the site
// https://github.com/system-ui/theme-ui/blob/master/packages/preset-deep/src/index.ts#L7
const tokens = {
  ...deep,
  sizes: { container: 1024 },
};

const ThemeWrapper = ({ element }) => (
  // element prop is provided by Gatsby
  <ThemeProvider theme={tokens}>{element}</ThemeProvider>
);

module.exports = ThemeWrapper;
