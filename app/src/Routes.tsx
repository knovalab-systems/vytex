import { Route } from '@solidjs/router';
import { lazy } from 'solid-js';
import NavWrapper from '~/components/NavWrapper';
import ProtectedWrapper from '~/components/ProtectedWrapper';
import * as PATHS from '~/constants/paths';
import ColorRoutes from './modules/color/ColorRoutes';
import CustomRoutes from './modules/custom/CustomRoutes';
import FabricRoutes from './modules/fabric/FabricRoutes';
import OrderRoutes from './modules/order/OrderRoutes';
import ReferenceRoutes from './modules/reference/ReferenceRoutes';
import ResourceRoutes from './modules/resource/ResourceRoutes';
import SupplierRoutes from './modules/supplier/SupplierRoutes';
import TaskControlRoutes from './modules/taskControl/TaskControlRoutes';
import UserRoutes from './modules/user/UserRoutes';

const Login = lazy(() => import('~/pages/Login'));
const NotFound = lazy(() => import('~/pages/NotFound'));
const Home = lazy(() => import('~/pages/Home'));

function Routes() {
	return (
		<>
			<Route path={'/'} component={ProtectedWrapper}>
				<Route path={'/'} component={NavWrapper}>
					<Route path={'/'} component={Home} />
					<ColorRoutes />
					<CustomRoutes />
					<FabricRoutes />
					<OrderRoutes />
					<ReferenceRoutes />
					<ResourceRoutes />
					<SupplierRoutes />
					<TaskControlRoutes />
					<UserRoutes />
				</Route>
			</Route>
			<Route path={PATHS.LOGIN_PATH} component={Login} />
			<Route path='*404' component={NotFound} />
		</>
	);
}

export default Routes;
