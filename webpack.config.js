var webpack = require('webpack');
module.exports = {
	entry: './src/index.js',
	output: {
		filename: './dist/b-nested-sortable.js'
	},
	module: {
		rules: [{
			test: /\.css$/,
			use: ['style-loader', 'css-loader']
		}]
	},
	externals: {
		jquery: "jQuery",
		"jquery-ui/ui/widgets/sortable": "jQuery"
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: "jquery",
			jquery: "jquery",
			"windows.jQuery": "jquery"
		})
	]
}