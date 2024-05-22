import { type Input, custom, forward, minLength, object, picklist, string } from 'valibot';
import { listRole } from '~/utils/roles';

export const CreateSchema = object({
	name: string([minLength(1, 'Por favor ingresa el nombre.')]),
	username: string([minLength(1, 'Por favor ingresa el usuario.')]),
	password: string([
		minLength(1, 'Por favor ingresa la contraseña.'),
		minLength(8, 'La contraseña debe ser de mínimo 8 caracteres.'),
	]),
	role: picklist(
		listRole.map(role => role.role),
		'Por favor selecciona un rol.',
	),
});

export type CreateType = Input<typeof CreateSchema>;
