import { fireEvent, render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import type { JSXElement } from 'solid-js';
import ActionsCell from '../ActionsCell';

const mockA = vi.fn();
vi.mock('@solidjs/router', () => ({
    A: (props: { children: JSXElement }) => {
        mockA();
        return <button type='button'>{props.children}</button>;
    },
}));

describe('ActionsCell', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('renders correctly', () => {
        render(() => <ActionsCell supplierId={1} />);

        const updateButton = screen.getByText('Actualizar');

        expect(updateButton).toBeInTheDocument();
    });

    it('calls the Updates correclty', () => {
        render(() => <ActionsCell supplierId={2} />);

        const updateButton = screen.getByText('Actualizar');
        fireEvent.click(updateButton);

        expect(mockA).toBeCalled();
    });

});
