module.exports = {
	publicPath: process.env.NODE_ENV === 'production'
	? './'
	: '/',
	devServer: {
		port: 8082,
		watchOptions: {
			poll: true
	  	}
	},
	configureWebpack: {
		module: {
		  rules: [
			{
				test: /\.worker\.js$/,
				use: { loader: "worker-loader" }
			}
		  ]
		}
	}
};