const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

const maindir = path.resolve(__dirname, '../');
const srcdir = path.resolve(maindir, 'src');
const outdir = path.resolve(maindir, 'dist');
const template = path.resolve(srcdir, 'index.html');
const app = path.resolve(srcdir, 'index.tsx');

const env = (process.env.NODE_ENV || 'development').toLocaleLowerCase();
const isDevelopment = env === 'development';

const minify = {
  collapseWhitespace: true,
  removeComments: true
};

const config = {
  entry: {
    app: [app],
    react: ['react', 'react-dom', 'prop-types']
  },
  output: {
    path: outdir,
    filename: isDevelopment ? '[name].bundle.js' : '[name].[hash].bundle.js',
    publicPath: "/"
  },
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx', '.css']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ['react-hot-loader/webpack', 'ts-loader']
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                sourceMaps: isDevelopment,
                importLoaders: 1,
                localIdentName: '[name]__[local]___[hash:base64:5]'
              }
            },
            'postcss-loader'
          ]
        })
      },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.(png|gif|jpg|cur)$/, loader: 'url-loader', query: { limit: 8192 } },
      { test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader', query: { limit: 10000, mimetype: 'application/font-woff2' } },
      { test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader', query: { limit: 10000, mimetype: 'application/font-woff' } },
      { test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: isDevelopment
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.CommonsChunkPlugin({ name: ['app'] }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    }),
    new ExtractTextPlugin({
      allChunks: true,
      filename: 'styles.css'
    }),
    new HtmlWebpackPlugin({
      minify: isDevelopment ? null : minify,
      template,
      title: 'React-Webpack-Skeleton'
    }),
    new webpack.ProvidePlugin({
      Promise: "imports-loader?this=>global!exports-loader?global.Promise!bluebird",
      fetch: "imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch",
      regeneratorRuntime: 'regenerator-runtime'
    })
  ]
};

switch (env) {
  case 'production':
    config.plugins = [
      ...config.plugins,
      new webpack.optimize.UglifyJsPlugin(),
      new ImageminPlugin({ test: /\.(jpe?g|tiff?|svg|png)$/ })
    ];
    break;
  default:
  case 'development':
    config.devtool = 'eval';
    config.entry.app = [
      'react-hot-loader/patch',
      'webpack/hot/only-dev-server',
      'webpack-dev-server/client?http://localhost:8080',
      ...config.entry.app
    ];
    config.plugins = [
      new webpack.HotModuleReplacementPlugin(),
      ...config.plugins
    ];
    config.devServer = {
      hot: true,
      inline: true,
      quiet: false,
      port: 8080,
      contentBase: 'http://localhost:8080',
      stats: {
        colors: true
      }
    }
}

module.exports = config;
