module.exports = {
  presets: [
    // '@vue/cli-plugin-babel/preset',
    [
      '@babel/preset-env', {
        'useBuiltIns': 'usage',
        'corejs': 3
      }
    ]
  ]
}
