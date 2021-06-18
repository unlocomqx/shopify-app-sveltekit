import { authenticatedFetch } from '$lib/shopify/fetch';
import { HttpLink, InMemoryCache } from '@apollo/client/core/core.cjs.js';
import { SvelteApolloClient } from 'svelte-apollo-client';

const link = new HttpLink({
	uri         : '/graphql',
	fetch       : authenticatedFetch(),
	fetchOptions: {
		credentials: 'include'
	}
});

export const client = SvelteApolloClient({
	link,
	cache: new InMemoryCache()
});
