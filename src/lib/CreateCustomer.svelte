<script lang='ts'>

	import { gql } from '@apollo/client/core';
	import { client } from './graphql/client';

	let name = 'name';
	let lastname = 'lastname';
	let email = 'test@teleworm.us';
	let mutation;
	let loading;

	async function createCustomer () {
		loading = 'loading...';
		mutation = null;
		mutation = await client.mutate(gql`mutation {
			customerCreate(
				input: {
					firstName: "${ name }",
					lastName: "${ lastname }",
					email: "${ email }"
				}
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
		}`);
		loading = '';
	}
</script>

<div style='margin: 10px 0'>
	<label for='name'>
		<span>Name</span>
		<input type='text' id='name' bind:value={name}>
	</label>
	<label for='lastname'>
		<span>Lastname</span>
		<input type='text' id='lastname' bind:value={lastname}>
	</label>
	<label for='email'>
		<span>Email</span>
		<input type='email' required id='email' bind:value={email}>
	</label>
	<button on:click={createCustomer}>Create customer</button>
	<div>
		{loading || ""}
	</div>
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

<style>
  label {
    display: block;
    margin-bottom: 5px;
  }

  label > span {
    display: inline-block;
    width: 100px;
  }
</style>
