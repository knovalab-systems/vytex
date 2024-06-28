import { For, Show } from 'solid-js';
import StatusLabel from '~/components/StatusLabel';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '~/components/ui/Table';
import type { GetColorsType } from '../requests/colorsGetRequests';

function ColorTable(props: { colors?: GetColorsType }) {
	return (
		<TableContainer>
			<Table class='table-fixed'>
				<TableHeader class='sticky top-0 z-10'>
					<TableRow class=' bg-indigo-500 *:text-white hover:bg-indigo-500'>
						<TableHead>ID</TableHead>
						<TableHead>Nombre</TableHead>
						<TableHead>Hex</TableHead>
						<TableHead>Code</TableHead>
						<TableHead>Estado</TableHead>
						<TableHead>Acciones</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<Show when={(props.colors?.length ?? 0) === 0}>
						<TableRow class='bg-white'>
							<TableCell colspan={6}>No se han encontraron colores.</TableCell>
						</TableRow>
					</Show>
					<For each={props.colors}>
						{color => (
							<TableRow class='bg-white group'>
								<TableCell>{color.id}</TableCell>
								<TableCell>{color.name}</TableCell>
								<TableCell class='py-0'>
									<div class='flex gap-4'>
										<div class='my-auto'>{color.hex}</div>
										<div class='h-10 w-10 border-2' style={{ background: color.hex || '' }} />
									</div>
								</TableCell>
								<TableCell>{color.code || 'Code'}</TableCell>
								<TableCell>
									<StatusLabel status={!color.delete_at} />
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

export default ColorTable;
