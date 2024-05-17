let timeoutId: NodeJS.Timeout;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const debounce = <T extends (...args: any[]) => any>(func: T, delay: number) => {
	return (...args: Parameters<T>) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => func(...args), delay);
	};
};

export const cleanupDebounce = () => {
	clearTimeout(timeoutId);
};
