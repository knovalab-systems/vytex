import { createQueries } from '@tanstack/solid-query';
import { Match, Switch } from 'solid-js';
import Loading from '~/components/Loading';
import { type colorsArray, useColors } from '~/hooks/useColors';
import ReferenceCreateForm from '../components/ReferenceCreateForm';
import {
	type FabricsByRefCreate,
	type ResourcesByRefCreate,
	getFabricsByRefCreateQuery,
	getResourcesByRefCreateQuery,
} from '../requests/referenceCreateRequest';

function ReferenceCreate() {
	const { colorsArray } = useColors();
	const data = createQueries(() => ({
		queries: [getFabricsByRefCreateQuery(), getResourcesByRefCreateQuery()],
	}));

	const isLoading = () => data.some(q => q.isLoading) || colorsArray.isLoading;

	const isSuccess = () => data.every(q => q.isSuccess) && colorsArray.isSuccess;

	return (
		<div class='flex items-center justify-center h-full'>
			<Switch>
				<Match when={isLoading()}>
					<Loading label='Cargando datos' />
				</Match>
				<Match when={isSuccess()}>
					<ReferenceCreateForm
						colors={colorsArray.data as colorsArray}
						fabrics={data[0].data as FabricsByRefCreate}
						resources={data[1].data as ResourcesByRefCreate}
					/>
				</Match>
			</Switch>
		</div>
	);
}

export default ReferenceCreate;
