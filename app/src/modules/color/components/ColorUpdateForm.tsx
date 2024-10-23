import { type SubmitHandler, createForm, setValue, valiForm } from '@modular-forms/solid';
import { useNavigate } from '@solidjs/router';
import { Show } from 'solid-js';
import toast from 'solid-toast';
import CancelButton from '~/components/CancelButton';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Label, LabelSpan } from '~/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/Select';
import { STATUS_CODE } from '~/constants/http';
import { COLORS_PATH } from '~/constants/paths';
import { STATUS_VALUES } from '~/constants/status';
import { refetchColors } from '~/hooks/useColors';
import type { Color } from '~/types/core';
import type { GetColorType } from '../requests/colorGet';
import { updateColorRequest } from '../requests/colorUpdate';
import { ColorUpdateSchema, type ColorUpdateType } from '../schemas/colorUpdate';

function ColorUpdateForm(props: { color?: GetColorType }) {
	const navigate = useNavigate();
	const [form, { Form, Field }] = createForm<ColorUpdateType>({
		validate: valiForm(ColorUpdateSchema),
		initialValues: {
			name: props.color?.name || '',
			code: props.color?.code || '',
			hex: props.color?.hex?.slice(1),
			deleted_at: !props.color?.deleted_at ? 'Activo' : 'Inactivo',
		},
	});

	const handleSubmit: SubmitHandler<ColorUpdateType> = async data => {
		const formatData = {
			...data,
			code: data.code,
			hex: `#${data.hex}`,
		};
		const { deleted_at, ...rest } = formatData;

		const color: Color = Object.keys(rest).reduce((p: Omit<Color, 'id'>, v) => {
			const field = rest[v as keyof typeof rest];
			const oldField = props.color?.[v as keyof typeof props.color];
			if (field && field !== oldField) {
				p[v as keyof typeof p] = field;
			}
			return p;
		}, {});

		if (deleted_at === 'Inactivo' && !props.color?.deleted_at) {
			color.deleted_at = new Date().toISOString();
		} else if (deleted_at === 'Activo' && Boolean(props.color?.deleted_at)) {
			color.deleted_at = null;
		}

		return updateColorRequest(props.color?.id || 0, color)
			.then(() => {
				refetchColors();
				toast.success('Color actualizado correctamente');
				navigate(COLORS_PATH);
			})
			.catch(error => {
				if (error.response.status === STATUS_CODE.conflict) {
					toast.error(`El código "${data.code}" no está disponible. Intente con otro.`);
				} else {
					toast.error('Error al actualizar color.');
				}
			});
	};

	return (
		<Form class='w-full md:w-4/6 xl:w-2/5' onSubmit={handleSubmit}>
			<div class='flex flex-col justify-center gap-4 p-8 m-4 bg-white rounded-md border border-gray-100 shadow-md'>
				<h1 class='text-2xl font-bold text-center'>Actualizar color</h1>
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
				<Field name='deleted_at'>
					{field => (
						<div>
							<LabelSpan>Estado</LabelSpan>
							<Select<string>
								value={field.value}
								onChange={value => {
									setValue(form, 'deleted_at', value);
								}}
								options={STATUS_VALUES}
								placeholder='Selecciona un estado'
								itemComponent={props => <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>}
							>
								<SelectTrigger aria-label='Estado' title='Ver estados'>
									<SelectValue<string>>{state => state.selectedOption()}</SelectValue>
								</SelectTrigger>
								<SelectContent />
								<Show when={Boolean(field.error)}>
									<div class={'text-sm my-auto text-red-600'}>{field.error}</div>
								</Show>
							</Select>
						</div>
					)}
				</Field>
			</div>
			<div class='flex justify-between m-4'>
				<CancelButton to={COLORS_PATH} />
				<Button type='submit' disabled={form.submitting || !form.dirty} variant='success'>
					Actualizar
				</Button>
			</div>
		</Form>
	);
}

export default ColorUpdateForm;
