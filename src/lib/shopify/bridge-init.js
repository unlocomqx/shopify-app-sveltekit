import { initAppBridge } from './bridge.js';

if (typeof window !== 'undefined') {
	try {
		initAppBridge();
	} catch (e) {
		console.error(e);
	}
}
