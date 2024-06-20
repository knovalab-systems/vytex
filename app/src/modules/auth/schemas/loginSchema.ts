import { type InferInput, minLength, object, pipe, string } from 'valibot';

export const LoginSchema = object({
	username: pipe(string(), minLength(1, 'Por favor ingresa el usuario.')),
	password: pipe(
		string(),
		minLength(1, 'Por favor ingresa la contraseña.'),
		minLength(8, 'La contraseña debe ser de mínimo 8 caracteres.'),
	),
});

export type LoginType = InferInput<typeof LoginSchema>;
