import { For, Show } from 'solid-js';
import StatusLabel from '~/components/StatusLabel';
import { Table, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '~/components/ui/Table';
import { useColors } from '~/hooks/useColors';
import type { GetFabricsType } from '../request/fabricsGetRequests';

function FabricTable(props: { fabrics?: GetFabricsType }) {
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
						<TableHead>Costo</TableHead>
						<TableHead>Code</TableHead>
						<TableHead>Proveedor</TableHead>
						<TableHead>Estado</TableHead>
						<TableHead>Acciones</TableHead>
					</TableRow>
				</TableHeader>
				<Show when={(props.fabrics?.length ?? 0) === 0}>
					<TableRow class='bg-white'>
						<TableCell colspan={6}>No se han encontraron telas.</TableCell>
					</TableRow>
				</Show>
				<For each={props.fabrics}>
					{fabric => (
						<TableRow class='bg-white'>
							<TableCell>{fabric.id}</TableCell>
							<TableCell class='w-1/6'>{fabric.key}</TableCell>
							<TableCell>{fabric.name}</TableCell>
							<TableCell>
								<div>{colorRecord()[fabric.color_id]?.name || fabric.color_id}</div>
							</TableCell>
							<TableCell>
								<div class='h-10 w-10 border-2' style={{ background: colorRecord()[fabric.color_id]?.hex || '' }} />
							</TableCell>
							<TableCell>{fabric.code || 'Code'}</TableCell>
							<TableCell>${fabric.cost}</TableCell>
							<TableCell>Proveedor</TableCell>
							<TableCell>
								<StatusLabel status={!fabric.delete_at} />
							</TableCell>
							<TableCell>Acciones</TableCell>
						</TableRow>
					)}
				</For>
			</Table>
		</TableContainer>
	);
}

export default FabricTable;
