import { render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import LitsTile from '../LitsTile';

describe('LitsTile', () => {
	it('renders correctly on title n support', () => {
		render(() => <LitsTile title='title' support='support' />);

		const title = screen.getByText('title');
		const support = screen.getByText('support');

		expect(title).toBeInTheDocument();
		expect(support).toBeInTheDocument();
	});

	it('renders correctly on support n empty title', () => {
		render(() => <LitsTile support='support' />);

		const title = screen.queryByText('title');
		const support = screen.getByText('support');

		expect(title).not.toBeInTheDocument();
		expect(support).toBeInTheDocument();
	});

	it('renders correctly on title n empty support', () => {
		render(() => <LitsTile title='title' />);

		const title = screen.getByText('title');
		const support = screen.queryByText('support');

		expect(title).toBeInTheDocument();
		expect(support).not.toBeInTheDocument();
	});
});
