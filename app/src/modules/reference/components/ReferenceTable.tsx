import { For, type JSX, Show } from 'solid-js';
import StatusLabel from '~/components/StatusLabel';
import { Table, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '~/components/ui/Table';
import type { GetReferenceType } from '../requests/referenceGet';

function ReferenceTable(props: {
	references?: GetReferenceType;
	actions: (reference: string | number) => JSX.Element;
}) {
	return (
		<TableContainer>
			<Table class='md:table-fixed'>
				<TableHeader class='sticky top-0'>
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>Code</TableHead>
						<TableHead>Estado</TableHead>
						<TableHead>Acciones</TableHead>
					</TableRow>
				</TableHeader>
				<Show when={(props.references?.length ?? 0) === 0}>
					<TableRow class='bg-white'>
						<TableCell colspan={4}>No se han encontrado referencias.</TableCell>
					</TableRow>
				</Show>
				<For each={props.references}>
					{reference => (
						<TableRow class='bg-white'>
							<TableCell>{reference.id}</TableCell>
							<TableCell>{reference.code}</TableCell>
							<TableCell>
								<StatusLabel status={!reference.deleted_at} />
							</TableCell>
							{props.actions(reference.id)}
						</TableRow>
					)}
				</For>
			</Table>
		</TableContainer>
	);
}

export default ReferenceTable;
