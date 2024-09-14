import { type SubmitHandler, createForm, valiForm } from '@modular-forms/solid';
import { useNavigate } from '@solidjs/router';
import { For } from 'solid-js';
import toast from 'solid-toast';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Label } from '~/components/ui/Label';
import { REFS_PRO_SUPERVISOR_PATH } from '~/constants/paths';
import { TASKS, TASKS_RECORD } from '~/constants/tasks';
import type { TimeByTask } from '~/types/core';
import type { GetReferenceForTimesType } from '../requests/referenceGet';
import { updateTimesRefenceRequest } from '../requests/referenceTimesUpdate';
import { ReferenceTimesUpdateSchema, type ReferenceTimesUpdateType } from '../schemas/referenceTimesUpdate';
import CancelButton from '~/components/CancelButton';

function ReferenceTimesUpdate(props: { reference: GetReferenceForTimesType }) {
	const navigate = useNavigate();
	const [form, { Form, Field }] = createForm<ReferenceTimesUpdateType>({
		validate: valiForm(ReferenceTimesUpdateSchema),
		initialValues: (({ id, ...o }) => o)(props.reference.time_by_task ?? { id: 1 }),
	});

	const handleSubmit: SubmitHandler<ReferenceTimesUpdateType> = async data => {
		const times: Partial<TimeByTask> = data;

		return updateTimesRefenceRequest(props.reference.id, { time_by_task: times })
			.then(() => {
				toast.success('Tiempos actualizados correctamente');
				navigate(REFS_PRO_SUPERVISOR_PATH);
			})
			.catch(() => {
				toast.error('Error al actualizar tiempos.');
			});
	};

	return (
		<Form class='w-full md:w-4/6 xl:w-2/5' onSubmit={handleSubmit}>
			<div class='flex flex-col justify-center gap-4 p-8 m-4 bg-white rounded-md border border-gray-100 shadow-md'>
				<div>
					<h1 class='text-2xl font-bold text-center'>Actualizar tiempos de la referencia</h1>
					<p>
						El tiempo se ingresado debe ser en <strong>segundos</strong>.
					</p>
				</div>

				<div class='grid grid-cols-4 gap-3'>
					<For each={TASKS}>
						{e => (
							<Field name={e} type='number'>
								{(field, props) => (
									<div>
										<Label for={`composition-field-${e}`}>{TASKS_RECORD[e as keyof typeof TASKS_RECORD].label}</Label>
										<Input
											type='number'
											placeholder='90'
											autocomplete='off'
											id={`composition-field-${e}`}
											aria-errormessage={field.error}
											required
											value={field.value}
											{...props}
										/>
									</div>
								)}
							</Field>
						)}
					</For>
				</div>
			</div>
			<div class='flex justify-between m-4'>
				<CancelButton to={REFS_PRO_SUPERVISOR_PATH} />
				<Button type='submit' disabled={form.submitting || !form.dirty} variant='success'>
					Actualizar
				</Button>
			</div>
		</Form>
	);
}

export default ReferenceTimesUpdate;
