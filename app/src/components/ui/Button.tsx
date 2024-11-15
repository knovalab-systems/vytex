import { Button as ButtonPrimitive, type ButtonRootProps } from '@kobalte/core/button';
import type { PolymorphicProps } from '@kobalte/core/polymorphic';
import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import type { Component, ValidComponent } from 'solid-js';
import { splitProps } from 'solid-js';
import { cn } from '~/lib/utils';

const buttonVariants = cva(
	'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground hover:bg-primary/90',
				new: 'bg-new text-new-foreground hover:bg-new/80 font-bold',
				destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
				outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
				secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/70 border',
				ghost: 'hover:bg-accent hover:text-accent-foreground',
				link: 'text-primary underline-offset-4 hover:underline',
				success: 'bg-success text-success-foreground hover:bg-success/90',
				action: 'bg-action text-action-foreground hover:bg-action/90',
			},
			size: {
				default: 'h-10 px-4 py-2',
				sm: 'h-9 rounded-md px-3',
				lg: 'h-11 rounded-md px-8',
				icon: 'size-10',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

export type ButtonProps<T extends ValidComponent = 'button'> = PolymorphicProps<T, ButtonRootProps> &
	VariantProps<typeof buttonVariants>;

const Button: Component<ButtonProps> = props => {
	const [, rest] = splitProps(props, ['variant', 'size', 'class']);
	return (
		<ButtonPrimitive class={cn(buttonVariants({ variant: props.variant, size: props.size }), props.class)} {...rest} />
	);
};
export { Button, buttonVariants };
