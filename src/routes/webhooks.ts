import { convert } from '$lib/shopify/request';
import { Shopify } from '@shopify/shopify-api';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get (request) {
	const ctx = convert(request);

	try {
		await Shopify.Webhooks.Registry.process(ctx.req, ctx.res);
		// eslint-disable-next-line no-console
		console.log(`Webhook processed, returned status code 200`);
	} catch (error) {
		// eslint-disable-next-line no-console
		console.log(`Failed to process webhook: ${ error }`);
	}

	return ctx;
}
