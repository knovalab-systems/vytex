import { Route } from '@solidjs/router';
import { lazy } from 'solid-js';
import * as PATHS from '~/constants/paths';

const Order = lazy(() => import('~/modules/order/pages/Order'));
const Orders = lazy(() => import('~/modules/order/pages/Orders'));
const OrderStart = lazy(() => import('~/modules/order/pages/OrderStart'));
const OrderCreate = lazy(() => import('~/modules/order/pages/OrderCreate'));

function OrderRoutes() {
	return (
		<Route path={PATHS.ORDERS_PATH}>
			<Route path={'/'} component={Orders} />
			<Route path={'/:id'} component={Order} />
			<Route path={`${PATHS.ORDERS_START_RELATIVE_PATH}/:id`} component={OrderStart} />
			<Route path={`${PATHS.CREATE_PATH}/:id`} component={OrderCreate} />
		</Route>
	);
}

export default OrderRoutes;
