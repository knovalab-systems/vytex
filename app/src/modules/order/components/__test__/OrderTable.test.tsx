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
            { id: 123 },
            { custom_id: 345 },
            { created_at: '2024-05-12T22:36:52.140901Z' },
            { canceled_at: '2024-06-12T22:36:52.140901Z' },
            { finished_at: '2024-07-12T22:36:52.140901Z' },
            { status: 'Created' }
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