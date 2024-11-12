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
import { useTaskControlStatus } from '~/hooks/useTaskControlStatus';
import type { TaskControlFilter } from '~/types/filter';
import TaskControlFilters from '../components/TaskControlFilters';
import TaskControlTable from '../components/TaskControlTable';
import { type GetTaskType, countTasksQuery, getTaskControlsQuery } from '../request/taskControlGet';

function Confeccion() {
	return (
		<AllowPolicies policies={['ReadConfeccion']}>
			<ConfeccionPage />
		</AllowPolicies>
	);
}

function ConfeccionPage() {
	const [filters, setFilters] = createSignal<TaskControlFilter>({});
	const [page, setPage] = createSignal(1);
	const { colorsQuery } = useColors();
	const { taskControlStatusQuery } = useTaskControlStatus();
	const { stepsQuery, getStepByValue } = useSteps();
	const step = () => getStepByValue('confeccion');
	const tasksIds = () => step()?.tasks.map(e => e.id) ?? [];
	const taskControls = createQuery(() => getTaskControlsQuery(page(), tasksIds(), filters()));
	const counTaskControls = createQuery(() => countTasksQuery(tasksIds(), filters()));
	const pages = createMemo<number>(() => {
		const count = counTaskControls.data?.at(0)?.count || 1;
		const safe = count === 0 ? 1 : count;
		return Math.ceil(safe / 10);
	});

	const isError = () =>
		taskControls.isError ||
		counTaskControls.isError ||
		stepsQuery.isError ||
		colorsQuery.isError ||
		taskControlStatusQuery.isError;
	const isLoading = () =>
		taskControls.isFetching ||
		counTaskControls.isPending ||
		stepsQuery.isPending ||
		colorsQuery.isPending ||
		taskControlStatusQuery.isPending;
	const isSuccess = () =>
		taskControls.isSuccess &&
		counTaskControls.isSuccess &&
		stepsQuery.isSuccess &&
		colorsQuery.isSuccess &&
		taskControlStatusQuery.isSuccess;

	return (
		<div class='h-full flex flex-col gap-2'>
			<Switch>
				<Match when={isError()}>
					<ErrorMessage title='Error al cargar tareas de confección' />
				</Match>
				<Match when={isLoading()}>
					<Loading label='Cargando tareas de confección' />
				</Match>
				<Match when={isSuccess()}>
					<div>
						<TaskControlFilters filters={filters()} setFilters={setFilters} tasks={step()?.tasks || []} />
					</div>
					<TaskControlTable taskControls={taskControls.data as GetTaskType} />
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

export default Confeccion;
