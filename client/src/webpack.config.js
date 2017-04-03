module.exports = {
    entry: {
        'receiverBundle': './ReceiverMain.ts',
        'senderBundle': './SenderMain.ts',
    },
    output: {
        path: '../dist',
        filename: '[name].js'
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    module: {
        loaders: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.tsx?$/, loader: 'ts-loader' },
            { test: /\.css$/, use: [ 'style-loader', 'css-loader' ]
      }
        ]
    },
    devtool: 'source-map'
}
