// biome-ignore lint/suspicious/noExplicitAny: no types included
export function calculatePercentage(value: number, ctx: any) {
	const total = ctx.chart.getDatasetMeta(0).total;
	const percentage = `${((value * 100) / total).toFixed(2)}%`;
	return percentage;
}

export function calculateStepSize(total: number) {
	const magnitude = 10 ** Math.floor(Math.log10(total));
	const factor = total / magnitude;

	if (factor <= 1) return Math.ceil(magnitude / 10);
	if (factor <= 2) return Math.ceil(magnitude / 5);
	if (factor <= 5) return Math.ceil(magnitude / 2);
	return Math.ceil(magnitude);
}
