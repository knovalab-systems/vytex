import { For } from 'solid-js';
import { TASKS, TASKS_RECORD } from '~/constants/tasks';
import type { TimeByTask } from '~/types/core';

function ReferenceTimesCard(props: { times: Omit<TimeByTask, 'id'> }) {
	return (
		<div class='p-8 m-4 gap-4 bg-white border-gray-100 shadow-md rounded-md border'>
			<h1 class='text-2xl font-bold text-center mb-4'>Tiempos por tarea</h1>
			<div class='grid grid-cols-4 gap-2'>
				<For each={TASKS}>
					{time => (
						<ValuesWithTitles
							support={TASKS_RECORD[time as keyof typeof TASKS_RECORD].label}
							title={`${props.times[time as keyof typeof props.times]} seg`}
						/>
					)}
				</For>
			</div>
		</div>
	);
}

function ValuesWithTitles(props: { support?: string; title?: string | null }) {
	return (
		<>
			<div class='flex-1 space-y-1'>
				<p class='font-medium leading-none'>{props.title || 'Title'}</p>
				<p class='text-sm text-muted-foreground'>{props.support || 'support'}</p>
			</div>
		</>
	);
}

export default ReferenceTimesCard;
