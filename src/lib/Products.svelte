<script lang='ts'>
	import { client } from '$lib/graphql/client';
	import { gql } from '@apollo/client/core';

	let products;

	function getProducts () {
		products = client.query(gql`
		query {
			products (first: 5) {
				edges {
				node {
						id
						title
					}
				}
  		}
		}
	`);
	}
</script>

<p>
	<button on:click={getProducts}>Get the list of products using GraphQL</button>

	{#if products}
		{#if $products.loading}
			Loading...
		{:else if $products.error}
			Error: {$products.error.message}
		{:else}
			<ul>
				{#each $products.data.products.edges as product}
					<li>
						Product: {product.node.title}
					</li>
				{/each}
			</ul>
		{/if}
	{/if}
</p>
