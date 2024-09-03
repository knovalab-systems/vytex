import { type InferInput, entriesFromList, integer, minValue, number, object, pipe } from 'valibot';
import { MIN_NUM_VALUE, REQ_NUM_VALUE_MSG } from '~/constants/commonErrMsgs';
import { TASKS } from '~/constants/tasks';

export const ReferenceTimesUpdateSchema = object(
	entriesFromList(
		TASKS,
		pipe(number(REQ_NUM_VALUE_MSG), integer('Ingresa un número entero.'), minValue(0, MIN_NUM_VALUE)),
	),
);

export type ReferenceTimesUpdateType = InferInput<typeof ReferenceTimesUpdateSchema>;
