import { Route } from '@solidjs/router';
import { lazy } from 'solid-js';
import * as PATHS from '~/constants/paths';

const Customs = lazy(() => import('~/modules/custom/pages/Customs'));
const Custom = lazy(() => import('~/modules/custom/pages/Custom'));
const CustomCreate = lazy(() => import('~/modules/custom/pages/CustomCreate'));

function CustomRoutes() {
	return (
		<Route path={PATHS.CUSTOMS_PATH}>
			<Route path={'/'} component={Customs} />
			<Route path={'/:id'} component={Custom} />
			<Route path={PATHS.CREATE_PATH} component={CustomCreate} />
		</Route>
	);
}

export default CustomRoutes;
