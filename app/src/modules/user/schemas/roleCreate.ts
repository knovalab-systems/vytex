import { type InferInput, array, minLength, object, pipe, string } from 'valibot';
import { REQ_NAME } from '~/constants/commonErrMsgs';

export const RoleCreateSchema = object({
	name: pipe(string(), minLength(1, REQ_NAME)),
	policies: pipe(array(string()), minLength(1, 'Marca al menos una función.')),
});

export type RoleCreateType = InferInput<typeof RoleCreateSchema>;
