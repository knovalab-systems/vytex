import { For, Show } from 'solid-js';
import ActionsCell from '~/components/ActionsCell';
import StatusLabel from '~/components/StatusLabel';
import { Table, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '~/components/ui/Table';
import { FABRICS_UPDATE_PATH } from '~/constants/paths';
import { useColors } from '~/hooks/useColors';
import { usePolicies } from '~/hooks/usePolicies';
import type { Action } from '~/types/actionsCell';
import type { GetFabricsType } from '../requests/fabricGet';

function FabricTable(props: { fabrics?: GetFabricsType }) {
	const { getColorsRecord } = useColors();
	const { hasPolicy } = usePolicies();

	const actions = (id: number) => {
		const arr: Action[] = [];
		if (hasPolicy('UpdateFabrics'))
			arr.push({
				path: `${FABRICS_UPDATE_PATH}/${id}`,
				title: 'Actualizar tela',
				label: 'Actualizar',
				icon: 'update',
			});
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
				<Show when={(props.fabrics?.length ?? 0) === 0}>
					<TableRow class='bg-white'>
						<TableCell colspan={9}>No se han encontrado telas.</TableCell>
					</TableRow>
				</Show>
				<For each={props.fabrics}>
					{fabric => (
						<TableRow class='bg-white'>
							<TableCell>{fabric.id}</TableCell>
							<TableCell>{fabric.code}</TableCell>
							<TableCell>{fabric.name}</TableCell>
							<TableCell>
								<div>{getColorsRecord()[fabric.color_id as number]?.name || fabric.color_id}</div>
							</TableCell>
							<TableCell>
								<div
									class='h-10 w-10 border-2'
									style={{ background: getColorsRecord()[fabric.color_id as number]?.hex || '' }}
								/>
							</TableCell>
							<TableCell>${fabric.cost}</TableCell>
							<TableCell>Proveedor</TableCell>
							<TableCell>
								<StatusLabel status={!fabric.deleted_at} />
							</TableCell>
							<ActionsCell actions={actions(fabric.id)} />
						</TableRow>
					)}
				</For>
			</Table>
		</TableContainer>
	);
}

export default FabricTable;
