import { render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import type { GetCustomsType } from '../../requests/CustomGet';
import CustomTable from '../CustomTable';

vi.mock('~/components/ActionsCell', () => ({
	default: () => {
		return (
			<td>
				<span>Agregar</span>
			</td>
		);
	},
}));

describe('Custom Table', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly on empty customs', () => {
		render(() => <CustomTable customs={undefined} />);
		const tableHeader = screen.getByText('No se han encontrado pedidos.');

		expect(tableHeader).toBeInTheDocument();
	});

	it('renders correctly on customs', () => {
		const customs: GetCustomsType = [
			{
				id: 123,
				client: 'pepe',
				created_at: '2024-05-12T22:36:52.140901Z',
				finished_at: null,
				canceled_at: null,
				created_by: null,
				canceled_by: null,
				create_user: null,
				cancel_user: null,
				orders: null,
			},
		];
		render(() => <CustomTable customs={customs} />);
		const customId = screen.getByText('123');
		const customClient = screen.getByText('pepe');
		const customCreatedAt = screen.getByText('2024-05-12 5:36 PM');

		expect(customId).toBeInTheDocument();
		expect(customClient).toBeInTheDocument();
		expect(customCreatedAt).toBeInTheDocument();
	});

	it('does not render action cell if finished date is present', () => {
		const customs: GetCustomsType = [
			{
				id: 123,
				client: 'pepe',
				created_at: '2024-05-12T22:36:52.140901Z',
				finished_at: '2024-06-12T22:36:52.140901Z',
				canceled_at: null,
				created_by: null,
				canceled_by: null,
				create_user: null,
				cancel_user: null,
				orders: null,
			},
		];

		render(() => <CustomTable customs={customs} />);
		const customId = screen.getByText('123');
		const customClient = screen.getByText('pepe');
		const customCreatedAt = screen.getByText('2024-05-12 5:36 PM');
		const customFinishedAt = screen.getByText('2024-06-12 5:36 PM');

		expect(customId).toBeInTheDocument();
		expect(customClient).toBeInTheDocument();
		expect(customCreatedAt).toBeInTheDocument();
		expect(customFinishedAt).toBeInTheDocument();

		const actionsCell = screen.queryByText('Agregar');
		expect(actionsCell).not.toBeInTheDocument();
	});

	it('does not render action cell if canceled date is present', () => {
		const customs: GetCustomsType = [
			{
				id: 123,
				client: 'pepe',
				created_at: '2024-05-12T22:36:52.140901Z',
				canceled_at: '2024-06-12T22:36:52.140901Z',
				finished_at: null,
				created_by: null,
				canceled_by: null,
				create_user: null,
				cancel_user: null,
				orders: null,
			},
		];

		render(() => <CustomTable customs={customs} />);
		const customId = screen.getByText('123');
		const customClient = screen.getByText('pepe');
		const customCreatedAt = screen.getByText('2024-05-12 5:36 PM');
		const customFinishedAt = screen.getByText('2024-06-12 5:36 PM');

		expect(customId).toBeInTheDocument();
		expect(customClient).toBeInTheDocument();
		expect(customCreatedAt).toBeInTheDocument();
		expect(customFinishedAt).toBeInTheDocument();

		const actionsCell = screen.queryByText('Agregar');
		expect(actionsCell).not.toBeInTheDocument();
	});

	it('does not render action cell if finished and canceled date are present', () => {
		const customs: GetCustomsType = [
			{
				id: 123,
				client: 'pepe',
				created_at: '2024-05-12T22:36:52.140901Z',
				finished_at: '2024-06-12T22:36:52.140901Z',
				canceled_at: '2024-07-12T22:36:52.140901Z',
				created_by: null,
				canceled_by: null,
				create_user: null,
				cancel_user: null,
				orders: null,
			},
		];

		render(() => <CustomTable customs={customs} />);
		const customId = screen.getByText('123');
		const customClient = screen.getByText('pepe');
		const customCreatedAt = screen.getByText('2024-05-12 5:36 PM');
		const customFinishedAt = screen.getByText('2024-06-12 5:36 PM');
		const customCanceledAt = screen.getByText('2024-07-12 5:36 PM');

		expect(customId).toBeInTheDocument();
		expect(customClient).toBeInTheDocument();
		expect(customCreatedAt).toBeInTheDocument();
		expect(customFinishedAt).toBeInTheDocument();
		expect(customCanceledAt).toBeInTheDocument();

		const actionsCell = screen.queryByText('Agregar');
		expect(actionsCell).not.toBe;
	});

	it('renders action cell with create action if no finished or canceled date is present', () => {
		const customs: GetCustomsType = [
			{
				id: 123,
				client: 'pepe',
				created_at: '2024-05-12T22:36:52.140901Z',
				finished_at: null,
				canceled_at: null,
				created_by: null,
				canceled_by: null,
				create_user: null,
				cancel_user: null,
				orders: null,
			},
		];

		render(() => <CustomTable customs={customs} />);
		const customId = screen.getByText('123');
		const customClient = screen.getByText('pepe');
		const customCreatedAt = screen.getByText('2024-05-12 5:36 PM');
		const actionsCell = screen.getByText('Agregar');

		expect(customId).toBeInTheDocument();
		expect(customClient).toBeInTheDocument();
		expect(customCreatedAt).toBeInTheDocument();

		expect(actionsCell).toBeInTheDocument();
	});
});
