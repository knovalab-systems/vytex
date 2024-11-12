import { createQuery } from '@tanstack/solid-query';
import { Match, Switch } from 'solid-js';
import ErrorMessage from '~/components/ErrorMessage';
import Loading from '~/components/Loading';
import { useRoles } from '~/hooks/useRoles';
import RolesByCode from '../components/RolesByCode';
import UsersByRole from '../components/UsersByRole';
import UsersByState from '../components/UsersByState';
import {
	type CountRoleByCodeType,
	type CountUsersByRoleIdType,
	type CountUsersByStateType,
	countRoleByCodeQuery,
	countUsersByRoleIdQuery,
	countUsersByStateQuery,
} from '../requests/adminHome';

function AdminHome() {
	const { rolesQuery } = useRoles();

	const usersByState = createQuery(countUsersByStateQuery);
	const usersByRole = createQuery(countUsersByRoleIdQuery);
	const rolesByCode = createQuery(countRoleByCodeQuery);

	const isLoading = () =>
		rolesQuery.isLoading || usersByState.isLoading || usersByRole.isLoading || rolesByCode.isLoading;
	const isError = () => rolesQuery.isError || usersByState.isError || usersByRole.isError || rolesByCode.isError;
	const isSuccess = () =>
		rolesQuery.isSuccess && usersByState.isSuccess && usersByRole.isSuccess && rolesByCode.isSuccess;

	return (
		<div class='h-full w-full'>
			<Switch>
				<Match when={isError()}>
					<ErrorMessage title='Error al cargar información de usuarios y roles' />
				</Match>
				<Match when={isLoading()}>
					<Loading label='Cargando información de usuarios y roles' />
				</Match>
				<Match when={isSuccess()}>
					<div class='h-full w-full flex flex-col md:grid md:grid-cols-2 gap-2'>
						<UsersByState data={usersByState.data as CountUsersByStateType} />
						<RolesByCode data={rolesByCode.data as CountRoleByCodeType} />
						<div class='col-span-2'>
							<UsersByRole data={usersByRole.data as CountUsersByRoleIdType} />
						</div>
					</div>
				</Match>
			</Switch>
		</div>
	);
}

export default AdminHome;
