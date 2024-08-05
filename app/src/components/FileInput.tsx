import { type JSX, Match, Switch, createMemo, splitProps } from 'solid-js';
import { cn } from '~/lib/utils';
import { Input } from './ui/Input';

type FileInputProps = {
	ref: (element: HTMLInputElement) => void;
	name: string;
	value?: File[] | File;
	onInput: JSX.EventHandler<HTMLInputElement, InputEvent>;
	onChange: JSX.EventHandler<HTMLInputElement, Event>;
	onBlur: JSX.EventHandler<HTMLInputElement, FocusEvent>;
	accept?: string;
	required?: boolean;
	preview?: boolean;
	multiple?: boolean;
	class?: string;
	label?: string;
	error?: string;
};

function FileInput(props: FileInputProps) {
	const [, inputProps] = splitProps(props, ['class', 'value', 'label', 'error', 'preview']);

	const getFiles = createMemo(() => (props.value ? (Array.isArray(props.value) ? props.value : [props.value]) : []));

	return (
		<label
			class={cn(
				'relative border-dashed border-[3px] border-slate-200 text-gray-500 cursor-pointer w-full h-full p-4 rounded-md text-center flex flex-col justify-center items-center hover:border-slate-400 focus-within:border-sky-600/50',
				props.error ? 'border-red-600' : '',
				props.class,
			)}
		>
			<Input
				{...inputProps}
				type='file'
				title={props.label}
				class='absolute h-full w-full opacity-0 cursor-pointer'
				id={props.name}
				aria-errormessage={props.error}
			/>
			<Switch
				fallback={
					<>
						Arrastra y suelta aquí o selecciona {!props.multiple && 'un'} archivo{props.multiple && 's'}
					</>
				}
			>
				<Match when={props.preview && getFiles().length && !props.multiple}>
					<figure class='flex flex-col items-center justify-center w-full h-full'>
						<div class='w-full h-full flex items-center justify-center overflow-hidden'>
							<img src={URL.createObjectURL(props.value as File)} alt='Preview' class='object-contain w-full h-full' />
						</div>
						<figcaption class='text-sm text-gray-500 my-2'>
							{getFiles()
								.map(({ name }) => name)
								.join(', ')}
						</figcaption>
					</figure>
				</Match>
				<Match when={getFiles().length}>
					Archivo{props.multiple && 's'}:{' '}
					{getFiles()
						.map(({ name }) => name)
						.join(', ')}
				</Match>
			</Switch>
		</label>
	);
}

export default FileInput;
