import { createQuery } from '@tanstack/solid-query';
import { Match, Switch, createMemo, createSignal } from 'solid-js';
import AllowPolicies from '~/components/AllowPolicies';
import ErrorMessage from '~/components/ErrorMessage';
import Loading from '~/components/Loading';
import {
	Pagination,
	PaginationEllipsis,
	PaginationItem,
	PaginationItems,
	PaginationNext,
	PaginationPrevious,
} from '~/components/ui/Pagination';
import { useColors } from '~/hooks/useColors';
import { useSteps } from '~/hooks/useSteps';
import CorteTable from '../components/CorteTable';
import { type GetTaskType, countTasksQuery, getTaskControlsQuery } from '../request/taskControlGet';

function Corte() {
	return (
		<AllowPolicies policies={['ReadCorte']}>
			<CortePage />
		</AllowPolicies>
	);
}

function CortePage() {
	const [page, setPage] = createSignal(1);
	const { colorsQuery } = useColors();
	const { stepsQuery, getStepByValue } = useSteps();
	const tasksIds = createMemo(() => getStepByValue('corte')?.tasks?.map(e => e.id) || []);
	const taskControls = createQuery(() => getTaskControlsQuery(page(), tasksIds()));
	const counTaskControls = createQuery(() => countTasksQuery(tasksIds()));
	const pages = createMemo<number>(() => {
		const count = counTaskControls.data?.at(0)?.count || 1;
		const safe = count === 0 ? 1 : count;
		return Math.ceil(safe / 10);
	});

	const isError = () => taskControls.isError || counTaskControls.isError || stepsQuery.isError || colorsQuery.isError;
	const isLoading = () =>
		taskControls.isFetching || counTaskControls.isPending || stepsQuery.isPending || colorsQuery.isPending;
	const isSuccess = () =>
		taskControls.isSuccess && counTaskControls.isSuccess && stepsQuery.isSuccess && colorsQuery.isSuccess;

	return (
		<div class='h-full flex flex-col gap-2'>
			<Switch>
				<Match when={isError()}>
					<ErrorMessage title='Error al cargar tareas de corte' />
				</Match>
				<Match when={isLoading()}>
					<Loading label='Cargando tareas de corte' />
				</Match>
				<Match when={isSuccess()}>
					<CorteTable taskControls={taskControls.data as GetTaskType} />
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

export default Corte;
