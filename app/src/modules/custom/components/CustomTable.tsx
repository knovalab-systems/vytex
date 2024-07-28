import { For, Show } from 'solid-js';
import ActionsCell from '~/components/ActionsCell';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '~/components/ui/Table';
import { CUSTOMS_PATH, ORDERS_CREATE_PATH } from '~/constants/paths';
import { parseDateTimeHuman } from '~/lib/parseTime';
import type { GetCustomsType } from '../requests/CustomGet';

function CustomTable(props: { customs?: GetCustomsType }) {
	return (
		<TableContainer>
			<Table class='md:table-fixed'>
				<TableHeader class='sticky top-0 z-10'>
					<TableRow class=' bg-indigo-500 *:text-white hover:bg-indigo-500'>
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
								<Show when={!custom.finished_at && !custom.canceled_at}
									fallback={<TableCell />}>
									<ActionsCell
										create={{
											path: `${CUSTOMS_PATH}${ORDERS_CREATE_PATH}/${custom.id}`,
											title: 'Agregar Orden',
										}}
									/>
								</Show>
							</TableRow>
						)}
					</For>
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default CustomTable;
