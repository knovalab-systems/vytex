import { useParams } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { Match, Switch } from 'solid-js';
import AllowPolicies from '~/components/AllowPolicies';
import ErrorMessage from '~/components/ErrorMessage';
import Loading from '~/components/Loading';
import { useColors } from '~/hooks/useColors';
import { useOrderStatus } from '~/hooks/useOrderStatus';
import OrderStartCard from '../components/OrderStartCard';
import { type GetOrderStart, getOrderStartQuery } from '../request/OrderGet';

function OrderStart() {
	return (
		<AllowPolicies policies={['StartOrder']}>
			<OrderStartPage />
		</AllowPolicies>
	);
}

function OrderStartPage() {
	const params = useParams();
	const order = createQuery(() => getOrderStartQuery(Number(params.id)));
	const { colorsQuery } = useColors();
	const { orderStatusQuery } = useOrderStatus();

	const isLoading = () => order.isFetching || colorsQuery.isPending || orderStatusQuery.isPending;
	const isError = () => order.isError || colorsQuery.isError || orderStatusQuery.isError;
	const isSuccess = () => order.isSuccess && colorsQuery.isSuccess && orderStatusQuery.isSuccess;

	return (
		<div class='flex items-center justify-center h-full'>
			<Switch>
				<Match when={isError()}>
					<ErrorMessage title='Error al cargar orden' />
				</Match>
				<Match when={isLoading()}>
					<Loading label='Cargando orden' />
				</Match>
				<Match when={isSuccess()}>
					<OrderStartCard order={order.data as GetOrderStart} />
				</Match>
			</Switch>
		</div>
	);
}

export default OrderStart;
