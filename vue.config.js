module.exports = {
	publicPath: process.env.NODE_ENV === 'production'	? './' : '/',
	configureWebpack: {
		module: {
		  rules: [
			{
				test: /\.worker\.js$/,
				use: { loader: 'worker-loader' }
			}
		  ]
		},
    resolve: {
      // ... rest of the resolve config
      fallback: {
        'path': require.resolve('path-browserify')
      }
    },
    devtool: 'eval-source-map',
    target: 'web'
	}
};