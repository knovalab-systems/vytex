import type { VytexTaskControl } from '../../../schema';
import type { ApplyQueryFields, Query } from '../../../types';
import type { RestCommand } from '../../types';
import { throwIfEmpty } from '../../utils';

export type UpdateTaskControlOutput<
	Schema,
	TQuery extends Query<Schema, Item>,
	Item extends object = VytexTaskControl<Schema>,
> = ApplyQueryFields<Schema, Item, TQuery['fields']>;

/**
 * Update an existing task controls.
 *
 * @param key The primary key of the task control
 * @param item The task control data to update
 * @param query Optional return data query
 *
 * @returns Returns the task control object for the updated task control.
 * @throws Will throw if key is empty
 */
export const updateTaskControl =
	<Schema, const TQuery extends Query<Schema, VytexTaskControl<Schema>>>(
		key: VytexTaskControl<Schema>['id'],
		item: Partial<VytexTaskControl<Schema>>,
		query?: TQuery,
	): RestCommand<UpdateTaskControlOutput<Schema, TQuery>, Schema> =>
	() => {
		throwIfEmpty(String(key), 'Key cannot be empty');

		return {
			path: `/task-controls/${key}`,
			params: query ?? {},
			body: JSON.stringify(item),
			method: 'PATCH',
		};
	};
