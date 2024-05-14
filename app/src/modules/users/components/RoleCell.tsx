import { Button } from '~/components/ui/Button';
import { TableCell } from '~/components/ui/Table';
import { AiFillEdit } from 'solid-icons/ai';
import { roles } from '~/utils/roles';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '~/components/ui/Dialog';
import { Label } from '~/components/ui/Label';
import { Input } from '~/components/ui/Input';

function RoleCell(props: {
	role: string;
	id: string;
}) {
	return (
		<TableCell>
			<div class='flex w-full justify-between group-hover:*:visible '>
				<span class='my-auto'>{roles[props.role].name}</span>

				<Dialog>
					<DialogTrigger class='invisible'>
						<Button variant='ghost' class=' hover:bg-slate-200'>
							<AiFillEdit size={18} class='' />
						</Button>
					</DialogTrigger>
					<DialogContent class='my-auto sm:max-w-[425px]'>
						<DialogHeader>
							<DialogTitle>Actualizar rol</DialogTitle>
							<DialogDescription>
								Actualizar el rol actual cambiará los permisos de acceso al usuario.
							</DialogDescription>
						</DialogHeader>
						<div class='grid gap-4 py-4'>
							<div class='grid grid-cols-4 items-center gap-4'>
								<Label for='name' class='text-right'>
									Rol
								</Label>
								<Input id='name' value='Sin rol' class='col-span-3' />
							</div>
						</div>
						<DialogFooter>
							<Button type='submit'>Guardar</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</TableCell>
	);
}

export default RoleCell;
