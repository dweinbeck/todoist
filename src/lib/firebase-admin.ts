import {
	applicationDefault,
	type Credential,
	cert,
	getApps,
	initializeApp,
} from "firebase-admin/app";

function getCredential(): Credential | undefined {
	if (process.env.K_SERVICE) {
		return applicationDefault();
	}

	const projectId = process.env.FIREBASE_PROJECT_ID;
	const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
	const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

	if (projectId && clientEmail && privateKey) {
		try {
			return cert({ projectId, clientEmail, privateKey });
		} catch (error) {
			console.error(
				"Firebase Admin SDK credential error -- FIREBASE_PRIVATE_KEY is likely a placeholder. Download a real service account key from Firebase Console -> Project Settings -> Service Accounts.",
				error,
			);
			return undefined;
		}
	}

	console.warn(
		"Firebase credentials not found. On Cloud Run, ADC is used automatically. For local dev, set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.",
	);

	return undefined;
}

const credential = getCredential();

if (getApps().length === 0 && credential) {
	initializeApp({ credential });
}
