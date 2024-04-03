import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from 'solid-testing-library';
import App from './App';

describe('App component', () => {
	it('dummy assertion', () => {
		render(() => <App />);
		const text = screen.getByText('count is 0');
		expect(text).toBeInTheDocument();
	});
});
