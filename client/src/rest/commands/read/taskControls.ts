import type { VytexTaskControl } from '../../../schema/taskControl.js';
import type { ApplyQueryFields, Query } from '../../../types/index.js';
import type { RestCommand } from '../../types.js';

export type ReadTaskControlOutput<
	Schema,
	TQuery extends Query<Schema, Item>,
	Item extends object = VytexTaskControl<Schema>,
> = ApplyQueryFields<Schema, Item, TQuery['fields']>;

/**
 * List all task controls that exist in Vytex.
 *
 * @param query The query parameters
 *
 * @returns An array of up to limit task controls objects. If no items are available, data will be an empty array.
 */
export const readTaskControls =
	<Schema, const TQuery extends Query<Schema, VytexTaskControl<Schema>>>(
		query?: TQuery,
	): RestCommand<ReadTaskControlOutput<Schema, TQuery>[], Schema> =>
	() => ({
		path: '/task-controls',
		params: query ?? {},
		method: 'GET',
	});
