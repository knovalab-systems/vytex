import { type InferInput, minLength, object, picklist, pipe, string } from 'valibot';
import { roleList } from '~/constants/roles';

export const UserCreateSchema = object({
	name: pipe(string(), minLength(1, 'Ingresa el nombre.')),
	username: pipe(string(), minLength(1, 'Ingresa el usuario.')),
	password: pipe(
		string(),
		minLength(1, 'Ingresa la contraseña.'),
		minLength(8, 'La contraseña debe ser de mínimo 8 caracteres.'),
	),
	role: picklist(
		roleList.map(role => role.key),
		'Selecciona un rol.',
	),
});

export type UserCreateType = InferInput<typeof UserCreateSchema>;
