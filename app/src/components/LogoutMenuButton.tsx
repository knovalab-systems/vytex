import { useNavigate } from '@solidjs/router';
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
function LogoutMenuButton(props: { class?: string }) {
	const navigate = useNavigate();

	const { logout } = useAuth();

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
				'w-full h-auto text-base bg-transparent p-3 text-gray-600 font-semibold rounded-lg transition-colors duration-200 hover:shadow hover:bg-red-500 hover:text-white',
				props.class,
			)}
		>
			<span>Cerrar sesión</span>
		</Button>
	);
}

export default LogoutMenuButton;
