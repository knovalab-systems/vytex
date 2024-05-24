import { type Input, minLength, object, picklist, string, optional } from 'valibot';
import { STATUS_OPTIONS } from '~/utils/constants';
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
	role: picklist<string[]>(roleList.map(role => role.key)),
	delete_at: picklist<string[]>(Object.keys(STATUS_OPTIONS)),
});

export type UserUpdateType = Input<typeof UserUpdateSchema>;
