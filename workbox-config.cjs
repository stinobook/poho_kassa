module.exports = {
	globDirectory: 'www/',
	globPatterns: [
		'**/*.{js,html,css}'
	],
	swDest: 'www/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};