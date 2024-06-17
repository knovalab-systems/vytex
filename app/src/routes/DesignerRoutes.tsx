import { Route } from '@solidjs/router';
import { lazy } from 'solid-js';
import * as PATHS from '~/utils/paths';

const MatchDesigner = lazy(() => import('~/modules/auth/components/MatchDesigner'));
const ReferenceCreate = lazy(() => import('~/modules/references/pages/ReferenceCreate'));

function DesignerRoutes() {
	return (
		<Route path='/' component={MatchDesigner}>
			<Route path={PATHS.REFS_PATH} component={ReferenceCreate}>
				<Route path='/' component={ReferenceCreate} />
			</Route>
		</Route>
	);
}

export default DesignerRoutes;
