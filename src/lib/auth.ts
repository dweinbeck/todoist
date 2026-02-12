import "server-only";

import { cookies } from "next/headers";
import { getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import "./firebase-admin";

export async function verifyUser(idToken: string): Promise<string | null> {
	if (getApps().length === 0) {
		return null;
	}

	try {
		const decoded = await getAuth().verifyIdToken(idToken);
		return decoded.uid;
	} catch {
		return null;
	}
}

export async function getUserIdFromCookie(): Promise<string | null> {
	const token = (await cookies()).get("__session")?.value;

	if (!token) {
		return null;
	}

	return verifyUser(token);
}
