// biome-ignore lint/suspicious/noExplicitAny: no types included
export function calculatePercentage(value: number, ctx: any) {
	const total = ctx.chart.getDatasetMeta(0).total;
	const percentage = `${((value * 100) / total).toFixed(2)}%`;
	return percentage;
}
