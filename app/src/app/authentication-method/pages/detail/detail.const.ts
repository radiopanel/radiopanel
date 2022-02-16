export const authMethodConfig = {
	local: [],
	saml: [
		{
			name: 'Certificate',
			slug: 'cert',
			config: {
				placeholder: ''
			},
			fieldType: 'textarea-input'
		},
		{
			name: 'Issuer',
			slug: 'issuer',
			config: {
				placeholder: ''
			},
			fieldType: 'text-input'
		},
		{
			name: 'Entrypoint',
			slug: 'entryPoint',
			config: {
				placeholder: ''
			},
			fieldType: 'text-input'
		},
	],
	oauth2: [
		{
			name: 'Authorization URL',
			slug: 'authorizationURL',
			config: {
				placeholder: ''
			},
			fieldType: 'text-input'
		},
		{
			name: 'Token URL',
			slug: 'tokenURL',
			config: {
				placeholder: ''
			},
			fieldType: 'text-input'
		},
		{
			name: 'Userinfo URL',
			slug: 'userinfoURL',
			config: {
				placeholder: ''
			},
			fieldType: 'text-input'
		},
		{
			name: 'Client ID',
			slug: 'clientID',
			config: {
				placeholder: ''
			},
			fieldType: 'text-input'
		},
		{
			name: 'Client Secret',
			slug: 'clientSecret',
			config: {
				placeholder: ''
			},
			fieldType: 'text-input'
		},
		{
			name: 'Scope',
			slug: 'scope',
			config: {
				placeholder: 'openid profile email'
			},
			fieldType: 'text-input'
		},
	],
	discord: [
		{
			name: 'Client ID',
			slug: 'clientID',
			config: {
				placeholder: ''
			},
			fieldType: 'text-input'
		},
		{
			name: 'Client Secret',
			slug: 'clientSecret',
			config: {
				placeholder: ''
			},
			fieldType: 'text-input'
		}
	],
};
