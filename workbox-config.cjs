module.exports = {
  globDirectory: 'www/',
  skipWaiting: true,
  globPatterns: ['**/*.{js,html,css}'],
  swDest: 'www/sw.js',
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/]
}
