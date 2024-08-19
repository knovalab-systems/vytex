import { useParams } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { Match, Switch } from 'solid-js';
import AllowRoles from '~/components/AllowRoles';
import Loading from '~/components/Loading';
import { type Colors, useColors } from '~/hooks/useColors';
import { type Suppliers, useSuppliers } from '~/hooks/useSuppliers';
import FabricUpdateForm from '../components/FabricUpdateForm';
import { getFabricQuery } from '../requests/fabricGet';

function FabricUpdate() {
	return (
		<AllowRoles roles={['designer']}>
			<FabricUpdatePage />
		</AllowRoles>
	);
}

function FabricUpdatePage() {
	const params = useParams();
	const fabric = createQuery(() => getFabricQuery(Number(params.id)));

	const { colorsQuery } = useColors();
	const { suppliersQuery } = useSuppliers();

	const isLoading = () => suppliersQuery.isLoading || colorsQuery.isLoading || fabric.isLoading;

	const isSuccess = () => suppliersQuery.isSuccess && colorsQuery.isSuccess && fabric.isSuccess;

	return (
		<div class='flex items-center justify-center h-full'>
			<Switch>
				<Match when={isLoading()}>
					<Loading label='Cargando datos' />
				</Match>
				<Match when={isSuccess()}>
					<FabricUpdateForm
						colors={colorsQuery.data as Colors}
						suppliers={suppliersQuery.data as Suppliers}
						fabric={fabric.data}
					/>
				</Match>
			</Switch>
		</div>
	);
}

export default FabricUpdate;
