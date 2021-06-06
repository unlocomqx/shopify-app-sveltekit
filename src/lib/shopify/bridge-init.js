import { initAppBridge } from './bridge.js';

console.log(typeof window);
if (typeof window !== 'undefined') {
	try {
		initAppBridge();
	} catch (e) {
		console.error(e);
	}
}
