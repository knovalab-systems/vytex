import { type SubmitHandler, createForm, setValue, valiForm } from '@modular-forms/solid';
import { useNavigate } from '@solidjs/router';
import { Show } from 'solid-js';
import toast from 'solid-toast';
import CancelButton from '~/components/CancelButton';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Label, LabelSpan } from '~/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/Select';
import { STATUS_CODE } from '~/constants/http';
import { USERS_PATH } from '~/constants/paths';
import { STATUS_OPTIONS } from '~/constants/status';
import { useRoles } from '~/hooks/useRoles';
import type { User } from '~/types/core';
import type { GetUserType } from '../requests/userGet';
import { updateUserRequest } from '../requests/userUpdate';
import { UserUpdateSchema, type UserUpdateType } from '../schemas/userUpdate';

function UserUpdateForm(props: { user?: GetUserType }) {
	const navigate = useNavigate();
	const { getRoles, getRolesRecord: rolesRecord } = useRoles();
	const [form, { Form, Field }] = createForm<UserUpdateType>({
		validate: valiForm(UserUpdateSchema),
		initialValues: {
			name: props.user?.name || '',
			username: props.user?.username || '',
			role_id: props.user?.role_id ?? undefined,
			deleted_at: !props.user?.deleted_at ? 'Activo' : 'Inactivo',
		},
	});

	const handleSubmit: SubmitHandler<UserUpdateType> = async data => {
		const { deleted_at, ...rest } = data;
		const user: User = Object.keys(rest).reduce((p: Omit<User, 'role'>, v) => {
			const field = rest[v as keyof typeof rest];
			const oldField = props.user?.[v as keyof typeof props.user];
			if (field && field !== oldField) {
				p[v as keyof typeof p] = field;
			}
			return p;
		}, {});

		if (!STATUS_OPTIONS[deleted_at as keyof typeof STATUS_OPTIONS] && !props.user?.deleted_at) {
			user.deleted_at = new Date().toISOString();
		} else if (STATUS_OPTIONS[deleted_at as keyof typeof STATUS_OPTIONS] && Boolean(props.user?.deleted_at)) {
			user.deleted_at = null;
		}

		return updateUserRequest(props.user?.id || '', user)
			.then(() => {
				toast.success('Usuario actualizado correctamente.');
				navigate(USERS_PATH);
			})
			.catch(error => {
				if (error.response.status === STATUS_CODE.conflict) {
					toast.error(`El nombre de usuario "${data.username}" no está disponible. Intente con otro.`);
				} else {
					toast.error('Error al actualizar usuario.');
				}
			});
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
								{...props}
							/>
						</div>
					)}
				</Field>
				<Field name='role_id'>
					{field => (
						<div>
							<LabelSpan>Rol</LabelSpan>
							<Select
								value={field.value}
								onChange={value => {
									setValue(form, 'role_id', value);
								}}
								options={getRoles().map(e => e.id)}
								placeholder='Selecciona un rol'
								itemComponent={props => (
									<SelectItem item={props.item}>{rolesRecord()[props.item.rawValue].name}</SelectItem>
								)}
							>
								<SelectTrigger title='Ver roles' aria-label='Roles' aria-errormessage={field.error}>
									<SelectValue<string>>{state => rolesRecord()[state.selectedOption()]?.name || ''}</SelectValue>
								</SelectTrigger>
								<Show when={Boolean(field.error)}>
									<div class={'text-sm my-auto text-red-600'}>{field.error}</div>
								</Show>
								<SelectContent />
							</Select>
						</div>
					)}
				</Field>
				<Field name='deleted_at'>
					{field => (
						<div>
							<LabelSpan>Estado</LabelSpan>
							<Select<string>
								value={field.value}
								onChange={value => {
									setValue(form, 'deleted_at', value);
								}}
								options={Object.keys(STATUS_OPTIONS)}
								placeholder='Selecciona un estado'
								itemComponent={props => <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>}
							>
								<SelectTrigger aria-label='Estado' title='Ver estados' aria-errormessage={field.error}>
									<SelectValue<string>>{state => state.selectedOption()}</SelectValue>
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
					<Button type='submit' disabled={form.submitting || !form.dirty} variant='success'>
						Actualizar
					</Button>
				</div>
			</div>
		</Form>
	);
}

export default UserUpdateForm;
