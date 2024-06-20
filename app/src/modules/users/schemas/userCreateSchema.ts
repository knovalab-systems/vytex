import { type InferInput, minLength, object, picklist, pipe, string } from 'valibot';
import { roleList } from '~/utils/roles';

export const UserCreateSchema = object({
	name: pipe(string(), minLength(1, 'Por favor ingresa el nombre.')),
	username: pipe(string(), minLength(1, 'Por favor ingresa el usuario.')),
	password: pipe(
		string(),
		minLength(1, 'Por favor ingresa la contraseña.'),
		minLength(8, 'La contraseña debe ser de mínimo 8 caracteres.'),
	),
	role: picklist(
		roleList.map(role => role.key),
		'Por favor selecciona un rol.',
	),
});

export type UserCreateType = InferInput<typeof UserCreateSchema>;
