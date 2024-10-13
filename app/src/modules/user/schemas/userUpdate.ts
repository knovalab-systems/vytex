import { type InferInput, literal, minLength, object, picklist, pipe, regex, string, union } from 'valibot';
import { REQ_NAME } from '~/constants/commonErrMsgs';
import { STATUS_VALUES } from '~/constants/status';

export const UserUpdateSchema = object({
	name: pipe(string(), minLength(1, REQ_NAME)),
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
	role_id: pipe(string('Selecciona un rol.'), minLength(1, 'Selecciona un rol.')),
	deleted_at: picklist<string[], string>(STATUS_VALUES, 'Selecciona un estado.'),
});

export type UserUpdateType = InferInput<typeof UserUpdateSchema>;
