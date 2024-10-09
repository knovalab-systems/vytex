import { render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import type { GetOrdersType } from '../../request/orderGet';
import OrderTable from '../OrderTable';

vi.mock('~/hooks/useOrderStatus', () => ({
	useOrderStatus: () => ({ getOrderStatusRecord: () => ({ 0: { name: 'Creada' }, 1: { name: 'Iniciada' } }) }),
}));

describe('Order Table', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly on empty orders', () => {
		render(() => <OrderTable orders={undefined} />);
		const tableHeader = screen.getByText('No se han encontrado ordenes.');

		expect(tableHeader).toBeInTheDocument();
	});

	it('renders correctly on orders', () => {
		const orders: GetOrdersType = [
			{
				id: 123,
				order_state_id: 0,
				created_at: '',
				finished_at: null,
				started_at: null,
				canceled_at: null,
				custom_id: null,
				color_by_reference: null,
			},
			{
				custom_id: 345,
				id: 0,
				order_state_id: 0,
				created_at: '',
				finished_at: null,
				started_at: null,
				canceled_at: null,
				color_by_reference: null,
			},
			{
				created_at: '2024-05-12T22:36:52.140901Z',
				id: 0,
				order_state_id: 0,
				finished_at: null,
				started_at: null,
				canceled_at: null,
				custom_id: null,
				color_by_reference: null,
			},
			{
				canceled_at: '2024-06-12T22:36:52.140901Z',
				id: 0,
				order_state_id: 0,
				created_at: '',
				finished_at: null,
				started_at: null,
				custom_id: null,
				color_by_reference: null,
			},
			{
				finished_at: '2024-07-12T22:36:52.140901Z',
				id: 0,
				order_state_id: 0,
				created_at: '',
				started_at: null,
				canceled_at: null,
				custom_id: null,
				color_by_reference: null,
			},
			{
				id: 0,
				order_state_id: 1,
				created_at: '',
				finished_at: null,
				started_at: null,
				canceled_at: null,
				custom_id: null,
				color_by_reference: null,
			},
		];
		render(() => <OrderTable orders={orders} />);

		const orderId = screen.getByText('123');
		const customId = screen.getByText('345');
		const statusCreated = screen.getAllByText('Creada');
		const statusStart = screen.getByText('Iniciada');
		const orderCreatedAt = screen.getByText('2024-05-12 5:36 PM');
		const orderCanceledAt = screen.getByText('2024-06-12 5:36 PM');
		const orderFinishedAt = screen.getByText('2024-07-12 5:36 PM');

		expect(orderId).toBeInTheDocument();
		expect(customId).toBeInTheDocument();
		expect(statusStart).toBeInTheDocument();
		expect(statusCreated).length(5);
		expect(orderCreatedAt).toBeInTheDocument();
		expect(orderCanceledAt).toBeInTheDocument();
		expect(orderFinishedAt).toBeInTheDocument();
	});
});
