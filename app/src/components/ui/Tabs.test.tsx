import { fireEvent, render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger } from './Tabs';

describe('Tabs', () => {
    test('renders tabs correctly', () => {
        render(
            () =>
                <Tabs value='test'>
                    <TabsList>
                        <TabsTrigger value='test'>test</TabsTrigger>
                    </TabsList>
                    <TabsContent value='test'>test content</TabsContent>
                </Tabs>

        );

        expect(screen.getByText('test')).toBeInTheDocument();
    });

    test('renders TabsContent components', () => {
        render(
            () =>
                <Tabs value='test'>
                    <TabsList>
                        <TabsTrigger value='test'>test</TabsTrigger>
                    </TabsList>
                    <TabsContent value='test'>test content</TabsContent>
                </Tabs>
        );

        expect(screen.getByText('test content')).toBeInTheDocument();
    });

    test('changes tabs on click', () => {
        render(
            () =>
                <Tabs value='test'>
                    <TabsList>
                        <TabsTrigger value='test'>test</TabsTrigger>
                        <TabsTrigger value='test2'>test2</TabsTrigger>
                    </TabsList>
                    <TabsContent value='test'>test content</TabsContent>
                    <TabsContent value='test'>test2 content</TabsContent>
                </Tabs>
        );

        fireEvent.click(screen.getByText('test'));
        expect(screen.getByText('test content')).toBeInTheDocument();

        fireEvent.click(screen.getByText('test2'));
        expect(screen.getByText('test2 content')).toBeInTheDocument();
    });
});