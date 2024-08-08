import { createQueries } from '@tanstack/solid-query';
import { Match, Switch } from 'solid-js';
import AllowRoles from '~/components/AllowRoles';
import Loading from '~/components/Loading';
import { type Colors, useColors } from '~/hooks/useColors';
import ReferenceCreateForm from '../components/ReferenceCreateForm';
import {
	type FabricsByRefCreate,
	type ResourcesByRefCreate,
	getFabricsByRefCreateQuery,
	getResourcesByRefCreateQuery,
} from '../requests/referenceCreate';

function ReferenceCreate() {
	return (
		<AllowRoles roles={['designer']}>
			<ReferenceCreatePage />
		</AllowRoles>
	);
}

function ReferenceCreatePage() {
	const { colorsQuery: colorsArray } = useColors();
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
						colors={colorsArray.data as Colors}
						fabrics={data[0].data as FabricsByRefCreate}
						resources={data[1].data as ResourcesByRefCreate}
					/>
				</Match>
			</Switch>
		</div>
	);
}

export default ReferenceCreate;
