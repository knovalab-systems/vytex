import { Route } from '@solidjs/router';
import { lazy } from 'solid-js';
import * as PATHS from '~/constants/paths';

const MatchDesigner = lazy(() => import('~/modules/auth/components/MatchDesigner'));
const ReferenceCreate = lazy(() => import('~/modules/reference/pages/ReferenceCreate'));
const Colors = lazy(() => import('~/modules/color/pages/Colors'));
const ColorCreate = lazy(() => import('~/modules/color/pages/ColorCreate'));
const Fabrics = lazy(() => import('~/modules/fabric/pages/Fabrics'));
const Resources = lazy(() => import('~/modules/resource/pages/Resources'));

function DesignerRoutes() {
	return (
		<Route path='/' component={MatchDesigner}>
			<Route path={PATHS.REFS_PATH}>
				<Route path={'/'} component={() => <div>1</div>} />
				<Route path={PATHS.CREATE_PATH} component={ReferenceCreate} />
			</Route>
			<Route path={PATHS.COLORS_PATH}>
				<Route path={'/'} component={Colors} />
				<Route path={PATHS.CREATE_PATH} component={ColorCreate} />
			</Route>
			<Route path={PATHS.FABRICS_PATH}>
				<Route path={'/'} component={Fabrics} />
			</Route>
			<Route path={PATHS.RESOURCES_PATH}>
				<Route path={'/'} component={Resources} />
			</Route>
		</Route>
	);
}

export default DesignerRoutes;
