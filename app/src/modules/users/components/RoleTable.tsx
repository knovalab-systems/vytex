import { For, Match, Switch } from 'solid-js';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '~/components/ui/Table';
import type { RoleItems } from '~/utils/roles';

function RoleTable(props: {
	roles: RoleItems[];
	permissions: Record<'key' | 'value', string>[];
	rolePermmissions: Record<string, Record<string, string | boolean>>;
}) {
	return (
		<TableContainer>
			<Table class='table-auto font-medium'>
				<TableHeader class='sticky top-0 z-10'>
					<TableRow class=' bg-trailway *:text-white hover:bg-trailway/90'>
						<TableHead>Función</TableHead>
						<For each={props.roles}>{role => <TableHead>{role.name}</TableHead>}</For>
					</TableRow>
				</TableHeader>
				<TableBody>
					<For each={props.permissions}>
						{permission => (
							<TableRow class='bg-white *:w-1/6 group'>
								<TableCell>{permission.value}</TableCell>
								<For each={props.roles}>
									{role => (
										<Switch
											fallback={
												<TableCell>
													<div class='inline-flex items-center px-3 py-1 rounded-full text-red-500 gap-x-2 bg-red-100/60'>
														No
													</div>
												</TableCell>
											}
										>
											<Match when={typeof props.rolePermmissions[role.role][permission.key] === 'string'}>
												<TableCell>
													<div class='inline-flex items-center px-3 py-1 rounded-full text-emerald-500 gap-x- bg-emerald-100/60'>
														{props.rolePermmissions[role.role][permission.key]}
													</div>
												</TableCell>
											</Match>
											<Match when={!!props.rolePermmissions[role.role][permission.key]}>
												<TableCell>
													<div class='inline-flex items-center px-3 py-1 rounded-full text-emerald-500 gap-x- bg-emerald-100/60'>
														Sí
													</div>
												</TableCell>
											</Match>
										</Switch>
									)}
								</For>
							</TableRow>
						)}
					</For>
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default RoleTable;
