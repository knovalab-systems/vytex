import { render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import { describe, expect, it } from 'vitest';
import Loading from '../Loading';

describe('Loading', () => {
	it('renders correctly', () => {
		render(() => <Loading />);

		const testLabel = screen.getByText('Cargando...');

		expect(testLabel).toBeInTheDocument();
	});

	it('renders correctly with a set label', () => {
		render(() => <Loading label='Loading...' />);

		const testLabel = screen.getByText('Loading...');

		expect(testLabel).toBeInTheDocument();
	});
});
