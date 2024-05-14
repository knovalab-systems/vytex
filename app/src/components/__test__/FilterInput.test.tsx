import { fireEvent, render, screen } from '@solidjs/testing-library'
import '@testing-library/jest-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import FilterInput from '../FilterInput'

// mocks
const setFilter = vi.fn();

describe('FilterInput', () => {

    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('renders correctly', () => {
        render(() => (
            <FilterInput
                filterValue=""
                setFilter={setFilter}
                placeholder="Filter"
            />
        ));

        const filterInput = screen.getByPlaceholderText('Filter');
        expect(filterInput).toBeInTheDocument();
    });

    it('should call setFilter when input changes', async () => {
        render(() => (
            <FilterInput
                filterValue=""
                setFilter={setFilter}
                placeholder="Filter"
            />
        ));

        fireEvent.input(screen.getByPlaceholderText('Filter'), { target: { value: 'John' } });
        await new Promise(resolve => setTimeout(resolve, 300));
        expect(setFilter).toHaveBeenCalledWith('John');
    });

    it('should call setFilter when pasting', async () => {
        render(() => (
            <FilterInput
                filterValue=""
                setFilter={setFilter}
                placeholder="Filter"
            />
        ));

        fireEvent.paste(screen.getByPlaceholderText('Filter'), { clipboardData: { getData: () => 'John' } });
        await new Promise(resolve => setTimeout(resolve, 300));
        expect(setFilter).toHaveBeenCalledWith('John');
    });
});