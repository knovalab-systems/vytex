import { createQuery } from '@tanstack/solid-query';
import { Match, Switch } from 'solid-js';
import ErrorMessage from '~/components/ErrorMessage';
import Loading from '~/components/Loading';
import { useRoles } from '~/hooks/useRoles';
import { countRoleByCodeQuery, countUsersByRoleIdQuery, countUsersByStateQuery } from '../requests/adminHome';

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
		<div class='h-full w-full flex flex-col gap-2'>
			<Switch>
				<Match when={isError()}>
					<ErrorMessage title='Error al cargar información de usuarios y roles' />
				</Match>
				<Match when={isLoading()}>
					<Loading label='Cargando información de usuarios y roles' />
				</Match>
				<Match when={isSuccess()}>
					<div class='flex justify-between'>1</div>
				</Match>
			</Switch>
		</div>
	);
}

export default AdminHome;
