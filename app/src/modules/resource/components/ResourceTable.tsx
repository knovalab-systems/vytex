import { For, Show } from 'solid-js';
import ActionsCell from '~/components/ActionsCell';
import StatusLabel from '~/components/StatusLabel';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '~/components/ui/Table';
import { RESOURCES_UPDATE_PATH } from '~/constants/paths';
import { useColors } from '~/hooks/useColors';
import { usePolicies } from '~/hooks/usePolicies';
import { useSuppliers } from '~/hooks/useSuppliers';
import type { Action } from '~/types/actionsCell';
import type { GetResourcesType } from '../requests/resourceGet';

function ResourceTable(props: { resources?: GetResourcesType }) {
	const { getColorsRecord } = useColors();
	const { getSuppliersRecord: supplierRecord } = useSuppliers();
	const { hasPolicy } = usePolicies();

	const actions = (id: number) => {
		const arr: Action[] = [];
		if (hasPolicy('UpdateResources')) {
			arr.push({
				path: `${RESOURCES_UPDATE_PATH}/${id}`,
				title: 'Actualizar insumo',
				label: 'Actualizar',
				icon: 'update',
			});
		}
		return arr;
	};

	return (
		<TableContainer>
			<Table class='table-auto'>
				<TableHeader class='sticky top-0'>
					<TableRow>
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
									<div>{getColorsRecord()[resource.color_id as number]?.name || resource.color_id}</div>
								</TableCell>
								<TableCell>
									<div
										class='h-10 w-10 border-2'
										style={{ background: getColorsRecord()[resource.color_id as number]?.hex || '' }}
									/>
								</TableCell>
								<TableCell>${resource.cost}</TableCell>
								<TableCell>{supplierRecord()[resource.supplier_id as number]?.name || 'Proveedor'}</TableCell>
								<TableCell>
									<StatusLabel status={!resource.deleted_at} />
								</TableCell>
								<ActionsCell actions={actions(resource.id)} />
							</TableRow>
						)}
					</For>
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default ResourceTable;
