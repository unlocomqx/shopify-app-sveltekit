import { Shopify } from '@shopify/shopify-api';
import { convert } from '$lib/shopify/request';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post(request) {
	const ctx = convert(request);

	return ctx;
}
