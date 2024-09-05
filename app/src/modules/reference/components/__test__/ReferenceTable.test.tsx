import { render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import type { GetReferenceType } from '../../requests/referenceGet';
import ReferenceTable from '../ReferenceTable';

const actions = (reference: string | number) => <div title={reference.toString()}>actions</div>;

describe('Reference Table', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly on empty references', () => {
		render(() => <ReferenceTable references={undefined} actions={actions} />);
		const tableHeader = screen.getByText('No se han encontrado referencias.');

		expect(tableHeader).toBeInTheDocument();
	});

	it('renders correctly on references', () => {
		const references: GetReferenceType = [
			{
				id: 123,
				code: 'REF001',
				deleted_at: null,
			},
		];

		render(() => <ReferenceTable references={references} actions={actions} />);
		const referenceId = screen.getByText('123');
		const referenceCode = screen.getByText('REF001');
		const referenceStatus = screen.getByText('Activo');

		expect(referenceId).toBeInTheDocument();
		expect(referenceCode).toBeInTheDocument();
		expect(referenceStatus).toBeInTheDocument();
	});
});
