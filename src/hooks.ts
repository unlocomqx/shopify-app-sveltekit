import { handle as shopifyHandle } from '$lib/shopify/handler';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle ({ request, render }) {
	const shopifyRoutes = ['/', '/auth', '/auth/inline', '/auth/callback'];
	if (shopifyRoutes.includes(request.path)) {
		const shopifyRes = await shopifyHandle({ request });
		if (shopifyRes) {
			return shopifyRes;
		}
	}

	return render(request);
}
