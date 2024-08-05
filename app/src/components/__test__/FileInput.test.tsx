import { createForm, required } from '@modular-forms/solid';
import { fireEvent, render, screen } from '@solidjs/testing-library';
import FileInput from '../FileInput';

const fileMock = (name: string, size: number, type: string) => {
	const file = new File([new Blob(['a'.repeat(size)])], name, { type });
	Object.defineProperty(file, 'size', { get: () => size });
	return file;
};

type WrapForm = {
	file: File;
};

// enviroment
const WrapForm = () => {
	const [_, { Form, Field }] = createForm<WrapForm>();

	return (
		<Form onSubmit={() => {}}>
			<Field name='file' type='File' validate={[required('Selecciona una archivo')]}>
				{(field, props) => <FileInput label='FileInput' required value={field.value} error={field.error} {...props} />}
			</Field>
			<button type='submit'>submit</button>
		</Form>
	);
};

describe('FileInput', () => {
	it('renders correctly', () => {
		render(() => <WrapForm />);

		const input = screen.getByTitle('FileInput');
		const label = screen.getByText('Arrastra y suelta aquí o selecciona un archivo');

		expect(input).toBeInTheDocument();
		expect(label).toBeInTheDocument();
	});

	it('checks change of input', async () => {
		render(() => <WrapForm />);

		const input = screen.getByTitle('FileInput');

		const file = fileMock('image.png', 1024 * 1024, 'image/png');
		fireEvent.input(input, { target: { files: [file] } });

		const newLabel = await screen.findByText('Archivo: image.png');
		const label = screen.queryByText('Arrastra y suelta aquí o selecciona un archivo');

		expect(input).toBeInTheDocument();
		expect(newLabel).toBeInTheDocument();
		expect(label).not.toBeInTheDocument();
	});

	it('shows error messages', async () => {
		render(() => <WrapForm />);

		const input = screen.getByTitle('FileInput');
		const submitButton = screen.getByText('submit');

		fireEvent.click(submitButton);

		const error = await screen.findByText('Selecciona una archivo');

		expect(input).toBeInTheDocument();
		expect(error).toBeInTheDocument();
	});
});
