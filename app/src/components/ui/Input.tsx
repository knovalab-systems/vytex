import type { Component, ComponentProps } from 'solid-js';
import { splitProps } from 'solid-js';

import { cn } from '~/lib/utils';

const Input: Component<ComponentProps<'input'>> = props => {
	const [, rest] = splitProps(props, ['type', 'class']);
	return (
		<>
			<input
				type={props.type}
				class={cn(
					props['aria-errormessage']
						? 'w-full p-2 border text-sm border-gray-300 rounded-md outline-none ring-2 ring-red-600 transition-colors duration-300'
						: 'w-full p-2 border text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300',
					props.class,
				)}
				{...rest}
			/>
			{props['aria-errormessage'] && <div class={'text-sm text-red-600'}>{props['aria-errormessage']}</div>}
		</>
	);
};

export { Input };
