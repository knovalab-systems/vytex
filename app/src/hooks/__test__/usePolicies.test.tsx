import { render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import { PoliciesProvider, usePolicies } from '../usePolicies';

const TestElement = () => {
	const { hasPolicy } = usePolicies();
	return <div>{hasPolicy('ReadUsers') ? 'Has policy' : 'No has policy'}</div>;
};

describe('usePolicies', () => {
	test('has policy is true', () => {
		render(() => (
			<PoliciesProvider policies={[0, 1, 2]}>
				<TestElement />
			</PoliciesProvider>
		));

		const result = screen.getByText('Has policy');
		expect(result).toBeInTheDocument();
	});

	test('has policy is false', () => {
		render(() => (
			<PoliciesProvider policies={[10, 5, 4]}>
				<TestElement />
			</PoliciesProvider>
		));

		const result = screen.getByText('No has policy');
		expect(result).toBeInTheDocument();
	});
});
