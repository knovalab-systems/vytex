import { useNavigate } from '@solidjs/router';
import { createSignal } from 'solid-js';
import { Button } from '~/components/ui/Button';
import { logoutRequest } from '~/modules/auth/requests/logoutRequests';

const LogoutButton = (props: { navigateTo: string }) => {
	const navigate = useNavigate();
	const [navigateTo] = createSignal(props.navigateTo);

	const logout = async () => {
		try {
			await logoutRequest();
			navigate(`${navigateTo()}?reason=LOG_OUT`, { replace: true });
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Button onClick={logout} class='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'>
			Logout
		</Button>
	);
};

export default LogoutButton;
