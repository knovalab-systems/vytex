import { type SubmitHandler, createForm, valiForm } from '@modular-forms/solid';
import { useNavigate } from '@solidjs/router';
import { createSignal } from 'solid-js';
import toast from 'solid-toast';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Label } from '~/components/ui/Label';
import { STATUS_CODE } from '~/utils/constants';
import { roleList } from '~/utils/roles';
import { createUserRequest } from '../requests/createUserRequests';
import { CreateSchema, type CreateType } from '../schemas/createSchema';

function CreateForm() {
	const navigate = useNavigate();
	const [disabled, setDisable] = createSignal(false);

	const [_, { Form, Field }] = createForm<CreateType>({
		validate: valiForm(CreateSchema),
		initialValues: { name: '', username: '', password: '', role: '' },
	});

	const handleSubmit: SubmitHandler<CreateType> = (data, event) => {
		event.preventDefault();
		setDisable(true);
		createUserRequest(data.name, data.username, data.password, data.role)
			.then(() => {
				toast.success('Usuario creado correctamente');
				navigate('/users');
			})
			.catch(error => {
				if (error.response.status === STATUS_CODE.conflict) {
					toast.error(`El nombre de usuario "${data.username}" no está disponible. Por favor, intente con otro.`);
				} else {
					toast.error('Error al crear usuario');
				}
				setDisable(false);
			});
	};

	const handleGoBack = () => {
		navigate('/users');
	};

	return (
		<div class='w-3/6'>
			<Form class='my-auto md:m-auto md:w-3/5 xl:w-5/6' onSubmit={handleSubmit}>
				<div class='flex flex-col justify-center gap-6 p-8 m-4 bg-white rounded-md border border-gray-100 shadow-md'>
					<h1 class='text-2xl font-bold text-center'>Crear usuario</h1>
					<Field name='name'>
						{(field, props) => (
							<div>
								<Label for='name-field'>Nombre</Label>
								<Input
									placeholder='Jose Perez'
									autocomplete='on'
									id='name-field'
									aria-errormessage={field.error}
									required
									value={field.value}
									{...props}
								/>
							</div>
						)}
					</Field>
					<Field name='username'>
						{(field, props) => (
							<div>
								<Label for='username-field'>Nombre de usuario</Label>
								<Input
									placeholder='jperez'
									autocomplete='on'
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
									type='password'
									placeholder='********'
									id='pass-field'
									aria-errormessage={field.error}
									required
									{...props}
								/>
							</div>
						)}
					</Field>
					<Field name='role'>
						{(field, props) => (
							<div>
								<Label for='role-field'>Rol</Label>
								<select
									class='w-full h-10 px-3 py-2 text-base bg-white border rounded-lg focus:shadow-outline'
									id='role-field'
									aria-errormessage={field.error}
									value={field.value}
									required
									{...props}
								>
									<option value=''>Selecciona un rol</option>
									{roleList.map(role => (
										<option value={role.key}>{role.label}</option>
									))}
								</select>
								{field.error && <div class='text-sm text-red-600'>{field.error}</div>}
							</div>
						)}
					</Field>
					<div class='flex justify-between'>
						<Button type='button' onclick={handleGoBack} class='bg-red-500 hover:bg-red-600'>
							Cancelar
						</Button>
						<Button type='submit' disabled={disabled()} class='bg-green-600 hover:bg-green-700'>
							Guardar
						</Button>
					</div>
				</div>
			</Form>
		</div>
	);
}

export default CreateForm;
