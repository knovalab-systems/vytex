import { useParams } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { Match, Switch } from 'solid-js';
import AllowPolicies from '~/components/AllowPolicies';
import ErrorMessage from '~/components/ErrorMessage';
import Loading from '~/components/Loading';
import SupplireUpdateForm from '../components/SupplierUpdateForm';
import { getSupplierQuery } from '../requests/supplierGet';

function SupplierUpdate() {
	return (
		<AllowPolicies policies={['UpdateSuppliers']}>
			<SupplierUpdatePage />
		</AllowPolicies>
	);
}

function SupplierUpdatePage() {
	const params = useParams();
	const supplier = createQuery(() => getSupplierQuery(Number(params.id)));

	return (
		<div class='flex items-center justify-center h-full'>
			<Switch>
				<Match when={supplier.isError}>
					<ErrorMessage title='Error al cargar proveedor' />
				</Match>
				<Match when={supplier.isPending || supplier.isRefetching}>
					<Loading label='Cargando proveedor' />
				</Match>
				<Match when={supplier.isSuccess}>
					<SupplireUpdateForm supplier={supplier.data} />
				</Match>
			</Switch>
		</div>
	);
}

export default SupplierUpdate;
