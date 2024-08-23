import { render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import ErrorMessage from '../ErrorMessage';

describe('ErrorMessage', () => {
	it('renders correctly on empty title n body', () => {
		render(() => <ErrorMessage />);

		const title = screen.getByText('Error');
		const subtitle = screen.getByText('Hubo un error durante la ejecución');
		const tips = screen.getByText('Refresca la página ó contacta con el administrador');

		expect(title).toBeInTheDocument();
		expect(subtitle).toBeInTheDocument();
		expect(tips).toBeInTheDocument();
	});

	it('renders correctly with title n body', () => {
		render(() => <ErrorMessage title='Different title' subtitle='Different subtitle' tips='Different tips' />);

		const title = screen.getByText('Different title');
		const subtitle = screen.getByText('Different subtitle');
		const tips = screen.getByText('Different tips');

		expect(title).toBeInTheDocument();
		expect(subtitle).toBeInTheDocument();
		expect(tips).toBeInTheDocument();
	});
});
