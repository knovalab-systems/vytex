import { render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import StatusLabel from '../StatusLabel';

describe('ActionsCell', () => {
	it('renders correctly on true', () => {
		render(() => <StatusLabel status={true} />);

		const label = screen.getByText('Activo');

		expect(label).toBeInTheDocument();
	});

	it('renders correctly on false', () => {
		render(() => <StatusLabel status={false} />);

		const label = screen.getByText('Inactivo');

		expect(label).toBeInTheDocument();
	});
});
