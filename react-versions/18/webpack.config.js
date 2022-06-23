import HtmlWebpackPlugin from 'html-webpack-plugin'

export default {
	entry: './src/index.tsx',
	devtool: 'inline-source-map',
	module: {
		rules: [
			{
			test: /\.tsx?$/,
			use: "ts-loader",
			exclude: /node_modules/
			},
		],
	},
	resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.scss'],
        modules: ['src', 'node_modules']
    },
	plugins: [
		new HtmlWebpackPlugin( )
	],
}
