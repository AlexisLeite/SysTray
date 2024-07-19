// Plugins
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const v8 = require("v8");
const webpack = require('webpack');
const { GitRevisionPlugin } = require('git-revision-webpack-plugin');
const gitRevisionPlugin = new GitRevisionPlugin({
  branch: true,
});
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');



// Configuration
module.exports = (_, argv) => {
  const mode = argv.mode;
  const isDevelopment = mode === "development";
  const analyzeBundle = !isDevelopment && String(process.env.ANALYZE) !== 'false';
  const outputDir = path.resolve(__dirname, 'dist');

  console.log({
    isDevelopment,
    maxMemory: v8.getHeapStatistics().heap_size_limit / (1024 * 1024),
    outputDir,
    willAnalyze: analyzeBundle
  });

  return {
    devtool: 'source-map',
    entry: {
      index: './src/index.tsx',
    },
    mode: isDevelopment ? 'development' : 'production',
    module: {
      rules: [
        {
          test: /\.(t|j)sx?$/,
          enforce: "pre",
          use: ["source-map-loader"],
        },
        {
          test: /\.css$/,
          use: [
            'style-loader', 'css-loader'
          ]
        },
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true
              }
            }
          ],
        },
        {
          test: /\.m?js$/,
          resolve: {
            fullySpecified: false,
          },
        },
      ],
    },
    optimization: {
      chunkIds: 'named',
      nodeEnv: 'production',
    },
    output: {
      clean: true,
      filename: '[name].js',
      chunkFilename: '[name].js',
      path: outputDir,
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin(),
      analyzeBundle && !isDevelopment && new BundleAnalyzerPlugin(),
      new webpack.DefinePlugin({
        BRANCH: JSON.stringify(gitRevisionPlugin.branch()),
        COMMITHASH: JSON.stringify(gitRevisionPlugin.commithash()),
        ENVIRONMENT: JSON.stringify(mode),
        PACKAGE_VERSION: JSON.stringify(process.env.npm_package_version),
        TIMESTAMP: JSON.stringify(Date()),
        VERSION: JSON.stringify(gitRevisionPlugin.version()),
        WP_DEVELOP_MODE: JSON.stringify(isDevelopment)
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src', 'index.html')
      })
    ].filter(Boolean),
    resolve: {
      modules: ['node_modules'],
      extensions: ['.ts', '.tsx', '.js', '.json'],
      symlinks: true,
      fallback: {
        zlib: false,
        http: false,
        https: false,
        emitter: false,
        path: false,
        fs: false,
        tty: false,
        os: false,
        timers: false,
        stream: false,
      }
    },
    snapshot: {
      managedPaths: [/^(.+?[\\/]node_modules[\\/](?!@apia.*))/],
    },
  }
}
