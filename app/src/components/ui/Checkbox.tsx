import { type JSX, Show, splitProps } from 'solid-js';

type CheckboxProps = {
	ref: (element: HTMLInputElement) => void;
	name: string;
	value?: string;
	checked?: boolean;
	onInput: JSX.EventHandler<HTMLInputElement, InputEvent>;
	onChange: JSX.EventHandler<HTMLInputElement, Event>;
	onBlur: JSX.EventHandler<HTMLInputElement, FocusEvent>;
	required?: boolean;
	class?: string;
	label: string;
	error?: string;
	padding?: 'none';
};

/**
 * Checkbox that allows users to select an option. The label next to the
 * checkbox describes the selection option.
 */
export function Checkbox(props: CheckboxProps) {
	const [, inputProps] = splitProps(props, ['class', 'value', 'label', 'error', 'padding']);
	return (
		<div class={props.class}>
			<label for={props.name} class='flex select-none space-x-2'>
				<input
					{...inputProps}
					class='mt-1 h-4 min-w-4 cursor-pointer'
					type='checkbox'
					id={props.name}
					placeholder={props.label}
					value={props.value || ''}
					checked={props.checked}
					aria-invalid={!!props.error}
					aria-errormessage={`${props.name}-error`}
				/>
				<span>{props.label}</span>{' '}
				{props.required && <span class='ml-1 my-auto text-red-600 dark:text-red-400'>*</span>}
			</label>
			<Show when={Boolean(props.error)}>
				<div class={'text-sm text-red-600'}>{props.error}</div>
			</Show>
		</div>
	);
}
