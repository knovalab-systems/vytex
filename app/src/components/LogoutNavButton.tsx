import { useNavigate } from '@solidjs/router';
import { RiSystemLogoutBoxLine } from 'solid-icons/ri';
import toast from 'solid-toast';
import { Button } from '~/components/ui/Button';
import { LOGIN_PATH } from '~/constants/paths';
import { useAuth } from '~/hooks/useAuth';
import { queryClient } from '~/lib/queryClient';
import { cn } from '~/lib/utils';
import { getMeQueryKey } from '~/requests/getMe';

/**
 *
 * @param {String} props.class Class for button
 * @returns
 */
function LogoutNavButton(props: { class?: string }) {
	const { logout } = useAuth();
	const navigate = useNavigate();

	const handleLogOut = () => {
		logout()
			.then(() => {
				queryClient.removeQueries({ queryKey: [getMeQueryKey], exact: true });
				navigate(LOGIN_PATH);
				toast.success('Sessión cerrada correctamente');
			})
			.catch(() => toast.error('Error al cerrar sesión'));
	};

	return (
		<Button
			onclick={handleLogOut}
			class={cn(
				'w-full h-auto flex items-center group bg-transparent p-2 font-semibold text-sm rounded-lg text-white gap-1 transition-colors duration-200 hover:bg-red-500 hover:shadow',
				props.class,
			)}
		>
			<RiSystemLogoutBoxLine size={24} />
			<span class='ml-3'>Cerrar sesión</span>
			<div class='ml-auto w-1 rounded-xl h-8 bg-transparent transition-colors duration-200 relative overflow-hidden'>
				<span class='absolute top-0 left-0 w-full h-[102%] translate-y-full bg-white transition-all duration-300 group-hover:translate-y-0' />
			</div>
		</Button>
	);
}

export default LogoutNavButton;
