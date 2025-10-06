const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    'background/service_worker': './src/background/service_worker.ts',
    'content/content_script': './src/content/content_script.ts',
    'options/options': './src/options/options.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'manifest.json', to: 'manifest.json' },
        { from: 'public', to: '.' },
      ],
    }),
  ],
}