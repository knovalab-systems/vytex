import { useNavigate } from '@solidjs/router';
import { RiSystemLogoutBoxLine } from 'solid-icons/ri';
import toast from 'solid-toast';
import { Button } from '~/components/ui/Button';
import { MESSAGES } from '~/utils/constants';
import { LOGIN_PATH } from '~/utils/paths';
import { logoutRequest } from '../requests/authRequests';

function LogoutNavButton() {
	const navigate = useNavigate();

	const handleLogOut = () => {
		logoutRequest()
			.then(() => {
				navigate(`${LOGIN_PATH}?reason=LOG_OUT`);
				toast.success(MESSAGES.logout.confirm);
			})
			.catch(() => toast.error('Error al cerrar sesión'));
	};

	return (
		<>
			<Button
				onclick={handleLogOut}
				class='w-full h-auto flex items-center group bg-transparent p-2 font-semibold text-sm rounded-lg text-white hover:bg-red-500  gap-1 p transition-colors duration-200'
			>
				<RiSystemLogoutBoxLine size={24} />
				<span class='ml-3'>Cerrar sesión</span>
				<div class='ml-auto w-1 rounded-xl h-8 bg-transparent transition-colors duration-200 relative overflow-hidden'>
					<span class='absolute top-0 left-0 w-full h-[102%] translate-y-full group-hover:translate-y-0 bg-white transition-all duration-300' />
				</div>
			</Button>
		</>
	);
}

export default LogoutNavButton;
