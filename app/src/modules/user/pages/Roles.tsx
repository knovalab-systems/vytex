import { A } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { AiOutlinePlus } from 'solid-icons/ai';
import { Match, Show, Switch, createMemo, createSignal } from 'solid-js';
import AllowPolicies from '~/components/AllowPolicies';
import ErrorMessage from '~/components/ErrorMessage';
import Loading from '~/components/Loading';
import { Button } from '~/components/ui/Button';
import {
	Pagination,
	PaginationEllipsis,
	PaginationItem,
	PaginationItems,
	PaginationNext,
	PaginationPrevious,
} from '~/components/ui/Pagination';
import { QUERY_LIMIT } from '~/constants/http';
import { ROLE_CREATE_PATH } from '~/constants/paths';
import { usePolicies } from '~/hooks/usePolicies';
import RoleTable from '../components/RoleTable';
import { type GetRolesType, countRolesQuery, getRolesQuery } from '../requests/roleGet';

function Roles() {
	return (
		<AllowPolicies policies={['ReadRoles']}>
			<RolesPage />
		</AllowPolicies>
	);
}

function RolesPage() {
	const { hasPolicy } = usePolicies();
	const [page, setPage] = createSignal(1);
	const roles = createQuery(() => getRolesQuery(page()));
	const rolesCount = createQuery(countRolesQuery);
	const pages = createMemo<number>(() => {
		const count = rolesCount.data?.at(0)?.count || 1;
		const safe = count === 0 ? 1 : count;
		return Math.ceil(safe / QUERY_LIMIT);
	});

	const isError = () => roles.isError || rolesCount.isError;
	const isLoading = () => roles.isLoading || rolesCount.isLoading;
	const isSuccess = () => roles.isSuccess && rolesCount.isSuccess;

	return (
		<div class='h-full flex flex-col gap-2'>
			<Switch>
				<Match when={isError()}>
					<ErrorMessage title='Error al cargar roles' />
				</Match>
				<Match when={isLoading()}>
					<Loading label='Cargando roles' />
				</Match>
				<Match when={isSuccess()}>
					<Show when={hasPolicy('CreateRoles')}>
						<div>
							<A href={ROLE_CREATE_PATH}>
								<Button variant='new'>
									Nuevo rol
									<AiOutlinePlus class='ml-2' size={22} />
								</Button>
							</A>
						</div>
					</Show>
					<RoleTable roles={roles.data as GetRolesType} />
					<Pagination
						class='[&>*]:justify-center'
						count={pages()}
						page={page()}
						onPageChange={setPage}
						itemComponent={props => <PaginationItem page={props.page}>{props.page}</PaginationItem>}
						ellipsisComponent={() => <PaginationEllipsis />}
					>
						<PaginationPrevious />
						<PaginationItems />
						<PaginationNext />
					</Pagination>
				</Match>
			</Switch>
		</div>
	);
}

export default Roles;
