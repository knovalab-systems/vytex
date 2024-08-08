import { Match, Switch, lazy } from 'solid-js';
import { NO_ROLE } from '~/envs/roles';
import { queryClient } from '~/lib/queryClient';
import { getMeQueryKey, type getMeType } from '~/requests/getMe';

const NotPermission = lazy(() => import('~/pages/NotPermission'));

function Home() {
	const user = queryClient.getQueryData<getMeType>([getMeQueryKey]);

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
			<Match when={user?.role === NO_ROLE || !user}>
				<NotPermission />
			</Match>
		</Switch>
	);
}

export default Home;
