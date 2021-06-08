<script lang='ts'>
	import { gql } from '@apollo/client/core';
	import { query } from 'svelte-apollo';

	let products = query(gql`
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

	function getProducts () {
		products.refetch();
	}
</script>

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
