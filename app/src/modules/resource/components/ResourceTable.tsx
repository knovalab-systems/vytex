import { For, Show } from 'solid-js';
import ActionsCell from '~/components/ActionsCell';
import ActionsCell from '~/components/ActionsCell';
import StatusLabel from '~/components/StatusLabel';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '~/components/ui/Table';
import { RESOURCES_UPDATE_PATH } from '~/constants/paths';
import { RESOURCES_UPDATE_PATH } from '~/constants/paths';
import { useColors } from '~/hooks/useColors';
import { useSuppliers } from '~/hooks/useSuppliers';
import type { GetResourcesType } from '../requests/resourceGet';

function ResourceTable(props: { resources?: GetResourcesType }) {
	const { colorsRecord: colorRecord } = useColors();
	const { suppliersRecord: supplierRecord } = useSuppliers();

	return (
		<TableContainer>
			<Table class='table-auto'>
				<TableHeader class='sticky top-0'>
					<TableRow class=' bg-indigo-500 *:text-white hover:bg-indigo-500'>
						<TableHead>ID</TableHead>
						<TableHead>Code</TableHead>
						<TableHead>Nombre</TableHead>
						<TableHead>Color</TableHead>
						<TableHead class='p-0 w-auto' />
						<TableHead>Costo</TableHead>
						<TableHead>Proveedor</TableHead>
						<TableHead>Estado</TableHead>
						<TableHead>Acciones</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<Show when={(props.resources?.length ?? 0) === 0}>
						<TableRow class='bg-white'>
							<TableCell colspan={9}>No se han encontrado insumos.</TableCell>
						</TableRow>
					</Show>
					<For each={props.resources}>
						{resource => (
							<TableRow class='bg-white'>
								<TableCell>{resource.id}</TableCell>
								<TableCell>{resource.code}</TableCell>
								<TableCell>{resource.name}</TableCell>
								<TableCell>
									<div>{colorRecord()[resource.color_id as number]?.name || resource.color_id}</div>
								</TableCell>
								<TableCell>
									<div
										class='h-10 w-10 border-2'
										style={{ background: colorRecord()[resource.color_id as number]?.hex || '' }}
									/>
								</TableCell>
								<TableCell>${resource.cost}</TableCell>
								<TableCell>{supplierRecord()[resource.supplier_id as number]?.name || 'Proveedor'}</TableCell>
								<TableCell>
									<StatusLabel status={!resource.deleted_at} />
								</TableCell>
								<ActionsCell
									update={{
										path: `${RESOURCES_UPDATE_PATH}/${resource.id}`,
										title: 'Actualizar Insumo',
									}}
								/>
							</TableRow>
						)}
					</For>
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default ResourceTable;
