import { fireEvent, render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import MobileNav from '../MobileNav';
import type { NavPages } from '../NavWrapper';

const AMock = vi.fn();
vi.mock('@solidjs/router', () => ({
	A: (props: { href: string }) => {
		AMock();
		return <div>{props.href}</div>;
	},
}));

const MockLogOut = vi.fn();
vi.mock('~/components/LogoutNavButton', () => ({
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

		expect(AMock).toHaveBeenCalledOnce();
	});
});
