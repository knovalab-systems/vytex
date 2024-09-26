import { For, Show } from 'solid-js';
import ActionsCell from '~/components/ActionsCell';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '~/components/ui/Table';
import { ROLES_UPDATE_PATH } from '~/constants/paths';
import { usePolicies } from '~/hooks/usePolicies';
import type { Action } from '~/types/actionsCell';
import type { GetRolesType } from '../requests/roleGet';

function RoleTable(props: { roles: GetRolesType }) {
	const { hasPolicy } = usePolicies();

	const actions = (id: string, code: string | null) => {
		const arr: Action[] = [];
		if (hasPolicy('UpdateRoles') && !code)
			arr.push({
				path: `${ROLES_UPDATE_PATH}/${id}`,
				title: 'Actualizar rol',
				label: 'Actualizar',
				icon: 'update',
			});
		return arr;
	};

	return (
		<TableContainer>
			<Table class='table-auto font-medium'>
				<TableHeader class='sticky top-0 z-10'>
					<TableRow class='*:whitespace-nowrap'>
						<TableHead>Rol</TableHead>
						<TableHead>Nombre</TableHead>
						<TableHead>Origen</TableHead>
						<TableHead>Acciones</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<Show when={(props.roles?.length ?? 0) === 0}>
						<TableRow class='bg-white'>
							<TableCell colspan={4}>No se han encontrado roles.</TableCell>
						</TableRow>
					</Show>
					<For each={props.roles}>
						{role => (
							<TableRow class='bg-white *:w-1/6 group'>
								<TableCell>{role.id}</TableCell>
								<TableCell>{role.name}</TableCell>
								<TableCell>
									<Show when={role.code} fallback='Personalizado'>
										Sistema
									</Show>
								</TableCell>
								<ActionsCell actions={actions(role.id, role.code)} />
							</TableRow>
						)}
					</For>
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default RoleTable;
