import { initAppBridge } from './bridge';

if (typeof window !== 'undefined') {
	try {
		initAppBridge();
	} catch (e) {
		console.error(e);
	}
}
