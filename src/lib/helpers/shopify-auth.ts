// Importing cjs modules using vite is tricky
// An import could work on dev module but not on prod! This is why this hacky code exists.

import KoaShopifyAuth from '@shopify/koa-shopify-auth';
import {default as verifyRequest} from "@shopify/koa-shopify-auth/dist/src/verify-request/index.js";

let verifyFn = verifyRequest;

if (typeof verifyFn !== "function") {
    verifyFn = (KoaShopifyAuth as any).verifyRequest;
}

let createShopifyAuth = KoaShopifyAuth;
if (typeof createShopifyAuth !== "function") {
    createShopifyAuth = (KoaShopifyAuth as any).default;
}

export {createShopifyAuth, verifyFn as verifyRequest};
