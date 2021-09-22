require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  plugins: [
    {
      resolve: "gatsby-plugin-create-client-paths",
      // any route under /app is user specific will be generated
      // dynamically. Don't want them to be created at build time
      options: { prefixes: [`/app/*`] },
    },
  ],
};
