import { getLocalTimeZone, now } from '@internationalized/date';
import { type SubmitHandler, createForm, setValue, valiForm } from '@modular-forms/solid';
import { useNavigate } from '@solidjs/router';
import toast from 'solid-toast';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Label, LabelSpan } from '~/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/Select';
import type { User } from '~/schemas/coreSchema';
import { STATUS_CODE } from '~/constants/http';
import { STATUS_OPTIONS } from '~/constants/status';
import { NO_ROLE } from '~/envs/roles';
import { USERS_PATH } from '~/constants/paths';
import { roleList, roles } from '~/utils/roles';
import type { GetUserType } from '../requests/userGetRequests';
import { updateUserRequest } from '../requests/userUpdateRequests';
import { UserUpdateSchema, type UserUpdateType } from '../schemas/userUpdateSchems';

function UserUpdateForm(props: { user?: GetUserType }) {
	const navigate = useNavigate();
	const [form, { Form, Field }] = createForm<UserUpdateType>({
		validate: valiForm(UserUpdateSchema),
		initialValues: {
			name: props.user?.name,
			username: props.user?.username,
			role: props.user?.role || NO_ROLE,
			delete_at: !props.user?.delete_at ? 'Activo' : 'Inactivo',
		},
	});

	const handleSubmit: SubmitHandler<UserUpdateType> = async data => {
		const { delete_at, ...rest } = data;
		const user: User = Object.keys(rest).reduce((p: User, v) => {
			const field = rest[v as keyof typeof rest];
			const oldField = props.user?.[v];
			if (field && field !== oldField) {
				p[v as keyof typeof p] = field;
			}
			return p;
		}, {});

		if (!STATUS_OPTIONS[delete_at as keyof typeof STATUS_OPTIONS] && !props.user?.delete_at) {
			user.deleted_at = now(getLocalTimeZone()).toAbsoluteString();
		} else if (STATUS_OPTIONS[delete_at as keyof typeof STATUS_OPTIONS] && Boolean(props.user?.delete_at)) {
			user.deleted_at = null;
		}

		if (Object.keys(user).length === 0) return;

		return updateUserRequest(props.user?.id, user)
			.then(() => {
				toast.success('Usuario actualizado correctamente');
				navigate(USERS_PATH);
			})
			.catch(error => {
				if (error.response.status === STATUS_CODE.conflict) {
					toast.error(`El nombre de usuario "${data.username}" no está disponible. Intente con otro.`);
				} else {
					toast.error('Error al actualizar usuario');
				}
			});
	};

	const handleCancel = () => navigate(USERS_PATH);

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
								<SelectTrigger aria-label='Roles'>
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
								<SelectTrigger aria-label='Roles'>
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
						Actualizar
					</Button>
				</div>
			</div>
		</Form>
	);
}

export default UserUpdateForm;
