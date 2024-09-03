import { For, Match, Show, Switch } from 'solid-js';
import ActionsCell from '~/components/ActionsCell';
import StatusLabel from '~/components/StatusLabel';
import { Table, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '~/components/ui/Table';
import { REFS_TIMES_PATH } from '~/constants/paths';
import { DESIGNER_ROLE, PRO_SUPERVISOR_ROLE } from '~/envs/roles';
import { queryClient } from '~/lib/queryClient';
import { getMeQueryKey, type getMeType } from '~/requests/getMe';
import type { GetReferenceType } from '../requests/referenceGet';

function ReferenceTable(props: { references?: GetReferenceType }) {
	const user = queryClient.getQueryData<getMeType>([getMeQueryKey]);

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
							<Switch fallback={<ActionsCell actions={[]} />}>
								<Match when={user?.role === DESIGNER_ROLE}>
									<ActionsCell actions={[]} />
								</Match>
								<Match when={user?.role === PRO_SUPERVISOR_ROLE}>
									<ActionsCell
										actions={[
											{
												icon: 'update',
												label: 'Tiempos',
												title: 'Actualizar tiempos',
												path: `${REFS_TIMES_PATH}/${reference.id}`,
											},
										]}
									/>
								</Match>
							</Switch>
						</TableRow>
					)}
				</For>
			</Table>
		</TableContainer>
	);
}

export default ReferenceTable;
