<script lang='ts'>
	import { getApp } from '$lib/shopify/bridge';
	import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client/core';
	import { authenticatedFetch } from '@shopify/app-bridge-utils';
	import { Redirect } from '@shopify/app-bridge/actions';
	import { setClient } from 'svelte-apollo';

	function userLoggedInFetch (app) {
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

	const app = getApp();

	if (app) {
		const link = new HttpLink({
			uri         : '/graphql',
			fetch       : userLoggedInFetch(app),
			fetchOptions: {
				credentials: 'include'
			}
		});

		const client = new ApolloClient({
			link,
			cache: new InMemoryCache()
		});

		setClient(client);
	}
</script>

<slot />
