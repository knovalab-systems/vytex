import { Route } from '@solidjs/router';
import { lazy } from 'solid-js';
import * as PATHS from '~/constants/paths';

const Fabrics = lazy(() => import('~/modules/fabric/pages/Fabrics'));
const FabricCreate = lazy(() => import('~/modules/fabric/pages/FabricCreate'));

function FabricRoutes() {
	return (
		<Route path={PATHS.FABRICS_PATH}>
			<Route path={'/'} component={Fabrics} />
			<Route path={PATHS.CREATE_PATH} component={FabricCreate} />
		</Route>
	);
}

export default FabricRoutes;
