import { type CreateQueryResult, createQuery } from '@tanstack/solid-query';
import { readSteps } from '@vytex/client';
import { type Accessor, type JSXElement, createContext, createMemo, createSignal, useContext } from 'solid-js';
import { client } from '~/lib/client';

const queryKey = 'stepsContext';

const StepsContext = createContext<StepsContext>({
	stepsQuery: {} as CreateQueryResult<Steps>,
	setActive: () => {},
	getStepByValue: () => undefined,
	getTasks: () => [],
	getTasksRecord: () => ({}),
});

async function stepsContextRequest() {
	return await client.request(
		readSteps({
			limit: -1,
			fields: ['*', 'tasks'],
		}),
	);
}

export type Steps = Awaited<ReturnType<typeof stepsContextRequest>>;

type Step = Steps[number];

export type Tasks = Step['tasks'];

type StepsContext = {
	stepsQuery: CreateQueryResult<Steps>;
	setActive: () => void;
	getStepByValue: (value: Step['value']) => Step | undefined;
	getTasks: Accessor<Tasks>;
	getTasksRecord: Accessor<TasksRecord>;
};

type TasksRecord = Record<number, Tasks[number]>;

export function StepsProvider(props: { children: JSXElement }) {
	const [enabled, setEnabled] = createSignal(false);
	const stepsQuery = createQuery(() => ({
		queryFn: stepsContextRequest,
		queryKey: [queryKey],
		staleTime: Number.POSITIVE_INFINITY,
		enabled: enabled(),
	}));

	const setActive = () => {
		setEnabled(true);
	};

	const getStepByValue = (value: Step['value']) => stepsQuery.data?.find(e => e.value === value);

	const getTasks = createMemo(
		() =>
			stepsQuery.data?.reduce((p: Tasks, v) => {
				if (v.tasks) {
					const array = p.concat(v.tasks);
					return array;
				}
				return p;
			}, []) ?? [],
		[],
	);

	const getTasksRecord = createMemo(() => {
		const obj = getTasks().reduce((p: TasksRecord, v) => {
			p[v.id] = v;
			return p;
		}, {});
		return obj || {};
	});

	const values: StepsContext = { stepsQuery, setActive, getStepByValue, getTasks, getTasksRecord };

	return <StepsContext.Provider value={values}>{props.children}</StepsContext.Provider>;
}

export function useSteps() {
	const context = useContext(StepsContext);
	context.setActive();
	return context;
}
