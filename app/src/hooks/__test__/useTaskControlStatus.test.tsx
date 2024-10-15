import { render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import * as query from '@tanstack/solid-query';
import { TaskControlStatusProvider, useTaskControlStatus } from '../useTaskControlStatus';

const requestMock = vi.fn();

const TestTaskControlStatusRecordElement = () => {
	const { getTaskControlStatusRecord } = useTaskControlStatus();
	return <div>{Object.keys(getTaskControlStatusRecord()).join(',')}</div>;
};

const TestTaskControlStatusArrByValueElement = () => {
	const { getStateByValue } = useTaskControlStatus();
	return <div>{getStateByValue('created')?.name ?? 'default'}</div>;
};

describe('useTaskControlStatus', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('checks get task control state record', async () => {
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
			<TaskControlStatusProvider>
				<TestTaskControlStatusRecordElement />
			</TaskControlStatusProvider>
		));
		const result = screen.getByText('1,2');
		expect(result).toBeInTheDocument();

		await waitFor(() => {
			expect(requestMock).toBeCalled();
		});
	});

	it('checks get task control state', async () => {
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
			<TaskControlStatusProvider>
				<TestTaskControlStatusArrByValueElement />
			</TaskControlStatusProvider>
		));
		const result = screen.getByText('creado');
		expect(result).toBeInTheDocument();

		await waitFor(() => {
			expect(requestMock).toBeCalled();
		});
	});

	it('checks get task control state when not found', async () => {
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
			<TaskControlStatusProvider>
				<TestTaskControlStatusArrByValueElement />
			</TaskControlStatusProvider>
		));
		const result = screen.getByText('default');
		expect(result).toBeInTheDocument();

		await waitFor(() => {
			expect(requestMock).toBeCalled();
		});
	});
});
