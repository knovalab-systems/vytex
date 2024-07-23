import type { VytexReference } from '../../../schema/reference';
import type { ApplyQueryFields, Query } from '../../../types/index.js';
import type { RestCommand } from '../../types.js';

export type ReadReferenceOutput<
	Schema extends object,
	TQuery extends Query<Schema, Item>,
	Item extends object = VytexReference<Schema>,
> = ApplyQueryFields<Schema, Item, TQuery['fields']>;

/**
 * List all references that exist in Vytex.
 * @param query The query parameters
 * @returns  An array of up to limit references objects. If no items are available, data will be an empty array.
 */
export const readReference =
	<Schema extends object, const TQuery extends Query<Schema, VytexReference<Schema>>>(
		query?: TQuery,
	): RestCommand<ReadReferenceOutput<Schema, TQuery>[], Schema> =>
	() => ({
		path: '/references',
		params: query ?? {},
		method: 'GET',
	});
