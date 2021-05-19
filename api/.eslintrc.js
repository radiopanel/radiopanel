module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint/eslint-plugin', 'import'],
	extends: [
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier',
		'prettier/@typescript-eslint',
		'plugin:import/errors',
		'plugin:import/warnings',
		'plugin:import/typescript',
	],
	root: true,
	env: {
		node: true,
		jest: true,
	},
	rules: {
		indent: ['error', 'tab'],
		'@typescript-eslint/interface-name-prefix': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'import/order': [
			'error',
			{
				groups: [
					'builtin',
					'external',
					'internal',
					'parent',
					'sibling',
					'index',
				],
				'newlines-between': 'always',
				pathGroups: [
					{
						pattern: '~**',
						group: 'internal',
					},
					{
						pattern: '~**/**',
						group: 'internal',
					},
				],
			},
		],
		'import/default': 0
	},
	settings: {
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts', '.tsx'],
		},
		'import/resolver': {
			typescript: {
				alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
			},

			typescript: {
				directory: 'tsconfig.json',
			},
		},
	},
};
