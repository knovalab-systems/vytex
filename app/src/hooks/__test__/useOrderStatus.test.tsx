import { render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import * as query from '@tanstack/solid-query';
import { OrderStatusProvider, useOrderStatus } from '../useOrderStatus';

const requestMock = vi.fn();

const TestOrderStatusRecordElement = () => {
	const { getOrderStatusRecord } = useOrderStatus();
	return <div>{Object.keys(getOrderStatusRecord()).join(',')}</div>;
};

const TestOrderStatusArrByValueElement = () => {
	const { getStateByValue } = useOrderStatus();
	return <div>{getStateByValue('created')?.name ?? 'default'}</div>;
};

describe('useOrderStatus', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('checks get order state record', async () => {
		// @ts-ignore: mock other values is no neccesary
		vi.spyOn(query, 'createQuery').mockImplementation(() => {
			requestMock();
			return {
				isSuccess: true,
				isError: false,
				data: [{ id: 1 }, { id: 2 }],
			};
		});

		render(() => (
			<OrderStatusProvider>
				<TestOrderStatusRecordElement />
			</OrderStatusProvider>
		));
		const result = screen.getByText('1,2');
		expect(result).toBeInTheDocument();

		await waitFor(() => {
			expect(requestMock).toBeCalled();
		});
	});

	it('checks get order state', async () => {
		// @ts-ignore: mock other values is no neccesary
		vi.spyOn(query, 'createQuery').mockImplementation(() => {
			requestMock();
			return {
				isSuccess: true,
				isError: false,
				data: [{ id: 1, value: 'created', name: 'creado' }],
			};
		});

		render(() => (
			<OrderStatusProvider>
				<TestOrderStatusArrByValueElement />
			</OrderStatusProvider>
		));
		const result = screen.getByText('creado');
		expect(result).toBeInTheDocument();

		await waitFor(() => {
			expect(requestMock).toBeCalled();
		});
	});

	it('checks get order state when not found', async () => {
		// @ts-ignore: mock other values is no neccesary
		vi.spyOn(query, 'createQuery').mockImplementation(() => {
			requestMock();
			return {
				isSuccess: true,
				isError: false,
				data: [{ id: 1 }],
			};
		});

		render(() => (
			<OrderStatusProvider>
				<TestOrderStatusArrByValueElement />
			</OrderStatusProvider>
		));
		const result = screen.getByText('default');
		expect(result).toBeInTheDocument();

		await waitFor(() => {
			expect(requestMock).toBeCalled();
		});
	});
});
