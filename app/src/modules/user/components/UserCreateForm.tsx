import { type SubmitHandler, createForm, valiForm } from '@modular-forms/solid';
import { useNavigate } from '@solidjs/router';
import toast from 'solid-toast';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Label } from '~/components/ui/Label';
import { STATUS_CODE } from '~/constants/http';
import { USERS_PATH } from '~/constants/paths';
import { roleList } from '~/constants/roles';
import { createUserRequest } from '../requests/userCreate';
import { UserCreateSchema, type UserCreateType } from '../schemas/userCreate';

function UserCreateForm() {
	const navigate = useNavigate();

	const [form, { Form, Field }] = createForm<UserCreateType>({
		validate: valiForm(UserCreateSchema),
		initialValues: { name: '', username: '', password: '', role: '' },
	});

	const handleSubmit: SubmitHandler<UserCreateType> = async data => {
		return createUserRequest(data.name, data.username, data.password, data.role)
			.then(() => {
				toast.success('Usuario creado correctamente');
				navigate(USERS_PATH);
			})
			.catch(error => {
				if (error.response.status === STATUS_CODE.conflict) {
					toast.error(`El nombre de usuario "${data.username}" no está disponible. Intente con otro.`);
				} else {
					toast.error('Error al crear usuario');
				}
			});
	};

	const handleCancel = () => navigate(USERS_PATH);

	return (
		<Form class='w-full md:w-4/6 xl:w-2/5' onSubmit={handleSubmit}>
			<div class='flex flex-col justify-center gap-4 p-8 m-4 bg-white rounded-md border border-gray-100 shadow-md'>
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
					<Button type='button' onclick={handleCancel} class='bg-red-500 hover:bg-red-600'>
						Cancelar
					</Button>
					<Button type='submit' disabled={form.submitting} class='bg-green-600 hover:bg-green-700'>
						Guardar
					</Button>
				</div>
			</div>
		</Form>
	);
}

export default UserCreateForm;
