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
					'@shopify/shopify-api/dist/error': '@shopify/shopify-api/dist/error.js'
				}
			},
			plugins: [
				replaceCodePlugin({
					replacements: [
						{
							from: 'ENV_SHOPIFY_API_KEY',
							to: process.env.SHOPIFY_API_KEY
						}
					]
				})
			]
		}
	}
};

export default config;
