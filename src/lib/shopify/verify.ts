import { convert } from '$lib/shopify/request';
import { verifyRequest } from '@shopify/koa-shopify-auth';
import type { ServerRequest } from '@sveltejs/kit/types/hooks';

export async function verify (request: ServerRequest) {
	const ctx = convert(request);

	const verifyFn = verifyRequest({ returnHeader: true });

	await verifyFn(ctx as any, null);

	if (ctx.headers['x-shopify-api-request-failure-reauthorize']) {
		return {
			status : 401,
			headers: {
				'X-Shopify-API-Request-Failure-Reauthorize'    : '1',
				'X-Shopify-API-Request-Failure-Reauthorize-Url': `${ process.env.HOST }/?shop=${ process.env.SHOP }`
			},
			body   : null
		};
	}

	return undefined;
}
