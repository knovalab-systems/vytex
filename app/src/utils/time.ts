import type { Time } from '@internationalized/date';

export function convertTo12(time: string) {
	// Split hours, minutes m seconds
	let [hours, minutes] = time.split(':').map(Number);

	// AM o PM
	const period = hours >= 12 ? 'PM' : 'AM';

	// Convert time from 24 to 12
	hours = hours % 12 || 12;

	// Format hours n minutes
	const formattedTime = `${hours}:${minutes < 10 ? `0${minutes}` : minutes} ${period}`;

	return formattedTime;
}

export function convertTimeTo12(time: Time) {
	return convertTo12(time.toString());
}
