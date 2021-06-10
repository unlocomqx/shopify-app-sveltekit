import type { AppConfigV1, AppConfigV2 } from '@shopify/app-bridge';
import createApp from '@shopify/app-bridge';
import { Redirect } from '@shopify/app-bridge/actions/index';

export function getApp (shop = null, host = null) {
	if (typeof window === 'undefined') {
		return null;
	}

	if (!shop) {
		const urlParams = new URLSearchParams(window.location.search);
		shop = urlParams.get('shop');
	}
	if (!host) {
		const urlParams = new URLSearchParams(window.location.search);
		host = urlParams.get('host');
	}

	if ((!shop || !host) && (window as any).shopifyApp) {
		return (window as any).shopifyApp;
	}

	const app = createApp({
		apiKey       : process.env.SHOPIFY_API_KEY,
		shopOrigin   : shop,
		host,
		forceRedirect: false
	} as AppConfigV1 & AppConfigV2);

	(window as any).shopifyApp = app;

	return app;
}

export function initAppBridge () {
	const urlParams = new URLSearchParams(window.location.search);
	const shop = urlParams.get('shop');
	const host = urlParams.get('host');

	if (!shop && !host) {
		location.href = `${ process.env.HOST }/?shop=${ process.env.SHOP }`;
		return;
	}

	if (host) {
		const createAppFn = typeof createApp === 'function' ? createApp : (createApp as any).default;
		createAppFn({
			// replaced by vite-plugin-replace in svelte.config.js
			apiKey       : process.env.SHOPIFY_API_KEY,
			host,
			forceRedirect: true
		});
	} else {
		const permissionUrl =
			`https://${ shop }/admin/oauth/authorize?client_id=${ process.env.SHOPIFY_API_KEY }&scope=read_products,read_content&redirect_uri=${ process.env.HOST }/auth/callback`;

		// If the current window is the 'parent', change the URL by setting location.href
		if (window.top == window.self) {
			window.location.assign(permissionUrl);

			// If the current window is the 'child', change the parent's URL with Shopify App Bridge's Redirect action
		} else {
			const app = getApp(shop, host);
			Redirect.create(app).dispatch(Redirect.Action.REMOTE, permissionUrl);
		}
	}
}
