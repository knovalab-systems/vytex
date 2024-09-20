export function getStateTask(params: { finished_at: string; rejected_at: string; started_at: string }) {
	if (params.finished_at) {
		return 'Terminada';
	}
	if (params.rejected_at) {
		return 'Rechazada';
	}
	if (params.started_at) {
		return 'Iniciada';
	}
	return 'Creada';
}
