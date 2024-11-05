import { For, Show } from 'solid-js';
import ActionsCell from '~/components/ActionsCell';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '~/components/ui/Table';
import { CUSTOMS_PATH, ORDERS_CREATE_PATH } from '~/constants/paths';
import { usePolicies } from '~/hooks/usePolicies';
import { parseDateTimeHuman } from '~/lib/parseTime';
import type { Action } from '~/types/actionsCell';
import type { GetCustomsType } from '../requests/CustomGet';

function CustomTable(props: { customs?: GetCustomsType }) {
	const { hasPolicy } = usePolicies();
	const actions = (id: number, isFinish: boolean) => {
		const arr: Action[] = [
			{
				path: `${CUSTOMS_PATH}/${id}`,
				title: 'Detalles del pedido',
				label: 'Detalles',
				icon: 'details',
			},
		];
		if (hasPolicy('CreateOrders') && !isFinish)
			arr.push({
				path: `${ORDERS_CREATE_PATH}/${id}`,
				title: 'Agregar Orden',
				label: 'Agregar',
				icon: 'create',
			});
		return arr;
	};

	return (
		<TableContainer>
			<Table class='md:table-fixed'>
				<TableHeader class='sticky top-0 z-10'>
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>Cliente</TableHead>
						<TableHead>Fecha de creación</TableHead>
						<TableHead>Fecha de cancelación</TableHead>
						<TableHead>Fecha de finalización</TableHead>
						<TableHead>Acciones</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<Show when={(props.customs?.length ?? 0) === 0}>
						<TableRow class='bg-white'>
							<TableCell colspan={6}>No se han encontrado pedidos.</TableCell>
						</TableRow>
					</Show>
					<For each={props.customs}>
						{custom => (
							<TableRow class='bg-white group'>
								<TableCell>{custom.id}</TableCell>
								<TableCell>{custom.client}</TableCell>
								<TableCell>{parseDateTimeHuman(custom.created_at)}</TableCell>
								<TableCell>{parseDateTimeHuman(custom.canceled_at)}</TableCell>
								<TableCell>{parseDateTimeHuman(custom.finished_at)}</TableCell>
								<ActionsCell actions={actions(custom.id, Boolean(custom.finished_at) || Boolean(custom.canceled_at))} />
							</TableRow>
						)}
					</For>
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default CustomTable;
