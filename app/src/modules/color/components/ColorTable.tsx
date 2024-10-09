import { For, Show } from 'solid-js';
import ActionsCell from '~/components/ActionsCell';
import StatusLabel from '~/components/StatusLabel';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '~/components/ui/Table';
import { COLORS_UPDATE_PATH } from '~/constants/paths';
import type { GetColorsType } from '../requests/colorGet';

function ColorTable(props: { colors?: GetColorsType }) {
	return (
		<TableContainer>
			<Table class='md:table-fixed'>
				<TableHeader class='sticky top-0 z-10'>
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>Nombre</TableHead>
						<TableHead>Hex</TableHead>
						<TableHead>Color</TableHead>
						<TableHead>Código</TableHead>
						<TableHead>Estado</TableHead>
						<TableHead>Acciones</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<Show when={(props.colors?.length ?? 0) === 0}>
						<TableRow class='bg-white'>
							<TableCell colspan={7}>No se han encontrado colores.</TableCell>
						</TableRow>
					</Show>
					<For each={props.colors}>
						{color => (
							<TableRow class='bg-white group'>
								<TableCell>{color.id}</TableCell>
								<TableCell>{color.name}</TableCell>
								<TableCell>{color.hex}</TableCell>
								<TableCell>
									<div class='h-10 w-10 border-2' style={{ background: color.hex || '' }} />
								</TableCell>
								<TableCell>{color.code || 'Code'}</TableCell>
								<TableCell>
									<StatusLabel status={!color.deleted_at} />
								</TableCell>
								<ActionsCell
									actions={[
										{
											path: `${COLORS_UPDATE_PATH}/${color.id}`,
											title: 'Actualizar Color',
											label: 'Actualizar',
											icon: 'update',
										},
									]}
								/>
							</TableRow>
						)}
					</For>
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default ColorTable;
