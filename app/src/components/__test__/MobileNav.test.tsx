import { fireEvent, render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import type { NavPages } from '~/modules/auth/components/NavWrapper';
import MobileNav from '../MobileNav';

const MockA = vi.fn();
vi.mock('@solidjs/router', () => ({
	A: (props: { href: string }) => {
		MockA();
		return <div>{props.href}</div>;
	},
}));

const MockLogOut = vi.fn();
vi.mock('~/modules/auth/components/LogoutNavButton', () => ({
	default: () => {
		MockLogOut();
		return <div>LogOut</div>;
	},
}));

describe('MobileNav', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly on zero pages', () => {
		render(() => <MobileNav pages={[]} />);

		const testText = screen.getByText('Cerrar');

		expect(testText).toBeInTheDocument();
	});

	it('renders correctly with pages', () => {
		const pages: NavPages[] = [{ name: 'Usuario', path: '/', icon: () => <div /> }];
		render(() => <MobileNav pages={pages} />);

		const testPageText = screen.getByText('/');

		expect(testPageText).toBeInTheDocument();
	});

	it('call A correctly', () => {
		const pages: NavPages[] = [{ name: 'Usuario', path: '/', icon: () => <div /> }];
		render(() => <MobileNav pages={pages} />);

		const A = screen.getByText('/');
		fireEvent.click(A);

		expect(MockA).toHaveBeenCalledOnce();
	});

	it('calls LogOut correctly', () => {
		const pages: NavPages[] = [{ name: 'Usuario', path: '/', icon: () => <div /> }];
		render(() => <MobileNav pages={pages} />);

		const logOut = screen.getByText('LogOut');
		fireEvent.click(logOut);

		expect(MockLogOut).toHaveBeenCalledOnce();
	});
});
