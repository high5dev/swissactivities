const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const getRedirects = require("./config/redirects");

const nextConfig = {
  optimizeCss: true,
  trailingSlash: true,
  staticPageGenerationTimeout: 300,
  images: {
    // https://github.com/vercel/next.js/issues/21079#issuecomment-772110453
    loader: "imgix",
    path: "https://contentapi-swissactivities.imgix.net",
    domains: ["fra1.digitaloceanspaces.com"],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  webpack(config, { dev }) {
    if (!dev) {
      config.plugins = config.plugins.filter(
        (plugin) => plugin.constructor.name !== "UglifyJsPlugin"
      );

      config.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            mangle: false,
          },
        })
      );
    }

    config.module.rules.push(
      {
        test: /\.(woff(2)?|ttf|png|jpe?g|eot|webp)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              esModule: false,
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        issuer: /\.(js|ts)x?$/,
        use: ["@svgr/webpack"],
      }
    );

    return config;
  },
  async redirects() {
    return await getRedirects();
  },
};

module.exports = nextConfig;
