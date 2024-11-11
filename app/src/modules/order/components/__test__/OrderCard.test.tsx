import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import type { CoreSchema, VytexCustom, VytexUser } from '@vytex/client';
import { ORDERS_PATH } from '~/constants/paths';
import type { OrderState } from '~/types/core';
import type { GetOrder } from '../../request/orderGet';
import OrderCard from '../OrderCard';

const AMock = vi.fn();
const navigateMock = vi.fn();
vi.mock('@solidjs/router', () => ({
	useNavigate: () => navigateMock,
	A: (props: { href: string }) => {
		AMock();
		return <div>{props.href}</div>;
	},
}));

describe('OrderCard', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly with deleted_at', () => {
		const order: GetOrder = {
			id: 1,
			order_state_id: 0,
			created_at: '',
			finished_at: null,
			started_at: null,
			canceled_at: null,
			created_by: '',
			canceled_by: null,
			color_by_reference_id: null,
			custom_id: null,
			color_by_reference: null,
			custom: {
				client: 'jose',
				id: 1,
			} as VytexCustom<CoreSchema>,
			create_user: { name: 'usuario' } as VytexUser<CoreSchema>,
			cancel_user: null,
			order_state: {
				name: 'corte',
			} as OrderState,
			'2XS': null,
			XS: null,
			S: null,
			M: null,
			L: null,
			XL: null,
			'2XL': null,
			'3XL': null,
			'4XL': null,
			'5XL': null,
			'6XL': null,
			'7XL': null,
			'8XL': null,
		};
		render(() => <OrderCard order={order} />);

		const id = screen.getByText('Detalles de la orden: 1');
		const client = screen.getByText('jose');
		const user = screen.getByText('usuario');
		const state = screen.getByText('corte');

		expect(id).toBeInTheDocument();
		expect(client).toBeInTheDocument();
		expect(user).toBeInTheDocument();
		expect(state).toBeInTheDocument();
	});

	it('calls back correctly', async () => {
		const order: GetOrder = {
			id: 0,
			order_state_id: 0,
			created_at: '',
			finished_at: null,
			started_at: null,
			canceled_at: null,
			created_by: '',
			canceled_by: null,
			color_by_reference_id: null,
			custom_id: null,
			color_by_reference: null,
			custom: null,
			create_user: null,
			cancel_user: null,
			order_state: null,
			'2XS': null,
			XS: null,
			S: null,
			M: null,
			L: null,
			XL: null,
			'2XL': null,
			'3XL': null,
			'4XL': null,
			'5XL': null,
			'6XL': null,
			'7XL': null,
			'8XL': null,
		};
		render(() => <OrderCard order={order} />);

		const back = screen.getByText('Volver');
		fireEvent.click(back);

		await waitFor(() => expect(navigateMock).toBeCalledWith(ORDERS_PATH));
	});
});
