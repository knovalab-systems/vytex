import { type CreateQueryResult, createQuery } from '@tanstack/solid-query';
import { readTaskControlStatus } from '@vytex/client';
import { type Accessor, type JSXElement, createContext, createMemo, createSignal, useContext } from 'solid-js';
import { client } from '~/lib/client';

const queryKey = 'taskControlStatusContext';

const TaskControlStatusContext = createContext<TaskControlStatusContext>({
	taskControlStatusQuery: {} as CreateQueryResult<TaskControlStatus>,
	getTaskControlStatusRecord: () => ({}),
	getTaskControlStatus: () => [],
	setActive: () => {},
	getStateByValue: () => undefined,
});

async function taskControlStatusContextRequest() {
	return await client.request(
		readTaskControlStatus({
			limit: -1,
		}),
	);
}

export type TaskControlStatus = Awaited<ReturnType<typeof taskControlStatusContextRequest>>;

type TaskControlState = TaskControlStatus[number];

type TaskControlStatusRecord = Record<number, TaskControlState>;

type TaskControlStatusContext = {
	taskControlStatusQuery: CreateQueryResult;
	getTaskControlStatusRecord: Accessor<TaskControlStatusRecord>;
	getTaskControlStatus: Accessor<TaskControlStatus>;
	setActive: () => void;
	getStateByValue: (value: TaskControlState['value']) => TaskControlState | undefined;
};

export function TaskControlStatusProvider(props: { children: JSXElement }) {
	const [enabled, setEnabled] = createSignal(false);
	const taskControlStatusQuery = createQuery(() => ({
		queryFn: taskControlStatusContextRequest,
		queryKey: [queryKey],
		staleTime: Number.POSITIVE_INFINITY,
		enabled: enabled(),
	}));

	const getTaskControlStatus = () => taskControlStatusQuery.data || [];

	const getTaskControlStatusRecord = createMemo(() => {
		const obj = getTaskControlStatus().reduce((p: TaskControlStatusRecord, v) => {
			p[v.id] = v;
			return p;
		}, {});
		return obj || {};
	});

	const getStateByValue = (value: TaskControlState['value']) => getTaskControlStatus().find(e => e.value === value);

	const setActive = () => {
		setEnabled(true);
	};

	const values: TaskControlStatusContext = {
		getTaskControlStatus,
		taskControlStatusQuery,
		getTaskControlStatusRecord,
		setActive,
		getStateByValue,
	};

	return <TaskControlStatusContext.Provider value={values}>{props.children}</TaskControlStatusContext.Provider>;
}

export function useTaskControlStatus() {
	const context = useContext(TaskControlStatusContext);
	context.setActive();
	return context;
}
