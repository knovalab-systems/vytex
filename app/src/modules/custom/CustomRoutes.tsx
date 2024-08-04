import { Route } from '@solidjs/router';
import { lazy } from 'solid-js';
import * as PATHS from '~/constants/paths';

const Customs = lazy(() => import('~/modules/custom/pages/Customs'));
const CustomCreate = lazy(() => import('~/modules/custom/pages/CustomCreate'));
const OrderCreate = lazy(() => import('~/modules/order/pages/OrderCreate'));

function CustomRoutes() {
	return (
		<Route path={PATHS.CUSTOMS_PATH}>
			<Route path={'/'} component={Customs} />
			<Route path={PATHS.CREATE_PATH} component={CustomCreate} />
			<Route path={`${PATHS.ORDERS_CREATE_PATH}/:id`} component={OrderCreate} />
		</Route>
	);
}

export default CustomRoutes;
