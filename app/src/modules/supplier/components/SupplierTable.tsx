import { For, Show } from 'solid-js';
import StatusLabel from '~/components/StatusLabel';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '~/components/ui/Table';
import type { GetSuppliersType } from '../requests/supplierGet';

function SupplierTable(props: { suppliers?: GetSuppliersType }) {
	return (
		<TableContainer>
			<Table class='md:table-fixed'>
				<TableHeader class='sticky top-0 z-10'>
					<TableRow class=' bg-trailway *:text-white hover:bg-trailway/90'>
						<TableHead>ID</TableHead>
						<TableHead>Nombre</TableHead>
						<TableHead>NIT</TableHead>
						<TableHead>Estado</TableHead>
						<TableHead>Acciones</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<Show when={(props.suppliers?.length ?? 0) === 0}>
						<TableRow class='bg-white'>
							<TableCell colspan={5}>No se han encontraron proveedores.</TableCell>
						</TableRow>
					</Show>
					<For each={props.suppliers}>
						{supplier => (
							<TableRow class='bg-white group'>
								<TableCell>{supplier.id}</TableCell>
								<TableCell>{supplier.name}</TableCell>
								<TableCell>{supplier.nit}</TableCell>
								<TableCell>
									<StatusLabel status={!supplier.deleted_at} />
								</TableCell>
								<TableCell>Acciones</TableCell>
							</TableRow>
						)}
					</For>
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default SupplierTable;
