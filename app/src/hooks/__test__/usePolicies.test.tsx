import { render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import { PoliciesProvider, usePolicies } from '../usePolicies';

const TestElement = () => {
	const { hasPolicy } = usePolicies();
	return <div>{hasPolicy('ReadUsers') ? 'Has policy' : 'No has policy'}</div>;
};

const TestElementArray = () => {
	const { policies } = usePolicies();
	return <div>{policies().join(',')}</div>;
};

describe('usePolicies', () => {
	test('has policy is true', () => {
		render(() => (
			<PoliciesProvider policies={['CreateColors', 'ReadUsers']}>
				<TestElement />
			</PoliciesProvider>
		));

		const result = screen.getByText('Has policy');
		expect(result).toBeInTheDocument();
	});

	test('has policy is false', () => {
		render(() => (
			<PoliciesProvider policies={[]}>
				<TestElement />
			</PoliciesProvider>
		));

		const result = screen.getByText('No has policy');
		expect(result).toBeInTheDocument();
	});

	test('show list correclty', () => {
		render(() => (
			<PoliciesProvider policies={['CreateColors', 'ReadUsers']}>
				<TestElementArray />
			</PoliciesProvider>
		));

		const result = screen.getByText('CreateColors,ReadUsers');
		expect(result).toBeInTheDocument();
	});
});
