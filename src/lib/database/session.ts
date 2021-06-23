import fs from 'fs';
import path from 'path';

const ACTIVE_SHOPIFY_SHOPS_FILE = path.resolve('.storage/shops.json');

export function getShopFromDb (shop) {
	if (fs.existsSync(ACTIVE_SHOPIFY_SHOPS_FILE)) {
		const saved = fs.readFileSync(ACTIVE_SHOPIFY_SHOPS_FILE).toString();
		const activeShops = JSON.parse(saved || '{}');
		return activeShops[shop];
	}
	return null;
}

export function saveShopToDb (shop, shopData) {
	let activeShops = {};
	if (fs.existsSync(ACTIVE_SHOPIFY_SHOPS_FILE)) {
		const saved = fs.readFileSync(ACTIVE_SHOPIFY_SHOPS_FILE).toString();
		activeShops = JSON.parse(saved || '{}');
	}
	// save active shop to file, in prod this should be saved to the db
	activeShops[shop] = shopData;
	fs.writeFileSync(ACTIVE_SHOPIFY_SHOPS_FILE, JSON.stringify(activeShops, null, '\t'));
}

export function deleteShopFromDb (shop) {
	let activeShops = {};
	if (fs.existsSync(ACTIVE_SHOPIFY_SHOPS_FILE)) {
		const saved = fs.readFileSync(ACTIVE_SHOPIFY_SHOPS_FILE).toString();
		activeShops = JSON.parse(saved || '{}');
	}
	// save active shop to file, in prod this should be saved to the db
	delete activeShops[shop];
	fs.writeFileSync(ACTIVE_SHOPIFY_SHOPS_FILE, JSON.stringify(activeShops));
}
