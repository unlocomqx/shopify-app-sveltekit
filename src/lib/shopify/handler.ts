import { deleteShopFromDb, getShopFromDb, saveShopToDb } from '$lib/database/session';
import { createShopifyAuth } from '$lib/helpers/shopify-auth';
import { initContext } from '$lib/shopify/context';
import { convert } from '$lib/shopify/request';
import { Shopify } from '@shopify/shopify-api';
import dotenv from 'dotenv';

dotenv.config();

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPIFY_SHOPS = {};

initContext();

const auth = createShopifyAuth({
	async afterAuth (ctx) {
		// Access token and shop available in ctx.state.shopify
		const { shop, accessToken, scope } = ctx.state.shopify;
		const host = ctx.query.host;
		ACTIVE_SHOPIFY_SHOPS[shop] = { scope, host };
		saveShopToDb(shop, ACTIVE_SHOPIFY_SHOPS[shop]);

		const response = await Shopify.Webhooks.Registry.register({
			shop,
			accessToken,
			path          : '/webhooks',
			topic         : 'APP_UNINSTALLED',
			webhookHandler: async (topic, shop, body) => {
				delete ACTIVE_SHOPIFY_SHOPS[shop];
				deleteShopFromDb(shop);
			}
		});

		if (!response.success) {
			// eslint-disable-next-line no-console
			console.log(`Failed to register APP_UNINSTALLED webhook: ${ response.result }`);
		}
		// Redirect to app with shop parameter upon auth
		ctx.redirect(`/?shop=${ shop }&host=${ host }`);
	}
});

/** @type {import('@sveltejs/kit').Handle} */
export async function handle ({ request }) {
	const shop = request.query.get('shop');
	const host = request.query.get('shop');

	let activeShop = ACTIVE_SHOPIFY_SHOPS[shop];
	// if not saved to memory, fetch from json file
	if (!activeShop) {
		activeShop = getShopFromDb(shop);
	}

	if (request.path === '/') {

		if (!shop) {
			// if the url is http://localhost:8081
			return {
				status : 302,
				headers: {
					location: `${ process.env['HOST'] }/?shop=${ process.env['SHOP'] }`
				}
			};
		}

		if (!activeShop) {
			// redirect to auth if no shop if registered
			return {
				status : 301,
				headers: {
					location: `${ process.env['HOST'] }/auth?shop=${ process.env['SHOP'] }`
				}
			};
		}

		if ((!host || !shop) && activeShop && activeShop.host) {
			// if we have a registered shop but the url is not complete
			return {
				status : 301,
				headers: {
					location: `${ process.env['HOST'] }/?shop=${ process.env['SHOP'] }&host=${ activeShop.host }`
				}
			};
		}
	}

	// handle shopify auth
	if (['/auth', '/auth/inline', '/auth/callback', '/auth/enable_cookies'].includes(request.path)) {
		const ctx = convert(request);

		try {
			await auth(ctx as any, () => {
				return true;
			});
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e.message);
		}

		return ctx;
	}

	return null;
}
