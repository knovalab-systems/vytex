import { Route } from '@solidjs/router';
import { lazy } from 'solid-js';
import * as PATHS from '~/constants/paths';
import OrderStart from './pages/OrderStart';

const Orders = lazy(() => import('~/modules/order/pages/Orders'));

function OrderRoutes() {
	return (
		<Route path={PATHS.ORDERS_PATH}>
			<Route path={'/'} component={Orders} />
			<Route path={`${PATHS.ORDERS_START_RELATIVE_PATH}/:id`} component={OrderStart} />
		</Route>
	);
}

export default OrderRoutes;
