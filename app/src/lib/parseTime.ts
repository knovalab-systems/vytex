import dayjs from 'dayjs';

export function parseDateTimeHuman(dateTime?: string | null) {
	if (dateTime) {
		const date = dayjs(dateTime).format('YYYY-MM-DD hh:mm A');

		return date;
	}
	return '';
}

/**
 * Get the between date with start n end of day on iso string
 * @param dateTime
 * @returns
 */
export function getBetweenDay(dateTime: dayjs.Dayjs): [string, string] {
	const start = dateTime.startOf('d');
	const end = dateTime.endOf('d');
	return [start.toISOString(), end.toISOString()];
}
