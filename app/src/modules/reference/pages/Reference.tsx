import { useNavigate, useParams } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { Match, Switch } from 'solid-js';
import AllowPolicies from '~/components/AllowPolicies';
import ErrorMessage from '~/components/ErrorMessage';
import Loading from '~/components/Loading';
import { Button } from '~/components/ui/Button';
import { REFS_PATH } from '~/constants/paths';
import type { TimeByTask } from '~/types/core';
import ReferenceCard from '../components/ReferenceCard';
import { getReferenceProSupervisorQuery } from '../requests/referenceGet';

function Reference() {
	return (
		<AllowPolicies policies={['ReadReferences']}>
			<ReferenceProSupervisor />
		</AllowPolicies>
	);
}

function ReferenceProSupervisor() {
	const params = useParams();

	const reference = createQuery(() => getReferenceProSupervisorQuery(Number(params.id)));

	const navigate = useNavigate();
	const handleCancel = () => navigate(REFS_PATH);

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
					<div class='w-full md:w-4/6 xl:w-2/5'>
						<ReferenceCard times={reference.data?.time_by_task as TimeByTask} />
						<div class='flex m-4 justify-between'>
							<Button type='button' onclick={handleCancel} variant='secondary'>
								Volver
							</Button>
						</div>
					</div>
				</Match>
			</Switch>
		</div>
	);
}

export default Reference;
