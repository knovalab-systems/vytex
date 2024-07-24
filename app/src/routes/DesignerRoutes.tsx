import { Route } from '@solidjs/router';
import { lazy } from 'solid-js';
import { MatchDesigner } from '~/components/MatchRole';
import * as PATHS from '~/constants/paths';

const ReferenceCreate = lazy(() => import('~/modules/reference/pages/ReferenceCreate'));
const Colors = lazy(() => import('~/modules/color/pages/Colors'));
const ColorCreate = lazy(() => import('~/modules/color/pages/ColorCreate'));
const ColorUpdate = lazy(() => import('~/modules/color/pages/ColorUpdate'));
const Fabrics = lazy(() => import('~/modules/fabric/pages/Fabrics'));
const FabricCreate = lazy(() => import('~/modules/fabric/pages/FabricCreate'));
const References = lazy(() => import('~/modules/reference/pages/References'));
const Resources = lazy(() => import('~/modules/resource/pages/Resources'));
const ResourceCreate = lazy(() => import('~/modules/resource/pages/ResourceCreate'));

function DesignerRoutes() {
	return (
		<Route path='/' component={MatchDesigner}>
			<Route path={PATHS.REFS_PATH}>
				<Route path={'/'} component={References} />
				<Route path={PATHS.CREATE_PATH} component={ReferenceCreate} />
			</Route>
			<Route path={PATHS.COLORS_PATH}>
				<Route path={'/'} component={Colors} />
				<Route path={PATHS.CREATE_PATH} component={ColorCreate} />
				<Route path={`${PATHS.UPDATE_PATH}/:id`} component={ColorUpdate} />
			</Route>
			<Route path={PATHS.FABRICS_PATH}>
				<Route path={'/'} component={Fabrics} />
				<Route path={PATHS.CREATE_PATH} component={FabricCreate} />
			</Route>
			<Route path={PATHS.RESOURCES_PATH}>
				<Route path={'/'} component={Resources} />
				<Route path={PATHS.CREATE_PATH} component={ResourceCreate} />
			</Route>
		</Route>
	);
}

export default DesignerRoutes;
