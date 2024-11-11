import { useParams } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { Match, Switch } from 'solid-js';
import AllowPolicies from '~/components/AllowPolicies';
import ErrorMessage from '~/components/ErrorMessage';
import Loading from '~/components/Loading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/Tabs';
import { useSteps } from '~/hooks/useSteps';
import { useTaskControlStatus } from '~/hooks/useTaskControlStatus';
import OrderCard from '../components/OrderCard';
import OrderTask from '../components/OrderTasks';
import { type GetOrder, type GetTasksByOrder, getOrderQuery, getTasksByOrderQuery } from '../request/orderGet';

function Order() {
	return (
		<AllowPolicies policies={['ReadOrders']}>
			<OrderPage />
		</AllowPolicies>
	);
}

function OrderPage() {
	const params = useParams();
	const order = createQuery(() => getOrderQuery(Number(params.id)));
	const tasks = createQuery(() => getTasksByOrderQuery(Number(params.id)));
	const { stepsQuery } = useSteps();
	const { taskControlStatusQuery } = useTaskControlStatus();

	const isError = () => order.isError || tasks.isError || stepsQuery.isError || taskControlStatusQuery.isError;
	const isLoading = () =>
		order.isPending || tasks.isPending || stepsQuery.isPending || taskControlStatusQuery.isPending;
	const isSuccess = () =>
		order.isSuccess && tasks.isSuccess && stepsQuery.isSuccess && taskControlStatusQuery.isSuccess;

	return (
		<Tabs class='flex flex-col h-full'>
			<Switch>
				<Match when={isError()}>
					<ErrorMessage title='Error al cargar orden' />
				</Match>
				<Match when={isLoading()}>
					<Loading label='Cargando orden' />
				</Match>
				<Match when={isSuccess()}>
					<TabsList class='mr-auto sticky top-0'>
						<TabsTrigger value='orden'>Orden</TabsTrigger>
						<TabsTrigger value='tasks'>Tareas</TabsTrigger>
					</TabsList>
					<TabsContent class='flex-1 flex' value='orden'>
						<OrderCard order={order.data as GetOrder} />
					</TabsContent>
					<TabsContent class='flex-1 flex' value='tasks'>
						<OrderTask tasks={tasks.data as GetTasksByOrder} />
					</TabsContent>
				</Match>
			</Switch>
		</Tabs>
	);
}

export default Order;
