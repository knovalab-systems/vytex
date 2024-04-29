import { type SubmitHandler, createForm, valiForm } from '@modular-forms/solid';
import { useNavigate } from '@solidjs/router';
import { createSignal } from 'solid-js';
import toast from 'solid-toast';
import { LoginSchema, type LoginType } from '../schema/authSchemas';
import { loginRequest } from '../requests/authRequests';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/Input';
import { Label } from '~/components/ui/Label';

function LoginForm() {
	const navigate = useNavigate();
	const [disabled, setDisable] = createSignal(false);
	const [_, { Form, Field }] = createForm<LoginType>({
		validate: valiForm(LoginSchema),
		initialValues: { username: '', password: '' },
	});

	const handleSubmit: SubmitHandler<LoginType> = (data, event) => {
		event.preventDefault();
		setDisable(true);
		loginRequest(data.username, data.password)
			.then(() => navigate('/', { replace: true }))
			.catch(() => {
				setDisable(false);
				toast.error('Revisa tu usuario y contraseña');
			});
	};

	return (
		<div class='grid md:grid-cols-3 w-full h-full '>
			<div class='hidden md:block col-span-2 bg-bg' />
			<Form class='my-auto md:m-auto md:w-3/5 xl:w-5/6' onSubmit={handleSubmit}>
				<div class='flex flex-col justify-center gap-6 p-8 m-4 bg-white rounded-md border border-gray-100 shadow-md'>
					<h1 class='text-left text-2xl font-bold'>
						Bienvenido a Vytex <br />
						Inicia sesión para continuar
					</h1>
					<Field name='username'>
						{(field, props) => (
							<div>
								<Label for='username-field'>Nombre de usuario</Label>
								<Input
									placeholder='jose23'
									id='username-field'
									aria-errormessage={field.error}
									required
									value={field.value}
									{...props}
								/>
							</div>
						)}
					</Field>
					<Field name='password'>
						{(field, props) => (
							<div>
								<Label for='pass-field'>Contraseña</Label>
								<Input
									value={field.value}
									placeholder='*********'
									type='password'
									id='pass-field'
									aria-errormessage={field.error}
									required
									{...props}
								/>
							</div>
						)}
					</Field>
					<Button disabled={disabled()} type='submit'>
						Iniciar sesión
					</Button>
				</div>
			</Form>
		</div>
	);
}

export default LoginForm;
