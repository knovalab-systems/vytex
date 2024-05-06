import { useNavigate } from '@solidjs/router';
import { RiSystemLogoutBoxLine } from 'solid-icons/ri';
import { createSignal } from 'solid-js';
import toast from 'solid-toast';
import { logoutRequest } from '~/modules/auth/requests/authRequests';
import { MESSAGES } from '~/utils/constans';
import ConfirmationModal from './ConfirmationModal';

const LogoutButton = (props: { navigateTo: string }) => {
	const navigate = useNavigate();
	const [navigateTo] = createSignal(props.navigateTo);
	const [showModal, setShowModal] = createSignal(false);

	const logout = async () => {
		try {
			await logoutRequest();
			navigate(`${navigateTo()}`, { replace: true });
			toast.success(MESSAGES.logout.confirm);
		} catch (error) {
			toast.error(MESSAGES.logout.error)
		}
	};

	const handleLogout = () => {
		setShowModal(true);
	};

	return (
		<>
			<button
				type='button'
				onclick={handleLogout}
				class='w-full flex items-center group  p-2 font-semibold text-sm rounded-lg text-white hover:bg-practice_date dark:hover:bg-gray-700 gap-1 p transition-colors duration-200'
			>
				<RiSystemLogoutBoxLine size={24} />
				<span class='ml-3'>Cerrar sesión</span>
				<div class='ml-auto w-1 rounded-xl h-8 bg-transparent transition-colors duration-200 relative overflow-hidden'>
					<span class='absolute top-0 left-0 w-full h-[102%] translate-y-full group-hover:translate-y-0 bg-white transition-all duration-300' />
				</div>
			</button>
			{showModal() && (
				<ConfirmationModal
					title={MESSAGES.logout.title}
					message={MESSAGES.logout.description}
					onConfirm={logout}
					onCancel={() => setShowModal(false)}
				/>
			)}
		</>
	);
};

export default LogoutButton;
