import { cookies } from 'next/headers';

export const isAuth = () => {
	const cookieStore = cookies();
	const appCookie = cookieStore.get('app-cookie');

	if (appCookie === undefined) {
		return false;
	}

	const token = appCookie.value;

	try {
		const payload = JSON.parse(atob(token.split('.')[1]));
		const expirationDate = payload.exp * 1000; 
		return Date.now() < expirationDate; 
	} catch (e) {
		return false; 
	}
};

