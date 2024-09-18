import type { VytexStep } from '../../../schema/step.js';
import type { ApplyQueryFields, Query } from '../../../types/index.js';
import type { RestCommand } from '../../types.js';

export type ReadStepsOutput<
	Schema,
	TQuery extends Query<Schema, Item>,
	Item extends object = VytexStep<Schema>,
> = ApplyQueryFields<Schema, Item, TQuery['fields']>;

/**
 * List all steps that exist in Vytex.
 *
 * @param query The query parameters
 *
 * @returns An array of up to limit steps objects. If no items are available, data will be an empty array.
 */
export const readSteps =
	<Schema, const TQuery extends Query<Schema, VytexStep<Schema>>>(
		query?: TQuery,
	): RestCommand<ReadStepsOutput<Schema, TQuery>[], Schema> =>
	() => ({
		path: '/steps',
		params: query ?? {},
		method: 'GET',
	});
