import { Button } from '~/components/ui/Button';
import { TableCell } from '~/components/ui/Table';
import { AiFillEdit } from 'solid-icons/ai';
import { type RoleItems, listRole, roles } from '~/utils/roles';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '~/components/ui/Dialog';
import { createEffect, createSignal } from 'solid-js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/Select';
import { updateRole } from '../requests/updateUserRequests';

function RoleCell(props: {
	role: string;
	id: string;
}) {
	const [role, setRole] = createSignal(roles[props.role]);
	const [value, setValue] = createSignal(roles[props.role]);
	const [edit, setEdit] = createSignal(false);

	createEffect(() => {
		if (edit()) {
			setValue(role());
		}
	});

	const handleSubmit = () => {
		updateRole(props.id, value().role)
			.then(() => {
				console.log('update');
				setRole(value());
				setEdit(false);
			})
			.catch(err => {
				console.log(err);
			});
	};

	return (
		<TableCell>
			<div class='flex w-full justify-between group-hover:*:visible '>
				<span class='my-auto'>{role().name}</span>

				<Dialog open={edit()} onOpenChange={setEdit}>
					<DialogTrigger class='invisible'>
						<Button variant='ghost' class=' hover:bg-slate-200'>
							<AiFillEdit size={18} class='' />
						</Button>
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
							<SelectTrigger aria-label='Roles'>
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
