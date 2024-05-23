import { type Input, minLength, object, picklist, string, boolean, optional } from 'valibot';
import { roleList } from '~/utils/roles';

export const UserUpdateSchema = object({
	name: string([minLength(1, 'Por favor ingresa el nombre.')]),
	username: string([minLength(1, 'Por favor ingresa el usuario.')]),
	password: optional(
		string([
			minLength(1, 'Por favor ingresa la contraseña.'),
			minLength(8, 'La contraseña debe ser de mínimo 8 caracteres.'),
		]),
	),
	role: picklist(
		roleList.map(role => role.key),
		'Por favor selecciona un rol.',
	),
	delete_at: boolean(),
});

export type UserUpdateType = Input<typeof UserUpdateSchema>;
