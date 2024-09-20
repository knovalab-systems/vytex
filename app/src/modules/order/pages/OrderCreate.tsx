import { useParams } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { Match, Switch } from 'solid-js';
import AllowPolicies from '~/components/AllowPolicies';
import ErrorMessage from '~/components/ErrorMessage';
import Loading from '~/components/Loading';
import { useColors } from '~/hooks/useColors';
import { getCustomQuery } from '~/modules/custom/requests/CustomGet';
import OrderCreateForm from '../components/OrderCreateForm';
import { type RefByOrderCreate, getRefByOrderCreateQuery } from '../request/orderCreate';

function OrderCreate() {
	return (
		<AllowPolicies policies={['CreateOrders']}>
			<OrderCreatePage />
		</AllowPolicies>
	);
}

function OrderCreatePage() {
	const params = useParams();
	const custom = createQuery(() => getCustomQuery(Number(params.id)));

	const { colorsQuery } = useColors();
	const references = createQuery(() => getRefByOrderCreateQuery());

	const isLoading = () => colorsQuery.isLoading || references.isLoading || custom.isLoading;

	const isSuccess = () => colorsQuery.isSuccess && references.isSuccess && custom.isSuccess;

	return (
		<div class='flex items-center justify-center h-full'>
			<Switch>
				<Match when={custom.isError}>
					<ErrorMessage title='Error al cargar pedido' />
				</Match>
				<Match when={isLoading()}>
					<Loading label='Cargando datos' />
				</Match>
				<Match when={isSuccess()}>
					<OrderCreateForm references={references.data as RefByOrderCreate} custom={custom.data} />
				</Match>
			</Switch>
		</div>
	);
}

export default OrderCreate;
