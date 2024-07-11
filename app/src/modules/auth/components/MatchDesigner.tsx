import type { RouteSectionProps } from '@solidjs/router';
import MatchRole from './MatchRole';
import { DESIGNER_ROLE } from '~/envs/roles';

export default function MatchDesigner(props: RouteSectionProps) {
	return <MatchRole role={DESIGNER_ROLE}>{props.children}</MatchRole>;
}
