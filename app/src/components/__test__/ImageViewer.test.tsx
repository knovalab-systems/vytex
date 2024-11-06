import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import ImageViewer from '../ImageViewer';

describe('ImageViewer', () => {
    const src = 'https://via.placeholder.com/150/0000FF/808080 ?Text=PAKAINFO.com';
    const caption = 'Sample Image';

    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('renders correctly', () => {
        render(() => <ImageViewer src={src} caption={caption} />);
        const image = screen.getByAltText('Preview');
        const captionText = screen.getByText(caption);
        const expandButton = screen.getByText('Expandir');

        expect(image).toBeInTheDocument();
        expect(captionText).toBeInTheDocument();
        expect(expandButton).toBeInTheDocument();
    });

    it('toggles large view on button click', async () => {
        render(() => <ImageViewer src={src} caption={caption} />);
        const expandButton = screen.getByText('Expandir');
        fireEvent.click(expandButton);

        await waitFor(() => {
            const largeImage = screen.getByAltText('Large Preview');
            expect(largeImage).toBeInTheDocument();
        });

        const closeButton = screen.getByText('Cerrar');
        fireEvent.click(closeButton);

        await waitFor(() => {
            const largeImage = screen.queryByAltText('Large Preview');
            expect(largeImage).not.toBeInTheDocument();
        });
    });

    it('closes large view on close click', async () => {
        render(() => <ImageViewer src={src} caption={caption} />);
        const expandButton = screen.getByText('Expandir');
        fireEvent.click(expandButton);

        await waitFor(() => {
            const largeImage = screen.getByAltText('Large Preview');
            expect(largeImage).toBeInTheDocument();
        });

        // close
        const closeButton = screen.getByText('Cerrar');
        fireEvent.click(closeButton);

        await waitFor(() => {
            const largeImage = screen.queryByAltText('Large Preview');
            expect(largeImage).not.toBeInTheDocument();
        });
    });

    it('closes large view on escape key', async () => {
        render(() => <ImageViewer src={src} caption={caption} />);
        const expandButton = screen.getByText('Expandir');
        fireEvent.click(expandButton);

        await waitFor(() => {
            const largeImage = screen.getByAltText('Large Preview');
            expect(largeImage).toBeInTheDocument();
        });

        // close
        fireEvent.keyUp(document, { key: 'Escape' });

        await waitFor(() => {
            const largeImage = screen.queryByAltText('Large Preview');
            expect(largeImage).not.toBeInTheDocument
        });
    });
});