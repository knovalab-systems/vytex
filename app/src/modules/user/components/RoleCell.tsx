import { AiFillEdit } from 'solid-icons/ai';
import { Show, createEffect, createSignal } from 'solid-js';
import toast from 'solid-toast';
import { Button } from '~/components/ui/Button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '~/components/ui/Dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/Select';
import { TableCell } from '~/components/ui/Table';
import { usePolicies } from '~/hooks/usePolicies';
import { type Roles, useRoles } from '~/hooks/useRoles';
import type { User } from '~/types/core';
import { updateUserRequest } from '../requests/userUpdate';

function RoleCell(props: {
	roleId: string;
	userId: string;
}) {
	const { getRolesRecord, getRoles } = useRoles();
	const { hasPolicy } = usePolicies();
	const [role, setRole] = createSignal(getRolesRecord()[props.roleId]);
	const [value, setValue] = createSignal(getRolesRecord()[props.roleId]);
	const [edit, setEdit] = createSignal(false);

	createEffect(() => {
		if (edit()) {
			setValue(role());
		}
	});

	const handleSubmit = () => {
		if (value().id !== role().id) {
			const user: User = { role_id: value().id };
			updateUserRequest(props.userId, user)
				.then(() => {
					setRole(value());
					setEdit(false);
					toast.success('El rol ha sido actualizado');
				})
				.catch(() => {
					toast.error('Error al actualizar rol');
				});
		} else {
			setEdit(false);
		}
	};

	return (
		<TableCell>
			<div class='flex w-full justify-between group-hover:*:visible'>
				<span class='my-auto'>{role().name}</span>
				<Show when={hasPolicy('UpdateUsers')}>
					<Dialog open={edit()} onOpenChange={setEdit}>
						<DialogTrigger
							variant='ghost'
							class='lg:invisible hover:bg-action hover:text-action-foreground	 '
							title='Actualizar rol'
						>
							<AiFillEdit size={18} />
						</DialogTrigger>
						<DialogContent class='w-[90%] sm:max-w-[425px]'>
							<DialogHeader>
								<DialogTitle>Actualizar rol</DialogTitle>
								<DialogDescription>
									Actualizar el rol actual cambiará los permisos de acceso al usuario.
								</DialogDescription>
							</DialogHeader>
							<Select
								value={value()}
								onChange={setValue}
								options={getRoles()}
								optionValue='id'
								optionTextValue='name'
								placeholder='Selecciona un rol'
								itemComponent={props => <SelectItem item={props.item}>{props.item.rawValue.name}</SelectItem>}
							>
								<SelectTrigger aria-label='Roles' title='Ver roles'>
									<SelectValue<Roles[number]>>{state => state.selectedOption().name}</SelectValue>
								</SelectTrigger>
								<SelectContent />
							</Select>
							<DialogFooter>
								<Button onclick={() => setEdit(false)} variant='destructive'>
									Cancelar
								</Button>
								<Button onclick={handleSubmit} variant='success'>
									Guardar
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</Show>
			</div>
		</TableCell>
	);
}

export default RoleCell;
