import type { Component, ComponentProps } from 'solid-js';
import { splitProps } from 'solid-js';

import { cn } from '~/lib/utils';

const Label: Component<ComponentProps<'label'>> = props => {
	const [, rest] = splitProps(props, ['class']);
	return (
		<label
			class={cn(
				'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
				props.class,
			)}
			{...rest}
		/>
	);
};

const LabelSpan: Component<ComponentProps<'span'>> = props => {
	const [, rest] = splitProps(props, ['class']);
	return (
		<span
			class={cn(
				'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
				props.class,
			)}
			{...rest}
		/>
	);
};

export { Label, LabelSpan };
