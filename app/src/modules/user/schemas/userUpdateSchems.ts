import { type InferInput, literal, minLength, object, picklist, pipe, string, union } from 'valibot';
import { STATUS_OPTIONS } from '~/constants/status';
import { roleList } from '~/constants/roles';

export const UserUpdateSchema = object({
	name: pipe(string(), minLength(1, 'Ingresa el nombre.')),
	username: pipe(string(), minLength(1, 'Ingresa el usuario.')),
	password: union(
		[pipe(string(), minLength(8, 'La contraseña debe ser de mínimo 8 caracteres.')), literal('')],
		'La contraseña debe ser de mínimo 8 caracteres.',
	),
	role: picklist<string[]>(roleList.map(role => role.key)),
	deleted_at: picklist<string[]>(Object.keys(STATUS_OPTIONS)),
});

export type UserUpdateType = InferInput<typeof UserUpdateSchema>;
