import type { VytexReference, VytexTimeByTask } from '../../../schema';
import type { ApplyQueryFields, Query } from '../../../types';
import type { RestCommand } from '../../types';
import { throwIfEmpty } from '../../utils';

export type UpdateReferenceOutput<
	Schema,
	TQuery extends Query<Schema, Item>,
	Item extends object = VytexReference<Schema>,
> = ApplyQueryFields<Schema, Item, TQuery['fields']>;

/**
 * Update time of an existing reference.
 *
 * @param key The primary key of the reference
 * @param item The time data to update
 * @param query Optional return data query
 *
 * @returns Returns the reference object for the updated reference.
 * @throws Will throw if key is empty
 */
export const updateTimesReference =
	<Schema, const TQuery extends Query<Schema, VytexReference<Schema>>>(
		key: VytexReference<Schema>['id'],
		item: Partial<VytexTimeByTask<Schema>>,
		query?: TQuery,
	): RestCommand<UpdateReferenceOutput<Schema, TQuery>, Schema> =>
	() => {
		throwIfEmpty(String(key), 'Key cannot be empty');
		return {
			path: `/references/time-by-task/${key}`,
			params: query ?? {},
			body: JSON.stringify(item),
			method: 'PATCH',
		};
	};
