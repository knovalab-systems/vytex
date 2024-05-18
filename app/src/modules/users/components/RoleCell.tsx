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
import { type RoleItems, listRole, roles } from '~/utils/roles';
import { updateUserRequest } from '../requests/updateUserRequests';
import type { User } from '../schemas/userSchema';

function RoleCell(props: {
	roleValue: string;
	userId: string;
}) {
	const [role, setRole] = createSignal(roles[props.roleValue]);
	const [value, setValue] = createSignal(roles[props.roleValue]);
	const [edit, setEdit] = createSignal(false);

	createEffect(() => {
		if (edit()) {
			setValue(role());
		}
	});

	const handleSubmit = () => {
		if (value().role !== role().role) {
			const user: User = { role: value().role };
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
				<Dialog open={edit()} onOpenChange={setEdit}>
					<DialogTrigger variant='ghost' class='lg:invisible hover:bg-baby_blue'>
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
							options={listRole}
							optionValue='role'
							optionTextValue='name'
							placeholder='Selecciona un rol'
							itemComponent={props => <SelectItem item={props.item}>{props.item.rawValue.name}</SelectItem>}
						>
							<SelectTrigger aria-label='Roles' role='listbox'>
								<SelectValue<RoleItems>>{state => state.selectedOption().name}</SelectValue>
							</SelectTrigger>
							<SelectContent />
						</Select>
						<DialogFooter>
							<Button onclick={() => setEdit(false)}>Cancelar</Button>
							<Button onclick={handleSubmit}>Guardar</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</TableCell>
	);
}

export default RoleCell;
