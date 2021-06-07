export const authMethodConfig = {
	local: [],
	saml: [
		{
			name: 'Certificate',
			slug: 'cert',
			config: {},
			fieldType: 'textarea-input'
		},
		{
			name: 'Issuer',
			slug: 'issuer',
			config: {},
			fieldType: 'text-input'
		},
		{
			name: 'Entrypoint',
			slug: 'entryPoint',
			config: {},
			fieldType: 'text-input'
		},
	],
	oauth2: [
		{
			name: 'Authorization URL',
			slug: 'authorizationURL',
			config: {},
			fieldType: 'text-input'
		},
		{
			name: 'Token URL',
			slug: 'tokenURL',
			config: {},
			fieldType: 'text-input'
		},
		{
			name: 'Userinfo URL',
			slug: 'userinfoURL',
			config: {},
			fieldType: 'text-input'
		},
		{
			name: 'Client ID',
			slug: 'clientID',
			config: {},
			fieldType: 'text-input'
		},
		{
			name: 'Client Secret',
			slug: 'clientSecret',
			config: {},
			fieldType: 'text-input'
		},
	],
};
