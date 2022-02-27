const { resolve } = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const EslintWebpackPlugin = require('eslint-webpack-plugin')
// const {CleanWebpackPlugin} = require('clean-webpack-plugin')

const config = {
  entry: './src/index.ts',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'main.js',
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.scss$/,
            use: [
              // 提取CSS成单独文件
              MiniCssExtractPlugin.loader,
              'css-loader',
              {
                // CSS兼容性处理
                loader: 'postcss-loader',
                options: {
                  postcssOptions: {
                    plugins: [
                      [
                        'postcss-preset-env',
                        {
                          browsers: 'last 2 versions',
                        }
                      ]
                    ]
                  }
                }
              },
              'sass-loader'
            ]
          },
          {
            test: /\.ts$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'babel-loader',
                options: {
                  presets: [
                    [
                      '@babel/preset-env',
                      {
                        useBuiltIns: 'usage',
                        corejs: {
                          version: 3,
                        },
                        targets: {
                          chrome: '60',
                          firefox: '60',
                        }
                      }
                    ]
                  ],
                  cacheDirectory: true,
                }
              },
              'ts-loader'
            ]
          },
          // {
          //   exclude: /\.(html|css|s[ac]ss|ts)$/,
          //   type: 'asset',
          //   generator: {
          //     filename: 'static/[hash10][ext][query]'
          //   }
          // }
        ],
      },

    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/main.css'
    }),
    new CssMinimizerWebpackPlugin({
      parallel: 2,
    }),
    new HtmlWebpackPlugin({
      template: './src/view/index.html',
      filename: 'index.html',
      title: 'Custom template',
      favicon: resolve(__dirname, './favicon.ico'),
    }),
    new EslintWebpackPlugin(),
    // new CleanWebpackPlugin(),
  ],
  mode: 'production',
  devServer: {
    open: true,
    hot: true,
    client: {
      logging: 'error',
      overlay: {
        errors: true,
        warnings: false,
      }
    }
  },
  devtool: 'eval-cheap-module-source-map',
  resolve: {
    extensions: ['.ts', '.js']
  }
}

module.exports = () => {
  return config
}