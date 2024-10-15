import type { VytexTaskControlState } from '../../../schema/taskControlState.js';
import type { ApplyQueryFields, Query } from '../../../types/index.js';
import type { RestCommand } from '../../types.js';

export type ReadTaskControlStateOutput<
	Schema,
	TQuery extends Query<Schema, Item>,
	Item extends object = VytexTaskControlState<Schema>,
> = ApplyQueryFields<Schema, Item, TQuery['fields']>;

/**
 * List all task control status that exist in Vytex.
 *
 * @param query The query parameters
 *
 * @returns An array of up to limit task control status objects. If no items are available, data will be an empty array.
 */
export const readTaskControlStatus =
	<Schema, const TQuery extends Query<Schema, VytexTaskControlState<Schema>>>(
		query?: TQuery,
	): RestCommand<ReadTaskControlStateOutput<Schema, TQuery>[], Schema> =>
	() => ({
		path: '/task-control-status',
		params: query ?? {},
		method: 'GET',
	});
