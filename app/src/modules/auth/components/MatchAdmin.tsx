import type { RouteSectionProps } from '@solidjs/router';
import { ADMIN_ROLE } from '~/utils/env';
import MatchRole from './MatchRole';

export default function MatchAdmin(props: RouteSectionProps) {
	return <MatchRole role={ADMIN_ROLE}>{props.children}</MatchRole>;
}
