import { Route } from '@solidjs/router';
import { lazy } from 'solid-js';
import * as PATHS from '~/constants/paths';

const Suppliers = lazy(() => import('~/modules/supplier/pages/Suppliers'));
const SupplierCreate = lazy(() => import('~/modules/supplier/pages/SupplierCreate'));
const SupplierUpdate = lazy(() => import('~/modules/supplier/pages/SupplierUpdate'));

function SupplierRoutes() {
	return (
		<Route path={PATHS.SUPPLIERS_PATH}>
			<Route path={'/'} component={Suppliers} />
			<Route path={PATHS.CREATE_PATH} component={SupplierCreate} />
			<Route path={`${PATHS.UPDATE_PATH}/:id`} component={SupplierUpdate} />
		</Route>
	);
}

export default SupplierRoutes;
