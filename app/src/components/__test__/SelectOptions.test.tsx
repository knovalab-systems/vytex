import { fireEvent, render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import SelectOptions from '../SelectOptions';

// mocks
const setSelect = vi.fn();

describe('SelectOptions', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly', () => {
		render(() => (
			<SelectOptions
				options={[
					{ label: 'Option 1', value: '1' },
					{ label: 'Option 2', value: '2' },
				]}
				placeholder='Estado de usuario'
				setSelect={setSelect}
				value=''
			/>
		));

		const select = screen.getByText('Estado de usuario');
		expect(select).toBeInTheDocument();
	});

	it('should call setSelect when option is selected', async () => {
		render(() => (
			<SelectOptions
				options={[
					{ label: 'Option 1', value: '1' },
					{ label: 'Option 2', value: '2' },
				]}
				placeholder='Estado de usuario'
				setSelect={setSelect}
				value=''
			/>
		));

		const select = screen.getByText('Estado de usuario');
		fireEvent.change(select, { target: { value: '1' } });
		expect(setSelect).toHaveBeenCalledTimes(1);
	});
});
