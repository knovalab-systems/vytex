import { Match, Switch, lazy } from 'solid-js';
import { queryClient } from '~/lib/queryClient';
import CustomRoleHome from '~/modules/data/pages/CustomRoleHome';
import { getMeQueryKey, type getMeType } from '~/requests/getMe';

const NotPermission = lazy(() => import('~/pages/NotPermission'));
const AdminHome = lazy(() => import('~/modules/data/pages/AdminHome'));
const DesignerHome = lazy(() => import('~/modules/data/pages/DesignerHome'));
const CommerceHome = lazy(() => import('~/modules/data/pages/CommerceHome'));

function Home() {
	const user = queryClient.getQueryData<getMeType>([getMeQueryKey]);

	return (
		<Switch
			fallback={
				<div class='flex flex-col w-full h-full'>
					<div class='p-4'>
						<h1 class='text-4xl font-bold text-center'>Home</h1>
						<p class='text-lg text-center'>Welcome to the temporally home page</p>
					</div>
				</div>
			}
		>
			<Match when={!user?.role}>
				<NotPermission />
			</Match>
			<Match when={!user?.role?.code}>
				<CustomRoleHome />
			</Match>
			<Match when={user?.role?.code === 'admin'}>
				<AdminHome />
			</Match>
			<Match when={user?.role?.code === 'designer'}>
				<DesignerHome />
			</Match>
			<Match when={user?.role?.code === 'commerce'}>
				<CommerceHome />
			</Match>
		</Switch>
	);
}

export default Home;
