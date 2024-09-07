import { AiFillEdit } from 'solid-icons/ai';
import { createEffect, createSignal } from 'solid-js';
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
import { type RoleItem, roleList, roles } from '~/constants/roles';
import { NO_ROLE } from '~/envs/roles';
import type { User } from '~/types/core';
import { updateUserRequest } from '../requests/userUpdate';

function RoleCell(props: {
	roleValue: string;
	userId: string;
}) {
	const [role, setRole] = createSignal(roles[props.roleValue] || roles[NO_ROLE]);
	const [value, setValue] = createSignal(roles[props.roleValue]);
	const [edit, setEdit] = createSignal(false);

	createEffect(() => {
		if (edit()) {
			setValue(role());
		}
	});

	const handleSubmit = () => {
		if (value().key !== role().key) {
			const user: User = { role_id: value().key };
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
				<span class='my-auto'>{role().label}</span>
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
							options={roleList}
							optionValue='key'
							optionTextValue='label'
							placeholder='Selecciona un rol'
							itemComponent={props => <SelectItem item={props.item}>{props.item.rawValue.label}</SelectItem>}
						>
							<SelectTrigger aria-label='Roles' title='Ver roles'>
								<SelectValue<RoleItem>>{state => state.selectedOption().label}</SelectValue>
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
			</div>
		</TableCell>
	);
}

export default RoleCell;
