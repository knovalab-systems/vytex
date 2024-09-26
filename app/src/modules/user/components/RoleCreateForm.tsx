import { type SubmitHandler, createForm, getError, valiForm } from '@modular-forms/solid';
import { useNavigate } from '@solidjs/router';
import { For, Show } from 'solid-js';
import CancelButton from '~/components/CancelButton';
import { Button } from '~/components/ui/Button';
import { Checkbox } from '~/components/ui/Checkbox';
import { Input } from '~/components/ui/Input';
import { Label, LabelSpan } from '~/components/ui/Label';
import { ROLES_PATH } from '~/constants/paths';
import { RoleCreateSchema, type RoleCreateType } from '../schemas/roleCreate';
import { POLICIES } from '~/constants/policies';
import { createRoleRequest } from '../requests/roleCreate';
import type { VytexRole } from '@vytex/client';
import { toast } from 'solid-toast';
import { refetchRoles } from '~/hooks/useRoles';

function RoleCreateForm() {
	const navigate = useNavigate();

	const [form, { Form, Field }] = createForm<RoleCreateType>({
		validate: valiForm(RoleCreateSchema),
	});

	const handleSubmit: SubmitHandler<RoleCreateType> = async data => {
		return createRoleRequest(data as VytexRole)
			.then(() => {
				refetchRoles();
				toast.success('Role creado correctamente.');
				navigate(ROLES_PATH);
			})
			.catch(() => toast.error('Error al crear rol.'));
	};

	const checkedError = () => getError(form, 'policies');

	return (
		<Form class='w-full md:w-5/6 xl:w-3/5' onSubmit={handleSubmit}>
			<div class='space-y-4 p-8 m-4 bg-white rounded-md border border-gray-100 shadow-md'>
				<h1 class='text-2xl font-bold text-center'>Crear rol</h1>
				<div class='w-full space-y-4'>
					<Field name='name'>
						{(field, props) => (
							<div>
								<Label for='name-field'>Nombre</Label>
								<Input
									placeholder='Nombre del rol'
									autocomplete='off'
									id='name-field'
									aria-errormessage={field.error}
									required
									value={field.value}
									{...props}
								/>
							</div>
						)}
					</Field>
					<div>
						<LabelSpan>Funciones</LabelSpan>
						<div class='grid grid-cols-4 p-2 gap-3'>
							<For each={Object.values(POLICIES)}>
								{({ name, value }) => (
									<Field name='policies' type='string[]'>
										{(field, props) => (
											<Checkbox
												{...props}
												label={name}
												value={value}
												checked={field.value?.includes(value)}
												name={value}
											/>
										)}
									</Field>
								)}
							</For>
						</div>
						<Show when={checkedError()}>
							<div class={'text-sm text-red-600'}>{checkedError()}</div>
						</Show>
					</div>
				</div>
			</div>

			<div class='flex justify-between m-4'>
				<CancelButton to={ROLES_PATH} />
				<Button type='submit' disabled={form.submitting} variant='success'>
					Crear
				</Button>
			</div>
		</Form>
	);
}

export default RoleCreateForm;
