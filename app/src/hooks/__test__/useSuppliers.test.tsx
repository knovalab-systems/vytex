import { render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import * as query from '@tanstack/solid-query';
import { SuppliersProvider, useSuppliers } from '../useSuppliers';

const requestMock = vi.fn();

const TestRecordElement = () => {
	const { getSuppliersRecord } = useSuppliers();
	return <div>{Object.keys(getSuppliersRecord()).join(',')}</div>;
};

const TestArrElement = () => {
	const { getSuppliers } = useSuppliers();
	return (
		<div>
			{getSuppliers()
				.map(e => e.name)
				.join(',')}
		</div>
	);
};

describe('useSuppliers', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('checks suppliers', async () => {
		// @ts-ignore: mock other values is no neccesary
		vi.spyOn(query, 'createQuery').mockImplementation(() => {
			requestMock();
			return {
				isSuccess: true,
				isError: false,
				data: [
					{ id: 1, name: 'supplier1' },
					{ id: 2, name: 'supllier2' },
				],
			};
		});

		render(() => (
			<SuppliersProvider>
				<TestArrElement />
			</SuppliersProvider>
		));
		const result = screen.getByText('supplier1,supllier2');
		expect(result).toBeInTheDocument();

		await waitFor(() => {
			expect(requestMock).toBeCalled();
		});
	});

	it('checks suppliers record', async () => {
		// @ts-ignore: mock other values is no neccesary
		vi.spyOn(query, 'createQuery').mockImplementation(() => {
			requestMock();
			return {
				isSuccess: true,
				isError: false,
				data: [
					{ id: 1, name: 'supplier1' },
					{ id: 2, name: 'supllier2' },
				],
			};
		});

		render(() => (
			<SuppliersProvider>
				<TestRecordElement />
			</SuppliersProvider>
		));
		const result = screen.getByText('1,2');
		expect(result).toBeInTheDocument();

		await waitFor(() => {
			expect(requestMock).toBeCalled();
		});
	});
});
