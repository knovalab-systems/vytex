import { createQuery } from '@tanstack/solid-query';
import { Match, Switch } from 'solid-js';
import AllowPolicies from '~/components/AllowPolicies';
import ErrorMessage from '~/components/ErrorMessage';
import Loading from '~/components/Loading';
import { useColors } from '~/hooks/useColors';
import CustomCreateForm from '../components/CustomCreateForm';
import { type RefByCustomCreate, getRefByCustomCreateQuery } from '../requests/CustomCreate';

function CustomCreate() {
	return (
		<AllowPolicies policies={['CreateCustoms']}>
			<CustomCreatePage />
		</AllowPolicies>
	);
}

function CustomCreatePage() {
	const { colorsQuery } = useColors();
	const references = createQuery(() => getRefByCustomCreateQuery());

	const isLoading = () => colorsQuery.isLoading || references.isLoading;

	const isSuccess = () => colorsQuery.isSuccess && references.isSuccess;

	return (
		<div class='flex items-center justify-center h-full'>
			<Switch>
				<Match when={references.isError}>
					<ErrorMessage title='Error al cargar referencias' />
				</Match>
				<Match when={isLoading()}>
					<Loading label='Cargando datos' />
				</Match>
				<Match when={isSuccess()}>
					<CustomCreateForm references={references.data as RefByCustomCreate} />
				</Match>
			</Switch>
		</div>
	);
}

export default CustomCreate;
