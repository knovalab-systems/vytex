/**
 * check whether 2 arrays are equal sets, assumes array elements are primitive types.
 * @param  {} a1 is an array
 * @param  {} a2 is an array
 */

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function areArraysEqualSets(a1: Array<any>, a2: Array<any>) {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const superSet: any = {};
	for (const i of a1) {
		const e = i + typeof i;
		superSet[e] = 1;
	}

	for (const i of a2) {
		const e = i + typeof i;
		if (!superSet[e]) {
			return false;
		}
		superSet[e] = 2;
	}

	for (const e in superSet) {
		if (superSet[e] === 1) {
			return false;
		}
	}

	return true;
}
