import type { VytexColor } from '../../../schema/color.js';
import type { ApplyQueryFields, Query } from '../../../types/index.js';
import type { RestCommand } from '../../types';

export type CreateColorOutput<
	Schema,
	TQuery extends Query<Schema, Item>,
	Item extends object = VytexColor<Schema>,
> = ApplyQueryFields<Schema, Item, TQuery['fields']>;

/**
 * Create a new color.
 *
 * @param item The color to create
 * @param query Optional return data query
 *
 * @returns Returns the color object for the created color.
 */
export const createColor =
	<Schema, const TQuery extends Query<Schema, VytexColor<Schema>>>(
		item: Partial<VytexColor<Schema>>,
		query?: TQuery,
	): RestCommand<CreateColorOutput<Schema, TQuery>, Schema> =>
	() => ({
		path: '/colors',
		params: query ?? {},
		body: JSON.stringify(item),
		method: 'POST',
	});
