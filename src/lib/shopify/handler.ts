import { deleteShopFromDb, getShopFromDb, saveShopToDb } from '$lib/database/session';
import { initContext } from '$lib/shopify/context';
import { convert } from '$lib/shopify/request';
import shopifyAuth from '@shopify/koa-shopify-auth';
import { Shopify } from '@shopify/shopify-api';
import dotenv from 'dotenv';

// quirk of vite (shopifyAuth is not a function on prod build)
const createShopifyAuth = typeof shopifyAuth === 'function' ? shopifyAuth : (shopifyAuth as any).default;

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

	let activeShop = ACTIVE_SHOPIFY_SHOPS[shop];
	// if not saved to memory, fetch from json file
	if (!activeShop) {
		activeShop = getShopFromDb(shop);
	}

	if (request.path === '/') {

		const host = request.query.get('host');

		if (!shop && !host) {
			return {
				status : 302,
				headers: {
					location: `${ process.env['HOST'] }/?shop=${ process.env['SHOP'] }`
				}
			};
		}

		if (activeShop && !host) {
			return {
				status : 302,
				headers: {
					location: `/?shop=${ shop }&host=${ activeShop.host }`
				}
			};
		}

		if (!activeShop) {
			return {
				status : 302,
				headers: {
					location: `/auth?shop=${ shop }`
				}
			};
		}
	}

	if (!activeShop) {
		const ctx = convert(request);

		try {
			await auth(ctx, () => {
				return true;
			});
		} catch (e) {
			// eslint-disable-next-line no-console
			console.log(e.message);
		}

		return ctx;
	}


	if (request.path === '/auth') {
		// if shop is already stored, redirect to root
		return {
			status : 302,
			headers: {
				location: `/?shop=${ shop }&host=${ activeShop.host }`
			}
		};
	}

	return null;
}
