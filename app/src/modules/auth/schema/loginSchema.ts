import { type Input, minLength, object, string } from 'valibot';

export const LoginSchema = object({
	email: string([minLength(1, 'Por favor ingresa el código de usuario.')]),
	password: string([
		minLength(1, 'Por favor ingresa la contraseña.'),
		minLength(8, 'La contraseña debe ser de mínimo 8 caracteres.'),
	]),
});

export type LoginType = Input<typeof LoginSchema>;
