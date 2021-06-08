import { Shopify } from '@shopify/shopify-api';

// Extracted to separate module to use as a single instance
export const sessionStorage = new Shopify.Session.MemorySessionStorage();
