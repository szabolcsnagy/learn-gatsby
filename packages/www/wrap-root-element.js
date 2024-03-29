// Must use common-js imports
const React = require("react");
const { ThemeProvider } = require("theme-ui");
const { deep } = require("@theme-ui/presets");
const { Provider } = require("./identity-context");

// Deep theme preset doesn't contain sizes
// while the theme sets sizes.container as the max-width for the site
// https://github.com/system-ui/theme-ui/blob/master/packages/preset-deep/src/index.ts#L7
const tokens = {
  ...deep,
  sizes: { container: 1024 },
  colors: {
    ...deep.colors,
    surface: "#aa2140", // extend the default theme
  },
};

const ThemeWrapper = ({ element }) => (
  <Provider>
    {/* prop.element is provided by Gatsby */}
    <ThemeProvider theme={tokens}>{element}</ThemeProvider>
  </Provider>
);

module.exports = ThemeWrapper;
