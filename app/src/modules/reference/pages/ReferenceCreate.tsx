import { createQueries } from '@tanstack/solid-query';
import { Match, Switch } from 'solid-js';
import AllowRoles from '~/components/AllowRoles';
import ErrorMessage from '~/components/ErrorMessage';
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
	const { colorsQuery } = useColors();
	const data = createQueries(() => ({
		queries: [getFabricsByRefCreateQuery(), getResourcesByRefCreateQuery()],
	}));

	const isLoading = () => data.some(q => q.isLoading) || colorsQuery.isLoading;
	const isError = () => data.some(q => q.isError) || colorsQuery.isError;
	const isSuccess = () => data.every(q => q.isSuccess) && colorsQuery.isSuccess;

	return (
		<div class='flex items-center justify-center h-full'>
			<Switch>
				<Match when={isError()}>
					<ErrorMessage title='Error al cargar datos' />
				</Match>
				<Match when={isLoading()}>
					<Loading label='Cargando datos' />
				</Match>
				<Match when={isSuccess()}>
					<ReferenceCreateForm
						colors={colorsQuery.data as Colors}
						fabrics={data[0].data as FabricsByRefCreate}
						resources={data[1].data as ResourcesByRefCreate}
					/>
				</Match>
			</Switch>
		</div>
	);
}

export default ReferenceCreate;
