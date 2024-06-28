import { createQuery } from '@tanstack/solid-query';
import { Match, Switch, createMemo, createSignal } from 'solid-js';
import { countResourcesQuery, getResourcesQuery } from '../requests/resourcesGetRequests';
import { QUERY_LIMIT } from '~/utils/constants';
import Loading from '~/components/Loading';

import ResourceTable from '../components/ResourceTable';

function Resources() {
	const [page, setPage] = createSignal(1);
	const resources = createQuery(() => getResourcesQuery(page()));
	const countResources = createQuery(() => countResourcesQuery());
	const pages = createMemo<number>(() => {
		const count = countResources.data?.at(0)?.count || 1;
		const safe = count === 0 ? 1 : count;
		return Math.ceil(safe / QUERY_LIMIT);
	});

	return (
		<div class='h-full flex flex-col'>
			<Switch>
				<Match when={resources.isLoading || countResources.isLoading}>
					<Loading label='Cargando insumos' />
				</Match>
				<Match when={resources.isSuccess && countResources.isSuccess}>
					<ResourceTable />
				</Match>
			</Switch>
		</div>
	);
}

export default Resources;
