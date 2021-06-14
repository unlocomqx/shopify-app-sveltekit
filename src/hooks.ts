import { handle as shopifyHandle } from '$lib/shopify/handler';
import { verify } from '$lib/shopify/verify';
import type { ServerRequest } from '@sveltejs/kit/types/hooks';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle ({ request, render }) {
	const shopifyRoutes = ['/', '/auth', '/auth/inline', '/auth/callback'];
	console.log(request.path);
	if (shopifyRoutes.includes(request.path)) {
		const shopifyRes = await shopifyHandle({ request });
		if (shopifyRes) {
			return shopifyRes;
		}
	} else {
		// every other request must have a session
		const redirectToAuth = await verify(request);
		if (redirectToAuth) {
			return redirectToAuth;
		}
	}

	return render(request);
}
