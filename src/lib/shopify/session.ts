import { Shopify } from '@shopify/shopify-api';
import type { Session } from '@shopify/shopify-api/dist/auth/session';
import fs from 'fs';
// Saves the sesson to JSON
// On prod save the session to the DB and use encryption

const SESSION_FILE = '.storage/sessions.json';

const storeCallback = async (session: Session) => {
	let sessions = {};
	if (fs.existsSync(SESSION_FILE)) {
		const json = fs.readFileSync(SESSION_FILE).toString();
		sessions = JSON.parse(json || '{}');
	}

	sessions[session.id] = session;

	fs.writeFileSync(SESSION_FILE, JSON.stringify(sessions, null, '\t'));

	return true;
};

const loadCallback = async (id: string) => {
	if (fs.existsSync(SESSION_FILE)) {
		const json = fs.readFileSync(SESSION_FILE).toString();
		const sessions = JSON.parse(json || '{}');
		return sessions[id] || undefined;
	}
	return undefined;
};

const deleteCallback = async (id) => {
	let sessions = {};
	if (fs.existsSync(SESSION_FILE)) {
		const json = fs.readFileSync(SESSION_FILE).toString();
		sessions = JSON.parse(json || '{}');
	}

	delete sessions[id];

	fs.writeFileSync(SESSION_FILE, JSON.stringify(sessions, null, '\t'));

	return true;
};

export const sessionStorage = new Shopify.Session.CustomSessionStorage(
	storeCallback,
	loadCallback,
	deleteCallback
);
