import { For, Show } from 'solid-js';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '~/components/ui/Table';
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
							<TableCell colspan={6}>No se han encontraron pedidos.</TableCell>
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
								<TableCell>Acciones</TableCell>
							</TableRow>
						)}
					</For>
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default CustomTable;
