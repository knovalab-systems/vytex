import { render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import type { GetOrdersType } from '../../request/OrderGet';
import OrderTable from '../OrderTable';

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
				status: null,
				custom: null,
				created_at: null,
				created_by: null,
				finished_at: null,
				canceled_at: null,
				canceled_by: null,
				create_user: null,
				cancel_user: null,
				color_by_reference_id: null,
				custom_id: null,
				color_by_reference: null,
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
			},
			{
				custom_id: 345,
				status: null,
				custom: null,
				id: 0,
				created_at: null,
				created_by: null,
				finished_at: null,
				canceled_at: null,
				canceled_by: null,
				create_user: null,
				cancel_user: null,
				color_by_reference_id: null,
				color_by_reference: null,
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
			},
			{
				created_at: '2024-05-12T22:36:52.140901Z',
				status: null,
				custom: null,
				id: 0,
				created_by: null,
				finished_at: null,
				canceled_at: null,
				canceled_by: null,
				create_user: null,
				cancel_user: null,
				color_by_reference_id: null,
				custom_id: null,
				color_by_reference: null,
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
			},
			{
				canceled_at: '2024-06-12T22:36:52.140901Z',
				status: null,
				custom: null,
				id: 0,
				created_at: null,
				created_by: null,
				finished_at: null,
				canceled_by: null,
				create_user: null,
				cancel_user: null,
				color_by_reference_id: null,
				custom_id: null,
				color_by_reference: null,
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
			},
			{
				finished_at: '2024-07-12T22:36:52.140901Z',
				status: null,
				custom: null,
				id: 0,
				created_at: null,
				created_by: null,
				canceled_at: null,
				canceled_by: null,
				create_user: null,
				cancel_user: null,
				color_by_reference_id: null,
				custom_id: null,
				color_by_reference: null,
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
			},
			{
				status: 'Created',
				custom: null,
				id: 0,
				created_at: null,
				created_by: null,
				finished_at: null,
				canceled_at: null,
				canceled_by: null,
				create_user: null,
				cancel_user: null,
				color_by_reference_id: null,
				custom_id: null,
				color_by_reference: null,
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
			},
		];
		render(() => <OrderTable orders={orders} />);

		const orderId = screen.getByText('123');
		const customId = screen.getByText('345');
		const status = screen.getByText('creado');
		const orderCreatedAt = screen.getByText('2024-05-12 5:36 PM');
		const orderCanceledAt = screen.getByText('2024-06-12 5:36 PM');
		const orderFinishedAt = screen.getByText('2024-07-12 5:36 PM');

		expect(orderId).toBeInTheDocument();
		expect(customId).toBeInTheDocument();
		expect(status).toBeInTheDocument();
		expect(orderCreatedAt).toBeInTheDocument();
		expect(orderCanceledAt).toBeInTheDocument();
		expect(orderFinishedAt).toBeInTheDocument();
	});
});
