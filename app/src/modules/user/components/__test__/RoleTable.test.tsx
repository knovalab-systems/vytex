import { render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import * as usePolicies from '~/hooks/usePolicies';
import type { Action } from '~/types/actionsCell';
import type { GetRolesType } from '../../requests/roleGet';
import RoleTable from '../RoleTable';

const hasPolicyMock = vi.fn();
vi.mock('~/components/ActionsCell', () => ({
	default: (props: { actions: Action[] }) => {
		return <td>{props.actions.length}</td>;
	},
}));

describe('Role Table', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly on empty roles', () => {
		render(() => <RoleTable roles={[]} />);
		const tableHeader = screen.getByText('No se han encontrado roles.');

		expect(tableHeader).toBeInTheDocument();
	});

	for (const testCase of [
		{ value: true, expect: 1, length: 1 },
		{ value: false, expect: 0, length: 2 },
	]) {
		it('renders correctly on roles', async () => {
			vi.spyOn(usePolicies, 'usePolicies').mockReturnValue({
				policies: () => [],
				hasPolicy: () => {
					hasPolicyMock();
					return testCase.value;
				},
			});
			const roles: GetRolesType = [
				{
					id: '123',
					name: 'role1',
					code: null,
				},
				{
					name: 'admin',
					id: 'adminid',
					code: 'admin',
				},
			];
			render(() => <RoleTable roles={roles} />);
			const roleId = screen.getByText('adminid');
			const roleName = screen.getByText('role1');
			const roleSystem = screen.getByText('Sistema');
			const roleCustom = screen.getByText('Personalizado');
			const actions = screen.getAllByText(testCase.expect);

			expect(roleId).toBeInTheDocument();
			expect(roleName).toBeInTheDocument();
			expect(roleSystem).toBeInTheDocument();
			expect(roleCustom).toBeInTheDocument();
			expect(actions).length(testCase.length);
		});
	}
});
