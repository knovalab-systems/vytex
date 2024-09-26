import { useParams } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { Match, Switch } from 'solid-js';
import AllowPolicies from '~/components/AllowPolicies';
import ErrorMessage from '~/components/ErrorMessage';
import Loading from '~/components/Loading';
import { useColors } from '~/hooks/useColors';
import { useSuppliers } from '~/hooks/useSuppliers';
import ResourceUpdateForm from '../components/ResourceUpdateForm';
import { getResourceQuery } from '../requests/resourceGet';

function ResourceUpdate() {
	return (
		<AllowPolicies policies={['UpdateResources']}>
			<ResourceUpdatePage />
		</AllowPolicies>
	);
}

function ResourceUpdatePage() {
	const params = useParams();
	const resource = createQuery(() => getResourceQuery(Number(params.id)));

	const { colorsQuery } = useColors();
	const { suppliersQuery } = useSuppliers();

	const isLoading = () => suppliersQuery.isLoading || colorsQuery.isLoading || resource.isLoading;
	const isError = () => suppliersQuery.isError || colorsQuery.isError || resource.isError;
	const isSuccess = () => suppliersQuery.isSuccess && colorsQuery.isSuccess && resource.isSuccess;

	return (
		<div class='flex items-center justify-center h-full'>
			<Switch>
				<Match when={isError()}>
					<ErrorMessage title='Error al cargar insumo' />
				</Match>
				<Match when={isLoading()}>
					<Loading label='Cargando datos' />
				</Match>
				<Match when={isSuccess()}>
					<ResourceUpdateForm resource={resource.data} />
				</Match>
			</Switch>
		</div>
	);
}

export default ResourceUpdate;
