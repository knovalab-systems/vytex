import { type InferInput, literal, minLength, object, picklist, pipe, regex, string, union } from 'valibot';
import { roleList } from '~/constants/roles';
import { STATUS_OPTIONS } from '~/constants/status';

export const UserUpdateSchema = object({
	name: pipe(string(), minLength(1, 'Ingresa el nombre.')),
	username: pipe(string(), minLength(1, 'Ingresa el usuario.')),
	password: union(
		[
			pipe(
				string(),
				minLength(8, 'La contraseña debe ser de mínimo 8 caracteres.'),
				regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, 'La contraseña debe contener mayúsculas, minúsculas y números.'),
			),
			literal(''),
		],
		'La contraseña debe ser de mínimo 8 caracteres.',
	),
	role_id: picklist(
		roleList.map(role => role.key),
		'Selecciona un rol.',
	),
	deleted_at: picklist<string[], string>(Object.keys(STATUS_OPTIONS), 'Selecciona un estado.'),
});

export type UserUpdateType = InferInput<typeof UserUpdateSchema>;
