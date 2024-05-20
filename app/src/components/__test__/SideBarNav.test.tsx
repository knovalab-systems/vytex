import { fireEvent, render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NavPages } from '../NavWrapper';
import SideBarNav from '../SideBarNav';

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

describe('SideBarNav', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly on zero pages', () => {
		render(() => <SideBarNav pages={[]} />);

		const testText = screen.getByText('Vytex');

		expect(testText).toBeInTheDocument();
	});

	it('renders correctly with pages', () => {
		const pages: NavPages[] = [{ name: 'Usuario', path: '/', icon: () => <div /> }];
		render(() => <SideBarNav pages={pages} />);

		const testPageText = screen.getByText('/');

		expect(testPageText).toBeInTheDocument();
	});

	it('calls A correctly', () => {
		const pages: NavPages[] = [{ name: 'Usuario', path: '/', icon: () => <div /> }];
		render(() => <SideBarNav pages={pages} />);

		const A = screen.getByText('/');
		fireEvent.click(A);

		expect(MockA).toHaveBeenCalledOnce();
	});

	it('calls LogOut correctly', () => {
		const pages: NavPages[] = [{ name: 'Usuario', path: '/', icon: () => <div /> }];
		render(() => <SideBarNav pages={pages} />);

		const logOut = screen.getByText('LogOut');
		fireEvent.click(logOut);

		expect(MockLogOut).toHaveBeenCalledOnce();
	});
});
