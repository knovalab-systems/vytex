import { render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import * as query from '@tanstack/solid-query';
import { StepsProvider, useSteps } from '../useSteps';

const requestMock = vi.fn();

const TestStepElement = () => {
	const { getStepByValue } = useSteps();
	return <div>{getStepByValue('corte')?.name ?? 'default'}</div>;
};

const TestTaskArrElement = () => {
	const { getTasks } = useSteps();
	return (
		<div>
			{getTasks()
				.map(e => e.name)
				.join(',')}
		</div>
	);
};

const TestTaskRecordElement = () => {
	const { getTasksRecord } = useSteps();
	return <div>{Object.keys(getTasksRecord()).join(',')}</div>;
};

describe('useColors', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('checks get step', async () => {
		// @ts-ignore: mock other values is no neccesary
		vi.spyOn(query, 'createQuery').mockImplementation(() => {
			requestMock();
			return {
				isSuccess: true,
				isError: false,
				data: [{ id: 1, name: 'corte', value: 'corte' }],
			};
		});

		render(() => (
			<StepsProvider>
				<TestStepElement />
			</StepsProvider>
		));
		const result = screen.getByText('corte');
		expect(result).toBeInTheDocument();

		await waitFor(() => {
			expect(requestMock).toBeCalled();
		});
	});

	it('checks get step when not found', async () => {
		// @ts-ignore: mock other values is no neccesary
		vi.spyOn(query, 'createQuery').mockImplementation(() => {
			requestMock();
			return {
				isSuccess: true,
				isError: false,
				data: [{ id: 1, name: 'corte', value: 'other' }],
			};
		});

		render(() => (
			<StepsProvider>
				<TestStepElement />
			</StepsProvider>
		));
		const result = screen.getByText('default');
		expect(result).toBeInTheDocument();

		await waitFor(() => {
			expect(requestMock).toBeCalled();
		});
	});

	it('checks tasks', async () => {
		// @ts-ignore: mock other values is no neccesary
		vi.spyOn(query, 'createQuery').mockImplementation(() => {
			requestMock();
			return {
				isSuccess: true,
				isError: false,
				data: [{ id: 1, name: 'corte', value: 'corte', tasks: [{ name: 'task1' }, { name: 'task2' }] }],
			};
		});

		render(() => (
			<StepsProvider>
				<TestTaskArrElement />
			</StepsProvider>
		));
		const result = screen.getByText('task1,task2');
		expect(result).toBeInTheDocument();

		await waitFor(() => {
			expect(requestMock).toBeCalled();
		});
	});

	it('checks tasks record', async () => {
		// @ts-ignore: mock other values is no neccesary
		vi.spyOn(query, 'createQuery').mockImplementation(() => {
			requestMock();
			return {
				isSuccess: true,
				isError: false,
				data: [
					{
						id: 1,
						name: 'corte',
						value: 'corte',
						tasks: [
							{ id: 1, name: 'task1' },
							{ id: 2, name: 'task2' },
						],
					},
				],
			};
		});

		render(() => (
			<StepsProvider>
				<TestTaskRecordElement />
			</StepsProvider>
		));
		const result = screen.getByText('1,2');
		expect(result).toBeInTheDocument();

		await waitFor(() => {
			expect(requestMock).toBeCalled();
		});
	});
});
