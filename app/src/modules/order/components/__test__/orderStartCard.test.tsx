import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import toast from 'solid-toast';
import { SIZES } from '~/constants/sizes';
import type { OrderStatus } from '~/hooks/useOrderStatus';
import type { GetOrderStart } from '../../request/orderGet';
import * as requests from '../../request/orderUpdate';
import OrderStartCard from '../OrderStartCard';

const navigateMock = vi.fn();
vi.mock('@solidjs/router', () => ({
	useNavigate: () => navigateMock,
}));

vi.mock('~/hooks/useColors', () => ({
	refetchColors: vi.fn().mockResolvedValue({}),
	useColors: () => ({ getColorsRecord: () => ({ 1: { hex: 'FFFFFF' } }) }),
}));

const recordById = { 1: { name: 'Creada' }, 2: { name: 'Iniciada' } };
const recordByValue = {
	created: { name: 'Creada', id: 1 },
	started: { name: 'Iniciada', id: 2 },
	corte: { name: 'Corte', id: 3 },
	confeccion: { name: 'Confección', id: 3 },
	calidad: { name: 'Calidad', id: 3 },
	empaque: { name: 'Empaque', id: 3 },
	finished: { name: 'Finalizada', id: 3 },
	canceled: { name: 'Cancelada', id: 3 },
};

vi.mock('~/hooks/useOrderStatus', () => ({
	useOrderStatus: () => ({
		getOrderStatusRecord: () => recordById,
		getStatuByValue: (value: OrderStatus[number]['value']) => recordByValue[value],
	}),
}));

vi.mock('~/components/CancelButton', () => ({ default: () => <div>Cancelar</div> }));

describe('OrderStartCard', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly without fabrics n resouces', () => {
		const order: GetOrderStart = {
			id: 1,
			order_state_id: 1,
			color_by_reference: null,
			'2XS': 1,
			XS: 1,
			S: 1,
			M: 1,
			L: 1,
			XL: 1,
			'2XL': 1,
			'3XL': 1,
			'4XL': 1,
			'5XL': 1,
			'6XL': 1,
			'7XL': 1,
			'8XL': 1,
		};
		render(() => <OrderStartCard order={order} />);
		const resoucesTitle = screen.getByText('Insumos');
		const fabricsTitle = screen.getByText('Telas');
		const saveButton = screen.getByText('Iniciar');
		const cancelButton = screen.getByText('Cancelar');

		expect(resoucesTitle).toBeInTheDocument();
		expect(fabricsTitle).toBeInTheDocument();
		expect(saveButton).toBeInTheDocument();
		expect(cancelButton).toBeInTheDocument();
	});

	it('renders correctly with fabrics n resouces', () => {
		const order: GetOrderStart = {
			id: 1,
			order_state_id: 1,
			color_by_reference: {
				id: 1,
				fabrics: [
					{
						fabric: { name: 'tela1', color_id: 1 },
						id: 0,
						color_by_reference_id: null,
						'2XS': 3,
						XS: 3,
						S: 3,
						M: 3,
						L: 3,
						XL: 3,
						'2XL': 3,
						'3XL': 3,
						'4XL': 3,
						'5XL': 3,
						'6XL': 3,
						'7XL': 3,
						'8XL': 3,
						deleted_at: null,
						code: null,
						fabric_id: null,
					},
				],
				resources: [
					{
						resource: { name: 'insumo1', color_id: 1 },
						id: 0,
						color_by_reference_id: null,
						'2XS': 2,
						XS: 2,
						S: 2,
						M: 2,
						L: 2,
						XL: 2,
						'2XL': 2,
						'3XL': 2,
						'4XL': 2,
						'5XL': 2,
						'6XL': 2,
						'7XL': 2,
						'8XL': 2,
						deleted_at: null,
						code: null,
						resource_id: null,
					},
				],
			},
			'2XS': 1,
			XS: 1,
			S: 1,
			M: 1,
			L: 1,
			XL: 1,
			'2XL': 1,
			'3XL': 1,
			'4XL': 1,
			'5XL': 1,
			'6XL': 1,
			'7XL': 1,
			'8XL': 1,
		};
		render(() => <OrderStartCard order={order} />);
		const resoucesTitle = screen.getByText('Insumos');
		const fabricsTitle = screen.getByText('Telas');
		const saveButton = screen.getByText('Iniciar');
		const cancelButton = screen.getByText('Cancelar');
		const nameFabric = screen.getByText('tela1');
		const nameResource = screen.getByText('insumo1');
		const usageFabric = screen.getByText(SIZES.length * 3);
		const usageResource = screen.getByText(SIZES.length * 2);

		expect(resoucesTitle).toBeInTheDocument();
		expect(fabricsTitle).toBeInTheDocument();
		expect(saveButton).toBeInTheDocument();
		expect(cancelButton).toBeInTheDocument();
		expect(nameFabric).toBeInTheDocument();
		expect(nameResource).toBeInTheDocument();
		expect(usageFabric).toBeInTheDocument();
		expect(usageResource).toBeInTheDocument();
	});

	it('calls navigate order is already started', async () => {
		const order: GetOrderStart = {
			id: 1,
			order_state_id: 2,
			color_by_reference: null,
			'2XS': 1,
			XS: 1,
			S: 1,
			M: 1,
			L: 1,
			XL: 1,
			'2XL': 1,
			'3XL': 1,
			'4XL': 1,
			'5XL': 1,
			'6XL': 1,
			'7XL': 1,
			'8XL': 1,
		};
		render(() => <OrderStartCard order={order} />);
		await waitFor(() => expect(navigateMock).toBeCalled());
	});

	it('calls submit button succesfully', async () => {
		// @ts-ignore: return value does not matter
		const requestMock = vi.spyOn(requests, 'updateOrderRequest').mockResolvedValue({});
		const toastMock = vi.spyOn(toast, 'success');
		const order: GetOrderStart = {
			id: 1,
			order_state_id: 1,
			color_by_reference: null,
			'2XS': 1,
			XS: 1,
			S: 1,
			M: 1,
			L: 1,
			XL: 1,
			'2XL': 1,
			'3XL': 1,
			'4XL': 1,
			'5XL': 1,
			'6XL': 1,
			'7XL': 1,
			'8XL': 1,
		};
		render(() => <OrderStartCard order={order} />);
		const saveButton = screen.getByText('Iniciar');

		fireEvent.click(saveButton);

		await waitFor(() => {
			expect(requestMock).toBeCalled();
			expect(navigateMock).toBeCalled();
			expect(toastMock).toBeCalledWith('La orden inició con éxito.');
		});
	});

	it('calls submit button with error', async () => {
		const requestMock = vi.spyOn(requests, 'updateOrderRequest').mockRejectedValue({});
		const toastMock = vi.spyOn(toast, 'error');
		const order: GetOrderStart = {
			id: 1,
			order_state_id: 1,
			color_by_reference: null,
			'2XS': 1,
			XS: 1,
			S: 1,
			M: 1,
			L: 1,
			XL: 1,
			'2XL': 1,
			'3XL': 1,
			'4XL': 1,
			'5XL': 1,
			'6XL': 1,
			'7XL': 1,
			'8XL': 1,
		};
		render(() => <OrderStartCard order={order} />);
		const saveButton = screen.getByText('Iniciar');

		fireEvent.click(saveButton);

		await waitFor(() => {
			expect(requestMock).toBeCalled();
			expect(navigateMock).not.toBeCalled();
			expect(toastMock).toBeCalledWith('Error al iniciar la orden.');
		});
	});
});
