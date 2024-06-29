import { Match, Switch, lazy } from 'solid-js';
import RoleRoot from '~/hooks/roleRoot';
import { NO_ROLE } from '~/utils/env';

const NotPermission = lazy(() => import('~/pages/NotPermission'));

function Home() {
	const { role } = RoleRoot;

	return (
		<Switch
			fallback={
				<div class='flex flex-col h-full justify-between'>
					<div class='mb-auto'>
						<div class='container mx-auto p-4'>
							<h1 class='text-4xl font-bold text-center'>Home</h1>
							<p class='text-lg text-center'>Welcome to the temporally home page</p>
						</div>
					</div>
				</div>
			}
		>
			<Match when={role() === NO_ROLE || role() === null}>
				<NotPermission />
			</Match>
		</Switch>
	);
}

export default Home;
