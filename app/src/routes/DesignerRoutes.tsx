import { Route } from '@solidjs/router';
import { lazy } from 'solid-js';

const MatchDesigner = lazy(() => import('~/modules/auth/components/MatchDesigner'));

function DesignerRoutes() {
	return (
		<Route path={'/'} component={MatchDesigner}>
			<div>Designer</div>
		</Route>
	);
}

export default DesignerRoutes;
