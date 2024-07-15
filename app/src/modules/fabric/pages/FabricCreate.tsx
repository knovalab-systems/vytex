import { Match, Switch } from 'solid-js';
import Loading from '~/components/Loading';
import { type Colors, useColors } from '~/hooks/useColors';
import { type Suppliers, useSuppliers } from '~/hooks/useSuppliers';
import FabricCreateForm from '../components/FabricCreateForm';

function FabricCreate() {
	const { colorsQuery } = useColors();
	const { suppliersQuery } = useSuppliers();

	const isLoading = () => suppliersQuery.isLoading || colorsQuery.isLoading;

	const isSuccess = () => suppliersQuery.isSuccess && colorsQuery.isSuccess;

	return (
		<div class='flex items-center justify-center h-full'>
			<Switch>
				<Match when={isLoading()}>
					<Loading label='Cargando datos' />
				</Match>
				<Match when={isSuccess()}>
					<FabricCreateForm colors={colorsQuery.data as Colors} suppliers={suppliersQuery.data as Suppliers} />
				</Match>
			</Switch>
		</div>
	);
}

export default FabricCreate;
