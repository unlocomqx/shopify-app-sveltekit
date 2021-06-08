import { sessionStorage } from '$lib/shopify/session';
import { ApiVersion, Shopify } from '@shopify/shopify-api';

export function initContext (): void {
	Shopify.Context.initialize({
		API_KEY        : process.env['SHOPIFY_API_KEY'],
		API_SECRET_KEY : process.env['SHOPIFY_API_SECRET'],
		SCOPES         : process.env['SCOPES'].split(','),
		HOST_NAME      : process.env['HOST'].replace(/https:\/\//, ''),
		API_VERSION    : ApiVersion.April21,
		IS_EMBEDDED_APP: true,
		// This should be replaced with your preferred storage strategy
		SESSION_STORAGE: sessionStorage
	});
}
