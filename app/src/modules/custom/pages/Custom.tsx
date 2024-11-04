import { useParams } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { Match, Switch } from 'solid-js';
import AllowPolicies from '~/components/AllowPolicies';
import ErrorMessage from '~/components/ErrorMessage';
import Loading from '~/components/Loading';
import { useOrderStatus } from '~/hooks/useOrderStatus';
import CustomCard from '../components/CustomCard';
import { type GetCustomType, getCustomQuery } from '../requests/CustomGet';

function Custom() {
	return (
		<AllowPolicies policies={['ReadCustoms']}>
			<CustomPage />
		</AllowPolicies>
	);
}

function CustomPage() {
	const params = useParams();
	const custom = createQuery(() => getCustomQuery(Number(params.id)));
	const { orderStatusQuery } = useOrderStatus();

	const isError = () => custom.isError || orderStatusQuery.isError;
	const isLoading = () => custom.isLoading || orderStatusQuery.isPending;
	const isSuccess = () => custom.isSuccess && orderStatusQuery.isSuccess;
	return (
		<div class='flex items-center justify-center h-full'>
			<Switch>
				<Match when={isError()}>
					<ErrorMessage title='Error al cargar pedido' />
				</Match>
				<Match when={isLoading()}>
					<Loading label='Cargando datos' />
				</Match>
				<Match when={isSuccess()}>
					<CustomCard custom={custom.data as GetCustomType} />
				</Match>
			</Switch>
		</div>
	);
}

export default Custom;
