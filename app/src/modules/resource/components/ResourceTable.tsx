import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '~/components/ui/Table';
import type { GetResourcesType } from '../requests/resourcesGetRequests';
import { Show, For } from 'solid-js';
import StatusLabel from '~/components/StatusLabel';

function ResourceTable(props: { resources?: GetResourcesType }) {
	return (
		<TableContainer>
			<Table class='table-fixed'>
				<TableHeader class='sticky top-0'>
					<TableRow class=' bg-indigo-500 *:text-white hover:bg-indigo-500'>
						<TableHead>ID</TableHead>
						<TableHead>Key</TableHead>
						<TableHead>Nombre</TableHead>
						<TableHead>Color</TableHead>
						<TableHead>Code</TableHead>
						<TableHead>Cost</TableHead>
						<TableHead>Proveedor</TableHead>
						<TableHead>Estado</TableHead>
						<TableHead>Acciones</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<Show when={(props.resources?.length ?? 0) === 0}>
						<TableRow class='bg-white'>
							<TableCell colspan={6}>No se han encontraron insumos.</TableCell>
						</TableRow>
					</Show>
					<For each={props.resources}>
						{resource => (
							<TableRow class='bg-white'>
								<TableCell>{resource.id}</TableCell>
								<TableCell>{resource.key}</TableCell>
								<TableCell>{resource.name}</TableCell>
								<TableCell>{resource.color_id}</TableCell>
								<TableCell>{resource.code || 'Code'}</TableCell>
								<TableCell>{resource.cost}</TableCell>
								<TableCell>Proveedor</TableCell>
								<TableCell>
									<StatusLabel status={!resource.delete_at} />
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

export default ResourceTable;
