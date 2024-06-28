import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '~/components/ui/Table';
import type { GetResourcesType } from '../requests/resourcesGetRequests';
import { Show, For } from 'solid-js';
import StatusLabel from '~/components/StatusLabel';
import { useColors } from '~/hooks/useColor';

function ResourceTable(props: { resources?: GetResourcesType }) {
	const { colorRecord } = useColors();

	return (
		<TableContainer>
			<Table class='table-auto'>
				<TableHeader class='sticky top-0'>
					<TableRow class=' bg-indigo-500 *:text-white hover:bg-indigo-500'>
						<TableHead>ID</TableHead>
						<TableHead>Key</TableHead>
						<TableHead>Nombre</TableHead>
						<TableHead>Color</TableHead>
						<TableHead class='p-0 w-auto' />
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
								<TableCell class='w-1/6'>{resource.key}</TableCell>
								<TableCell>{resource.name}</TableCell>
								<TableCell class='py-0'>
									<div class='my-auto'>{colorRecord()[resource.color_id]?.name || resource.color_id}</div>
								</TableCell>
								<TableCell>
									<div class='h-10 w-10 border-2' style={{ background: colorRecord()[resource.color_id]?.hex || '' }} />
								</TableCell>
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
