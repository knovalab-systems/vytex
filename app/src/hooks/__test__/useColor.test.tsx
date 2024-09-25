import { render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import * as query from '@tanstack/solid-query';
import { ColorsProvider, useColors } from '../useColors';

const requestMock = vi.fn();

const TestRecordElement = () => {
	const { getColorsRecord } = useColors();
	return <div>{Object.keys(getColorsRecord()).join(',')}</div>;
};

const TestArrElement = () => {
	const { getColors } = useColors();
	return (
		<div>
			{getColors()
				.map(e => e.name)
				.join(',')}
		</div>
	);
};

describe('useColors', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('checks colors', async () => {
		// @ts-ignore: mock other values is no neccesary
		vi.spyOn(query, 'createQuery').mockImplementation(() => {
			requestMock();
			return {
				isSuccess: true,
				isError: false,
				data: [
					{ id: 1, hex: '', name: 'blanco' },
					{ id: 2, hex: '', name: 'negro' },
				],
			};
		});

		render(() => (
			<ColorsProvider>
				<TestArrElement />
			</ColorsProvider>
		));
		const result = screen.getByText('blanco,negro');
		expect(result).toBeInTheDocument();

		await waitFor(() => {
			expect(requestMock).toBeCalled();
		});
	});

	it('checks colors record', async () => {
		// @ts-ignore: mock other values is no neccesary
		vi.spyOn(query, 'createQuery').mockImplementation(() => {
			requestMock();
			return {
				isSuccess: true,
				isError: false,
				data: [
					{ id: 1, hex: '', name: 'blanco' },
					{ id: 2, hex: '', name: 'negro' },
				],
			};
		});

		render(() => (
			<ColorsProvider>
				<TestRecordElement />
			</ColorsProvider>
		));
		const result = screen.getByText('1,2');
		expect(result).toBeInTheDocument();

		await waitFor(() => {
			expect(requestMock).toBeCalled();
		});
	});
});
