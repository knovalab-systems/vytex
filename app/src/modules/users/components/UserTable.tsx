import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/Table';

function UserTable() {
	return (
		<div class='overflow-hidden border border-white-200 md:rounded-lg'>
			<Table>
				<TableHeader>
					<TableRow class=' bg-trailway/90 *:text-white hover:bg-trailway'>
						<TableHead>ID</TableHead>
						<TableHead>Usuario</TableHead>
						<TableHead>Nombre</TableHead>
						<TableHead>Rol</TableHead>
						<TableHead>Estado</TableHead>
						<TableHead>Acciones</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow class=' bg-white'>
						<TableCell>ID</TableCell>
						<TableCell>Usuario</TableCell>
						<TableCell>Nombre</TableCell>
						<TableCell>Rol</TableCell>
						<TableCell>Estado</TableCell>
						<TableCell>Acciones</TableCell>
					</TableRow>
					<TableRow class=' bg-white'>
						<TableCell>ID</TableCell>
						<TableCell>Usuario</TableCell>
						<TableCell>Nombre</TableCell>
						<TableCell>Rol</TableCell>
						<TableCell>Estado</TableCell>
						<TableCell>Acciones</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</div>
	);
}

export default UserTable;
