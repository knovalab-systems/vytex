import type { CoreSchema } from '../../../schema/core.js';
import type { VytexReference } from '../../../schema/reference.js';
import type { ApplyQueryFields, DeepPartial, Query } from '../../../types/index.js';
import type { RestCommand } from '../../types.js';

export type CreateReferenceOutput<
	Schema,
	TQuery extends Query<Schema, Item>,
	Item extends object = VytexReference<Schema>,
> = ApplyQueryFields<VytexReference<CoreSchema>, Item, TQuery['fields']>;

/**
 * Create a new reference.
 *
 * @param item The reference to create
 * @param query Optional return data query
 *
 * @returns Returns the reference object for the created reference.
 */
export const createReference =
	<Schema, const TQuery extends Query<Schema, VytexReference<Schema>>>(
		item: DeepPartial<VytexReference<Schema>>,
		query?: TQuery,
	): RestCommand<CreateReferenceOutput<Schema, TQuery>, Schema> =>
	() => ({
		path: '/references',
		params: query ?? {},
		body: JSON.stringify(item),
		method: 'POST',
	});
