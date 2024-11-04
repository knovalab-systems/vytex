import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import type { CoreSchema, VytexUser } from '@vytex/client';
import { CUSTOMS_PATH, ORDERS_CREATE_PATH } from '~/constants/paths';
import type { GetCustomType } from '../../requests/CustomGet';
import CustomCard from '../CustomCard';

const navigateMock = vi.fn();
vi.mock('@solidjs/router', () => ({
	useNavigate: () => navigateMock,
}));

describe('UserCard', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly with deleted_at', () => {
		const custom: GetCustomType = {
			id: 1,
			client: 'jose',
			created_at: '2024-05-12T22:36:52.140901Z',
			create_user: { name: 'usuario' } as VytexUser<CoreSchema>,
			cancel_user: null,
			orders: null,
			finished_at: null,
			canceled_at: null,
		};
		render(() => <CustomCard custom={custom} />);

		const id = screen.getByText('Detalles del pedido: 1');
		const client = screen.getByText('jose');
		const user = screen.getByText('usuario');

		expect(id).toBeInTheDocument();
		expect(client).toBeInTheDocument();
		expect(user).toBeInTheDocument();
	});

	it('calls back correctly', async () => {
		const custom: GetCustomType = {
			id: 1,
			client: null,
			created_at: null,
			finished_at: null,
			canceled_at: null,
			create_user: null,
			cancel_user: null,
			orders: null,
		};
		render(() => <CustomCard custom={custom} />);

		const back = screen.getByText('Volver');
		fireEvent.click(back);

		await waitFor(() => expect(navigateMock).toBeCalledWith(CUSTOMS_PATH));
	});

	it('calls edit correctly', async () => {
		const custom: GetCustomType = {
			id: 1,
			client: null,
			created_at: null,
			finished_at: null,
			canceled_at: null,
			create_user: null,
			cancel_user: null,
			orders: null,
		};
		render(() => <CustomCard custom={custom} />);

		const edit = screen.getByText('Agregar orden');
		fireEvent.click(edit);

		await waitFor(() => expect(navigateMock).toBeCalledWith(`${ORDERS_CREATE_PATH}/1`));
	});
});
