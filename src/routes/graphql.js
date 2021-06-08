import { convert } from '$lib/shopify/request';
import { verifyRequest } from '@shopify/koa-shopify-auth';
import { initContext } from '$lib/shopify/context';
import { GraphqlClient } from '@shopify/shopify-api/dist/clients/graphql';
import loadCurrentSession from '@shopify/shopify-api/dist/utils/load-current-session';

initContext();

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get() {
	return {
		status: 401
	};
}

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post(request) {
	const ctx = convert(request);

	const verify = verifyRequest({ returnHeader: true });

	await verify(ctx);

	if (ctx.headers['x-shopify-api-request-failure-reauthorize']) {
		return {
			status: ctx.status,
			headers: ctx.headers,
			body: null
		};
	}

	const session = await loadCurrentSession(ctx.req, ctx.res);

	const client = new GraphqlClient(session.shop, session.accessToken);

	try {
		const response = await client.query({
			data: request.body
		});

		let headers = Object.fromEntries(response.headers);

		delete headers['content-encoding'];

		return {
			status: 200,
			headers: headers,
			body: JSON.stringify(response.body)
		};
	} catch (e) {
		let status;
		switch (e.constructor.name) {
			case 'MissingRequiredArgument':
				status = 400;
				break;
			case 'HttpResponseError':
				status = e.code;
				break;
			case 'HttpThrottlingError':
				status = 429;
				break;
			default:
				status = 500;
		}

		return {
			status,
			body: e.message
		};
	}
}
