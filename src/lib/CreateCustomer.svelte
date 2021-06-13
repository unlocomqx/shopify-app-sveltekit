<script lang='ts'>

	import { gql } from '@apollo/client/core';
	import { client } from '$lib/graphql/client';

	let mutation;

	async function createCustomer () {
		mutation = null;
		mutation = await client.mutate(gql`mutation customerCreate($input: CustomerInput!) {
			customerCreate(
				input: $input
			)
			{
				customer {
					id
					displayName
					email
				}
				userErrors {
					field
					message
				}
			}
		}`, {
			variables: {
				input: {
					firstName: "name",
					lastName: "lastname",
					email: "email@email.com"
				}
			}
		});
	}
</script>

<div>
	<button on:click={createCustomer}>Create customer</button>
	<div>
		{#if mutation}
			{#if mutation.data.customerCreate.customer}
				<ul>
					<li>ID: {mutation.data.customerCreate.customer.id}</li>
					<li>Customer: {mutation.data.customerCreate.customer.displayName}</li>
					<li>Email: {mutation.data.customerCreate.customer.email}</li>
				</ul>
			{:else if mutation.data.customerCreate.userErrors}
				<ul style="color: red">
					{#each mutation.data.customerCreate.userErrors as error}
						<li>{error.message}</li>
					{/each}
				</ul>
			{/if}
		{/if}
	</div>
</div>
