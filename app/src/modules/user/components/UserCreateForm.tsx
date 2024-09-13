import { type SubmitHandler, createForm, setValue, valiForm } from '@modular-forms/solid';
import { useNavigate } from '@solidjs/router';
import { Show } from 'solid-js';
import toast from 'solid-toast';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Label, LabelSpan } from '~/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/Select';
import { STATUS_CODE } from '~/constants/http';
import { USERS_PATH } from '~/constants/paths';
import { roleList, roles } from '~/constants/roles';
import { createUserRequest } from '../requests/userCreate';
import { UserCreateSchema, type UserCreateType } from '../schemas/userCreate';
import CancelButton from '~/components/CancelButton';

function UserCreateForm() {
	const navigate = useNavigate();

	const [form, { Form, Field }] = createForm<UserCreateType>({
		validate: valiForm(UserCreateSchema),
	});

	const handleSubmit: SubmitHandler<UserCreateType> = async data => {
		return createUserRequest(data.name, data.username, data.password, data.role)
			.then(() => {
				toast.success('Usuario creado correctamente.');
				navigate(USERS_PATH);
			})
			.catch(error => {
				if (error.response.status === STATUS_CODE.conflict) {
					toast.error(`El nombre de usuario "${data.username}" no está disponible. Intente con otro.`);
				} else {
					toast.error('Error al crear usuario.');
				}
			});
	};

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
					{field => (
						<div>
							<LabelSpan>Rol</LabelSpan>
							<Select
								value={field.value}
								onChange={value => {
									setValue(form, 'role', value);
								}}
								options={roleList.map(e => e.key)}
								placeholder='Selecciona un rol'
								itemComponent={props => <SelectItem item={props.item}>{roles[props.item.rawValue].label}</SelectItem>}
							>
								<SelectTrigger title='Ver roles' aria-label='Roles' aria-errormessage={field.error}>
									<SelectValue<string>>{state => roles[state.selectedOption()].label}</SelectValue>
								</SelectTrigger>
								<Show when={Boolean(field.error)}>
									<div class={'text-sm my-auto text-red-600'}>{field.error}</div>
								</Show>
								<SelectContent />
							</Select>
						</div>
					)}
				</Field>
				<div class='flex justify-between'>
					<CancelButton to={USERS_PATH} />
					<Button type='submit' variant='success' disabled={form.submitting}>
						Crear
					</Button>
				</div>
			</div>
		</Form>
	);
}

export default UserCreateForm;
