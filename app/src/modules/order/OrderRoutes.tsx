import { Route } from '@solidjs/router';
import { lazy } from 'solid-js';
import * as PATHS from '~/constants/paths';

const Orders = lazy(() => import('~/modules/order/pages/Orders'));

function OrderRoutes() {
	return (
		<Route path={PATHS.ORDERS_PATH}>
			<Route path={'/'} component={Orders} />
		</Route>
	);
}

export default OrderRoutes;
