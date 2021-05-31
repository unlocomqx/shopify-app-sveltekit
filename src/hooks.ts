import { handle as shopifyHandle } from "./shopify/handler";

/** @type {import('@sveltejs/kit').Handle} */
export async function handle ({ request, render }) {
  if (request.path !== "/") {
    const shopifyRes = await shopifyHandle({ request, render });
    if (shopifyRes) {
      return shopifyRes;
    }
  }

  return render(request);
}
