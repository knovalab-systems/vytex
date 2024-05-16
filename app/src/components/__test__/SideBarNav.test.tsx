import { render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import type { JSXElement } from 'solid-js';
import { describe, expect, it, vi } from 'vitest';
import SideBarNav from '../SideBarNav';

interface Props {
	name: string;
	path: string;
	end?: boolean;
	icon: JSXElement;
}

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
	it('renders correctly on zero pages', () => {
		render(() => <SideBarNav pages={[]} />);

		const testText = screen.getByText('Vytex');

		expect(testText).toBeInTheDocument();
	});

	it('renders correctly with pages', () => {
		const pages: Props[] = [{ name: 'Usuario', path: '/', icon: <div /> }];
		render(() => <SideBarNav pages={pages} />);

		const testPageText = screen.getByText('/');

		expect(testPageText).toBeInTheDocument();
	});
});
