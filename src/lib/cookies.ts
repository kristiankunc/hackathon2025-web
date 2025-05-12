export function getCookie(name: string): string | null {
	const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
	return match ? decodeURIComponent(match[2]) : null;
}

export function setCookie(name: string, value: string): void {
	document.cookie = `${name}=${encodeURIComponent(value)}; path=/`;
}