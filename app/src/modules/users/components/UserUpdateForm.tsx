import { getLocalTimeZone, now } from '@internationalized/date';
import { type SubmitHandler, createForm, setValue, valiForm } from '@modular-forms/solid';
import { useNavigate } from '@solidjs/router';
import toast from 'solid-toast';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Label, LabelSpan } from '~/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/Select';
import { STATUS_CODE, STATUS_OPTIONS } from '~/utils/constants';
import { USERS_PATH } from '~/utils/paths';
import { roleList, roles } from '~/utils/roles';
import type { GetUserType } from '../requests/getUserRequests';
import { updateUserRequest } from '../requests/updateUserRequests';
import type { User } from '../schemas/userSchema';
import { UserUpdateSchema, type UserUpdateType } from '../schemas/userUpdateSchems';

function UserUpdateForm(props: { user: GetUserType }) {
	const navigate = useNavigate();
	const [form, { Form, Field }] = createForm<UserUpdateType>({
		validate: valiForm(UserUpdateSchema),
		initialValues: {
			name: props.user?.name,
			username: props.user?.username,
			role: props.user?.role,
			delete_at: props.user?.delete_at ? 'Inactivo' : 'Activo',
		},
	});

	const handleSubmit: SubmitHandler<UserUpdateType> = async data => {
		const user: User = Object.keys(data).reduce((p: User, v) => {
			const field = data[v as keyof typeof data];
			const oldField = props.user?.[v];
			if (field && field !== oldField) {
				p[v as keyof typeof p] = field;
			}
			return p;
		}, {});

		user.delete_at = undefined;
		if (!STATUS_OPTIONS[data.delete_at as keyof typeof STATUS_OPTIONS] && !props.user?.delete_at) {
			user.delete_at = now(getLocalTimeZone()).toAbsoluteString();
		}

		return updateUserRequest(props.user?.id, user)
			.then(() => {
				toast.success('Usuario actualizado correctamente');
				navigate(USERS_PATH);
			})
			.catch(error => {
				if (error.response.status === STATUS_CODE.conflict) {
					toast.error(`El nombre de usuario "${data.username}" no está disponible. Por favor, intente con otro.`);
				} else {
					toast.error('Error al actualizar usuario');
				}
			});
	};

	const handleCancel = () => {
		navigate(USERS_PATH);
	};

	return (
		<Form class='w-full md:w-4/6 xl:w-2/5' onSubmit={handleSubmit}>
			<div class='flex flex-col justify-center p-8 m-4 gap-4 bg-white border-gray-100 shadow-md rounded-md border'>
				<h1 class='text-center text-2xl font-bold'>Actualizar usuario</h1>
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
							<Select<string>
								value={field.value}
								onChange={value => {
									setValue(form, 'role', value);
								}}
								options={roleList.map(e => e.key)}
								placeholder='Selecciona un rol'
								itemComponent={props => <SelectItem item={props.item}>{roles[props.item.rawValue].label}</SelectItem>}
							>
								<SelectTrigger aria-label='Roles' role='listbox'>
									<SelectValue<string>>{state => roles[state.selectedOption()].label}</SelectValue>
								</SelectTrigger>
								<SelectContent />
							</Select>
						</div>
					)}
				</Field>
				<Field name='delete_at'>
					{field => (
						<div>
							<LabelSpan>Estado</LabelSpan>
							<Select<string>
								value={field.value}
								onChange={value => {
									setValue(form, 'delete_at', value);
								}}
								options={Object.keys(STATUS_OPTIONS)}
								placeholder='Selecciona un rol'
								itemComponent={props => <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>}
							>
								<SelectTrigger aria-label='Roles' role='listbox'>
									<SelectValue<string>>{state => state.selectedOption()}</SelectValue>
								</SelectTrigger>
								<SelectContent />
							</Select>
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

export default UserUpdateForm;
