import { type SubmitHandler, createForm, valiForm } from '@modular-forms/solid';
import { useNavigate } from '@solidjs/router';
import toast from 'solid-toast';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Label } from '~/components/ui/Label';
import { STATUS_CODE } from '~/constants/http';
import { COLORS_PATH } from '~/constants/paths';
import { createColorRequest } from '../requests/colorsCreateRequests';
import { ColorCreateSchema, type ColorCreateType } from '../schemas/colorCreateSchema';

function ColorCreateForm() {
	const navigate = useNavigate();

	const [form, { Form, Field }] = createForm<ColorCreateType>({
		validate: valiForm(ColorCreateSchema),
		initialValues: { name: '', hex: '', code: '' },
	});

	const handleSubmit: SubmitHandler<ColorCreateType> = async data => {
		const color = { ...data, hex: `#${data.hex}` };
		return createColorRequest(color)
			.then(() => {
				toast.success('Color creado correctamente');
				navigate(COLORS_PATH);
			})
			.catch(error => {
				if (error.response.status === STATUS_CODE.conflict) {
					toast.error(`El código "${data.code}" no está disponible. Intente con otro.`);
				} else {
					toast.error('Error al crear color');
				}
			});
	};

	const handleCancel = () => navigate(COLORS_PATH);

	return (
		<Form class='w-full lg:w-2/5 2xl:w-1/4' onSubmit={handleSubmit}>
			<div class='flex flex-col justify-center gap-4 p-8 m-4 bg-white rounded-md border border-gray-100 shadow-md'>
				<h1 class='text-2xl font-bold text-center'>Crear color</h1>
				<Field name='name'>
					{(field, props) => (
						<div>
							<Label for='name-field'>Nombre</Label>
							<Input
								placeholder='Blanco'
								autocomplete='off'
								id='name-field'
								aria-errormessage={field.error}
								required
								value={field.value}
								{...props}
							/>
						</div>
					)}
				</Field>
				<Field name='code'>
					{(field, props) => (
						<div>
							<Label for='code-field'>Código</Label>
							<Input
								placeholder='2322'
								autocomplete='off'
								id='code-field'
								aria-errormessage={field.error}
								required
								value={field.value}
								{...props}
							/>
						</div>
					)}
				</Field>
				<Field name='hex'>
					{(field, props) => (
						<div>
							<Label for='hex-field'>Hexadecimal del color</Label>
							<div class='flex gap-2'>
								<span
									class='py-2  px-4 h-full text-sm w-4 rounded-md border'
									style={{ background: `#${field.value || 'FFFFFF'}` }}
								>
									&nbsp
								</span>
								<span class='p-2 h-full text-sm rounded-md border'>#</span>
								<div class='w-full'>
									<Input
										placeholder='FFFFFF'
										autocomplete='off'
										id='hex-field'
										aria-errormessage={field.error}
										required
										value={field.value}
										{...props}
									/>
								</div>
							</div>
						</div>
					)}
				</Field>
			</div>
			<div class='flex justify-between m-4'>
				<Button type='button' onclick={handleCancel} class='bg-red-500 hover:bg-red-600'>
					Cancelar
				</Button>
				<Button type='submit' disabled={form.submitting} class='bg-green-600 hover:bg-green-700'>
					Guardar
				</Button>
			</div>
		</Form>
	);
}

export default ColorCreateForm;
