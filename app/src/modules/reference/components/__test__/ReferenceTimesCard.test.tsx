import { render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import { DEFAULT_TIME_BY_TASK, TASKS_RECORD } from '~/constants/tasks';
import type { TimeByTask } from '~/types/core';
import ReferenceTimesCard from '../ReferenceTimesCard';

describe('UserCard', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly ', () => {
		render(() => <ReferenceTimesCard times={DEFAULT_TIME_BY_TASK as TimeByTask} />);
		const title = screen.getByText('Tiempos por tarea');
		const fields = screen.getAllByText('0 seg');

		const supportTitles = Object.values(TASKS_RECORD).map(e => screen.getByText(e.label));

		expect(fields).length(22);
		expect(supportTitles).length(22);
		expect(title).toBeInTheDocument();
	});
});
