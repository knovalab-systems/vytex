import type { CoreSchema } from '../../../schema/core.js';
import type { VytexCustom } from '../../../schema/custom.js';
import type { ApplyQueryFields, DeepPartial, Query } from '../../../types/index.js';
import type { RestCommand } from '../../types.js';

export type CreateCustomOutput<
	Schema,
	TQuery extends Query<Schema, Item>,
	Item extends object = VytexCustom<Schema>,
> = ApplyQueryFields<VytexCustom<CoreSchema>, Item, TQuery['fields']>;

/**
 * Create a new custom.
 *
 * @param item The custom to create
 * @param query Optional return data query
 *
 * @returns Returns the custom object for the created custom.
 */
export const createCustom =
	<Schema, const TQuery extends Query<Schema, VytexCustom<Schema>>>(
		item: DeepPartial<VytexCustom<Schema>>,
		query?: TQuery,
	): RestCommand<CreateCustomOutput<Schema, TQuery>, Schema> =>
	() => ({
		path: '/customs',
		params: query ?? {},
		body: JSON.stringify(item),
		method: 'POST',
	});
