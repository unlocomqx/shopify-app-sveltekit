import preprocess from 'svelte-preprocess';
import node from '@sveltejs/adapter-node';
import { replaceCodePlugin } from 'vite-plugin-replace';
import dotenv from 'dotenv';

dotenv.config();

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		adapter: node(),
		ssr: false,

		vite: {
			server: {
				hmr: {
					host: 'localhost',
					protocol: 'ws'
				}
			},
			resolve: {
				alias: {
					'@shopify/shopify-api/dist/error': '@shopify/shopify-api/dist/error.js',
					// workaround for https://github.com/timhall/svelte-apollo/issues/97
					'svelte-apollo': '/node_modules/svelte-apollo/dist/svelte-apollo.es.js'
				},
			},
			plugins: [
				replaceCodePlugin({
					replacements: [
						{
							from: /process.env.SHOPIFY_API_KEY/g,
							to: JSON.stringify(process.env.SHOPIFY_API_KEY)
						},
						{
							from: /process.env.HOST/g,
							to: JSON.stringify(process.env.HOST)
						},
						{
							from: /process.env.SHOP/g,
							to: JSON.stringify(process.env.SHOP)
						}
					]
				})
			]
		}
	}
};

export default config;

