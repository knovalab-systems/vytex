import { Route } from '@solidjs/router';
import { lazy } from 'solid-js';
import { MatchAdmin } from '~/components/MatchRole';
import * as PATHS from '~/constants/paths';

const User = lazy(() => import('~/modules/user/pages/User'));
const Users = lazy(() => import('~/modules/user/pages/Users'));
const UserCreate = lazy(() => import('~/modules/user/pages/UserCreate'));
const UserUpdate = lazy(() => import('~/modules/user/pages/UserUpdate'));
const Roles = lazy(() => import('~/modules/user/pages/Roles'));
const Suppliers = lazy(() => import('~/modules/supplier/pages/Suppliers'));
const SupplierCreate = lazy(() => import('~/modules/supplier/pages/SupplierCreate'));
const SupplierUpdate = lazy(() => import('~/modules/supplier/pages/SupplierUpdate'));
const Customs = lazy(() => import('~/modules/custom/pages/Customs'));
const CustomCreate = lazy(() => import('~/modules/custom/pages/CustomCreate'));
const Orders = lazy(() => import('~/modules/order/pages/Orders'));
const OrderCreate = lazy(() => import('~/modules/order/pages/OrderCreate'));

function AdminRoutes() {
	return (
		<Route path={'/'} component={MatchAdmin}>
			<Route path={PATHS.USERS_PATH}>
				<Route path={'/'} component={Users} />
				<Route path={'/:id'} component={User} />
				<Route path={PATHS.CREATE_PATH} component={UserCreate} />
				<Route path={`${PATHS.UPDATE_PATH}/:id`} component={UserUpdate} />
			</Route>
			<Route path={PATHS.SUPPLIERS_PATH}>
				<Route path={'/'} component={Suppliers} />
				<Route path={PATHS.CREATE_PATH} component={SupplierCreate} />
				<Route path={`${PATHS.UPDATE_PATH}/:id`} component={SupplierUpdate} />
			</Route>
			<Route path={PATHS.CUSTOMS_PATH}>
				<Route path={'/'} component={Customs} />
				<Route path={PATHS.CREATE_PATH} component={CustomCreate} />
				<Route path={`${PATHS.ORDERS_CREATE_PATH}/:id`} component={OrderCreate} />
			</Route>
			<Route path={PATHS.ORDERS_PATH} >
				<Route path={'/'} component={Orders} />
			</Route>
			<Route path={PATHS.ROLES_PATH} component={Roles} />
		</Route>
	);
}

export default AdminRoutes;