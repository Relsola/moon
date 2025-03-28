/** 复制文本 */
export async function copyToClipboard(text: string) {
	try {
		if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
			await navigator.clipboard.writeText(text);
			return true;
		}
		console.error('Clipboard API not supported');
		return false;
	} catch (error) {
		console.error('Failed to copy text: ', error);
		return false;
	}
}
