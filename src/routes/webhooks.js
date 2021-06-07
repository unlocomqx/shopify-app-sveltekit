import { Shopify } from '@shopify/shopify-api';
import { convert } from '$lib/shopify/request';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get(request) {
	const ctx = convert(request);

	try {
		await Shopify.Webhooks.Registry.process(ctx.req, ctx.res);
		console.log(`Webhook processed, returned status code 200`);
	} catch (error) {
		console.log(`Failed to process webhook: ${error}`);
	}

	return ctx;
}
