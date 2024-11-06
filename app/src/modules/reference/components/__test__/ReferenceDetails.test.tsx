import { render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import { SIZES } from '~/constants/sizes';
import type { ColorByReference } from '~/types/core';
import ReferenceDetails from '../ReferenceDetails';

vi.mock('~/hooks/useColors', () => ({
    useColors: () => ({
        getColors: () => [
            { id: 1, name: 'Blanco', hex: '#FFFFFF', deleted_at: null },
            { id: 2, name: 'Negro', hex: '#000000', delete_at: null },
        ],
        getColorsRecord: () => ({
            1: { id: 1, name: 'Blanco', hex: '#FFFFFF' },
            2: { id: 2, name: 'Negro', hex: '#000000' },
        }),
    }),
}));

describe('ReferenceDetails', () => {

    beforeEach(() => {
        vi.resetAllMocks();
    });



    const colorsByReference: Omit<ColorByReference, 'id'>[] = [
        {
            color_id: 1,
            fabrics: [
                {
                    fabric: { name: 'Cotton', code: '123', color_id: 2 },
                    XS: 1,
                    S: 2,
                    M: 3,
                },
            ],
            resources: [
                {
                    resource: { name: 'Thread', code: '456', color_id: 2 },
                    XS: 4,
                    S: 5,
                    M: 6,
                },
            ],
        },
    ];

    it('renders correctly', () => {
        render(() => <ReferenceDetails colorsByReference={colorsByReference} refCode="1234" />);
        expect(screen.getByText('Referencia #1234')).toBeInTheDocument();
        expect(screen.getByText('Blanco')).toBeInTheDocument();
        expect(screen.getByText('Cotton - 123')).toBeInTheDocument();
        expect(screen.getByText('Thread - 456')).toBeInTheDocument();
    });

    it('displays correct color and sizes', () => {
        render(() => <ReferenceDetails colorsByReference={colorsByReference} refCode="1234" />);
        const colorDivs = screen.getAllByRole('img');
        expect(colorDivs[0]).toHaveStyle('background: #FFFFFF');
        expect(colorDivs[1]).toHaveStyle('background: #000000');

        for (const size of SIZES) {
            expect(screen.getByText(size)).toBeInTheDocument();
        }

        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.getByText('4')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('6')).toBeInTheDocument();
    });
});