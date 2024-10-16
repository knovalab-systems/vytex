import type { Component, JSX, ValidComponent } from 'solid-js';
import { splitProps } from 'solid-js';

import type { PolymorphicProps } from '@kobalte/core/polymorphic';
import * as TabsPrimitive from '@kobalte/core/tabs';

import { cn } from '~/lib/utils';

type TabsProps = TabsPrimitive.TabsRootProps & { class?: string; children?: JSX.Element };

const Tabs: Component<TabsProps> = props => {
    const [local, others] = splitProps(props, ['class', 'children']);
    return (
        <TabsPrimitive.Root class={cn('', local.class)} {...others}>
            {local.children}
        </TabsPrimitive.Root>
    );
};

type TabsListProps = TabsPrimitive.TabsListProps & { class?: string; children?: JSX.Element };

const TabsList: Component<TabsListProps> = props => {
    const [local, others] = splitProps(props, ['class', 'children']);
    return (
        <TabsPrimitive.List class={cn('relative flex bg-gray-50 border-gray-300', local.class)} {...others}>
            {local.children}
        </TabsPrimitive.List>
    );
};

type TabsTriggerProps<T extends ValidComponent = 'button'> = TabsPrimitive.TabsTriggerProps<T> & {
    class?: string | undefined;
};

const TabsTrigger = <T extends ValidComponent = 'button'>(props: PolymorphicProps<T, TabsTriggerProps<T>>) => {
    const [local, others] = splitProps(props as TabsTriggerProps, ['class']);
    return (
        <TabsPrimitive.Trigger
            class={cn(
                'inline-block px-4 py-2 outline-none bg-blue-300 text-white hover:bg-green-400',
                'data-[selected]:bg-green-600',
                local.class
            )}
            {...others}
        />
    );
};

type TabsIndicatorProps = TabsPrimitive.TabsIndicatorProps & { class?: string | undefined };

const TabsIndicator: Component<TabsIndicatorProps> = props => {
    const [local, others] = splitProps(props, ['class']);
    return (
        <TabsPrimitive.Indicator
            class={cn('absolute bg-red-500 transition-all duration-350', local.class)}
            {...others}
        />
    );
};

type TabsContentProps<T extends ValidComponent = 'div'> = TabsPrimitive.TabsContentProps<T> & {
    class?: string | undefined;
};

const TabsContent = <T extends ValidComponent = 'div'>(props: PolymorphicProps<T, TabsContentProps<T>>) => {
    const [local, others] = splitProps(props as TabsContentProps, ['class']);
    return (
        <TabsPrimitive.Content
            class={cn('p-2', local.class)}
            {...others}
        />
    );
};

export { Tabs, TabsList, TabsTrigger, TabsIndicator, TabsContent };