const path = require('path')
module.exports = {
    mode: 'development',
    entry: path.join(__dirname, 'src', 'web-pet.js'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'web-pet.js',
        library: {
            name: 'WebPet',
            type: "var"
        }
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url-loader',
                options: {
                    name: './resources/img/[name].[ext]',
                    limit: 8192,
                    publicPath: './resources/img/'
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader',  
                {
                    loader: 'css-loader',
                    options: {
                        url: false
                    }
                }],
            }
        ]
    },
    devServer: {
        static: {
            directory: path.join(__dirname, './dist'),
          },
        port: 9000,
        hot: true,
    },
}