import { getApp } from '$lib/shopify/bridge';
import { authenticatedFetch } from '@shopify/app-bridge-utils';
import { Redirect } from '@shopify/app-bridge/actions';

function shopifyFetch () {
	const app = getApp(process.env.SHOP);
	const fetchFunction = authenticatedFetch(app);

	return async (uri, options) => {
		const response = await fetchFunction(uri, options);

		if (
			response.headers.get('X-Shopify-API-Request-Failure-Reauthorize') === '1'
		) {
			const authUrlHeader = response.headers.get(
				'X-Shopify-API-Request-Failure-Reauthorize-Url'
			);

			Redirect.create(app).dispatch(Redirect.Action.REMOTE, authUrlHeader || `/auth`);
			return null;
		}

		return response;
	};
}

export { shopifyFetch as authenticatedFetch };
