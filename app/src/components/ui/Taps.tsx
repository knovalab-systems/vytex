import type { Component, JSX, ValidComponent } from 'solid-js';
import { splitProps } from 'solid-js';

import type { PolymorphicProps } from '@kobalte/core/polymorphic';
import * as TabsPrimitive from '@kobalte/core/tabs';

import { cn } from '~/lib/utils';

type TabsProps = TabsPrimitive.TabsRootProps & { children?: JSX.Element };

const Tabs: Component<TabsProps> = props => {
    return <TabsPrimitive.Root {...props} />;
};

type TabsListProps = TabsPrimitive.TabsListProps & { class?: string; children?: JSX.Element };

const TabsList: Component<TabsListProps> = props => {
    const [local, others] = splitProps(props, ['class', 'children']);
    return (
        <TabsPrimitive.List class={cn('flex justify-start space-x-1', local.class)} {...others}>
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
                'px-4 py-2 bg-[#5084ed] text-white rounded-md transition-colors duration-200',
                'hover:bg-[#3b6bd4]',
                'data-[selected]:bg-green-500',
                local.class
            )}
            {...others}
        />
    );
};

const TabsIndicator: Component<TabsPrimitive.TabsIndicatorProps> = props => {
    return <TabsPrimitive.Indicator {...props} />;
};

type TabsContentProps<T extends ValidComponent = 'div'> = TabsPrimitive.TabsContentProps<T> & {
    class?: string | undefined;
};

const TabsContent = <T extends ValidComponent = 'div'>(props: PolymorphicProps<T, TabsContentProps<T>>) => {
    const [local, others] = splitProps(props as TabsContentProps, ['class']);
    return (
        <TabsPrimitive.Content
            class={cn('tab-content-class', local.class)}
            {...others}
        />
    );
};

export { Tabs, TabsList, TabsTrigger, TabsIndicator, TabsContent };