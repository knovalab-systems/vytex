import { For, Show } from 'solid-js';
import ActionsCell from '~/components/ActionsCell';
import StatusLabel from '~/components/StatusLabel';
import { Table, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '~/components/ui/Table';
import { REFS_PATH, REFS_TIMES_PATH } from '~/constants/paths';
import { useColors } from '~/hooks/useColors';
import { usePolicies } from '~/hooks/usePolicies';
import type { Action } from '~/types/actionsCell';
import type { GetReferenceType } from '../requests/referenceGet';

function ReferenceTable(props: { references?: GetReferenceType }) {
	const { getColorsRecord } = useColors();
	const { hasPolicy } = usePolicies();
	const actions = (id: number) => {
		const arr: Action[] = [
			{
				path: `${REFS_PATH}/${id}`,
				icon: 'details',
				label: 'Detalles',
				title: 'Detalles de la referencia',
			},
		];
		if (hasPolicy('UpdateTimesReferences'))
			arr.push({
				icon: 'update',
				label: 'Tiempos',
				title: 'Actualizar tiempos',
				path: `${REFS_TIMES_PATH}/${id}`,
			});
		return arr;
	};

	return (
		<TableContainer>
			<Table class='md:table-fixed'>
				<TableHeader class='sticky top-0'>
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>Código</TableHead>
						<TableHead>Colores</TableHead>
						<TableHead>Estado</TableHead>
						<TableHead>Acciones</TableHead>
					</TableRow>
				</TableHeader>
				<Show when={(props.references?.length ?? 0) === 0}>
					<TableRow class='bg-white'>
						<TableCell colspan={5}>No se han encontrado referencias.</TableCell>
					</TableRow>
				</Show>
				<For each={props.references}>
					{reference => (
						<TableRow class='bg-white'>
							<TableCell>{reference.id}</TableCell>
							<TableCell>{reference.code}</TableCell>
							<TableCell class='flex gap-2'>
								<For each={reference.colors}>
									{color => (
										<div
											class='h-10 w-10 border-2'
											title={getColorsRecord()[color.color_id as number]?.name || ''}
											style={{
												background: getColorsRecord()[color.color_id as number]?.hex || '',
											}}
										/>
									)}
								</For>
							</TableCell>
							<TableCell>
								<StatusLabel status={!reference.deleted_at} />
							</TableCell>
							<ActionsCell actions={actions(reference.id)} />
						</TableRow>
					)}
				</For>
			</Table>
		</TableContainer>
	);
}

export default ReferenceTable;
