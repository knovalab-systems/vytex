import { render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import * as query from '@tanstack/solid-query';
import { RolesProvider, useRoles } from '../useRoles';

const requestMock = vi.fn();

const TestRecordElement = () => {
	const { getRolesRecord } = useRoles();
	return <div>{Object.keys(getRolesRecord()).join(',')}</div>;
};

const TestArrElement = () => {
	const { getRoles } = useRoles();
	return (
		<div>
			{getRoles()
				.map(e => e.name)
				.join(',')}
		</div>
	);
};

describe('useRoles', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('checks roles', async () => {
		// @ts-ignore: mock other values is no neccesary
		vi.spyOn(query, 'createQuery').mockImplementation(() => {
			requestMock();
			return {
				isSuccess: true,
				isError: false,
				data: [
					{ id: 1, name: 'rol1' },
					{ id: 2, name: 'rol2' },
				],
			};
		});

		render(() => (
			<RolesProvider>
				<TestArrElement />
			</RolesProvider>
		));
		const result = screen.getByText('rol1,rol2');
		expect(result).toBeInTheDocument();

		await waitFor(() => {
			expect(requestMock).toBeCalled();
		});
	});

	it('checks roles record', async () => {
		// @ts-ignore: mock other values is no neccesary
		vi.spyOn(query, 'createQuery').mockImplementation(() => {
			requestMock();
			return {
				isSuccess: true,
				isError: false,
				data: [
					{ id: 1, name: 'rol1' },
					{ id: 2, name: 'rol2' },
				],
			};
		});

		render(() => (
			<RolesProvider>
				<TestRecordElement />
			</RolesProvider>
		));
		const result = screen.getByText('1,2');
		expect(result).toBeInTheDocument();

		await waitFor(() => {
			expect(requestMock).toBeCalled();
		});
	});
});
