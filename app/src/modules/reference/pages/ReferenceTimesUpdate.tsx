import { useParams } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { Match, Switch } from 'solid-js';
import AllowPolicies from '~/components/AllowPolicies';
import ErrorMessage from '~/components/ErrorMessage';
import Loading from '~/components/Loading';
import ReferenceTimesUpdateForm from '../components/ReferenceTimesUpdateForm';
import { type GetReferenceForTimesType, getReferenceForTimesQuery } from '../requests/referenceGet';

function ReferenceTimesUpdate() {
	return (
		<AllowPolicies policies={['ReadReferences']}>
			<ReferenceTimesUpdatePage />
		</AllowPolicies>
	);
}

function ReferenceTimesUpdatePage() {
	const params = useParams();

	const reference = createQuery(() => getReferenceForTimesQuery(Number(params.id)));

	return (
		<div class='flex items-center justify-center h-full'>
			<Switch>
				<Match when={reference.isError}>
					<ErrorMessage title='Error al cargar tiempos' />
				</Match>
				<Match when={reference.isFetching}>
					<Loading label='Cargando tiempos' />
				</Match>
				<Match when={reference.isError}>Error</Match>
				<Match when={reference.isSuccess}>
					<ReferenceTimesUpdateForm reference={reference.data as GetReferenceForTimesType} />
				</Match>
			</Switch>
		</div>
	);
}

export default ReferenceTimesUpdate;
