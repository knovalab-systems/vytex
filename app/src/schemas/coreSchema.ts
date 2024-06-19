import type { CoreSchema, VytexColor, VytexUser } from '@vytex/client';

// take from client
export type User = Partial<VytexUser<CoreSchema>>;
export type Color = Partial<VytexColor<CoreSchema>>;
