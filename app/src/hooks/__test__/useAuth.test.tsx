import { render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import * as query from '@tanstack/solid-query';
import { AuthProvider, useAuth } from '../useAuth';

const requestMock = vi.fn();

const TestStatusElement = () => {
	const { authStatus } = useAuth();
	return <div>{authStatus()}</div>;
};

describe('useAuth', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('status authenticated', async () => {
		// @ts-ignore: mock other values is no neccesary
		vi.spyOn(query, 'createQuery').mockImplementation(() => {
			requestMock();
			return { isSuccess: true, isError: false };
		});

		render(() => (
			<AuthProvider>
				<TestStatusElement />
			</AuthProvider>
		));
		const status = screen.getByText('authenticated');
		expect(status).toBeInTheDocument();

		await waitFor(() => {
			expect(requestMock).toBeCalled();
		});
	});

	it('status unauthenticated', async () => {
		// @ts-ignore: mock other values is no neccesary
		vi.spyOn(query, 'createQuery').mockImplementation(() => {
			requestMock();
			return { isSuccess: false, isError: true };
		});

		render(() => (
			<AuthProvider>
				<TestStatusElement />
			</AuthProvider>
		));
		const status = screen.getByText('unauthenticated');
		expect(status).toBeInTheDocument();

		await waitFor(() => {
			expect(requestMock).toBeCalled();
		});
	});

	it('status unresolved', async () => {
		// @ts-ignore: mock other values is no neccesary
		vi.spyOn(query, 'createQuery').mockImplementation(() => {
			requestMock();
			return { isSuccess: false, isError: false };
		});

		render(() => (
			<AuthProvider>
				<TestStatusElement />
			</AuthProvider>
		));
		const status = screen.getByText('unresolved');
		expect(status).toBeInTheDocument();

		await waitFor(() => {
			expect(requestMock).toBeCalled();
		});
	});
});
