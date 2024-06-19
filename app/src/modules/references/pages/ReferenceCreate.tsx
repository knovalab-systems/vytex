import { createQueries } from '@tanstack/solid-query';
import { Match, Switch } from 'solid-js';
import Loading from '~/components/Loading';
import ReferenceCreateForm from '../components/ReferenceCreateForm';
import {
	type colorsByRefCreate,
	getColorsByRefCreateQuery,
	getFabricsByRefCreateQuery,
	getResourcesByRefCreateQuery,
} from '../request/ReferenceCreateRequest';

function ReferenceCreate() {
	const data = createQueries(() => ({
		queries: [getColorsByRefCreateQuery(), getFabricsByRefCreateQuery(), getResourcesByRefCreateQuery()],
	}));

	const isLoading = () => data.some(q => q.isLoading);

	const isSuccess = () => data.some(q => q.isSuccess);

	return (
		<div class='flex items-center justify-center h-full'>
			<Switch>
				<Match when={isLoading()}>
					<Loading label='Cargando datos' />
				</Match>
				<Match when={isSuccess()}>
					<ReferenceCreateForm colors={data[0].data as colorsByRefCreate} />
				</Match>
			</Switch>
		</div>
	);
}

export default ReferenceCreate;
