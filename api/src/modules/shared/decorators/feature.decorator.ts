import { SetMetadata } from '@nestjs/common';

export const Feature = (feature: string) => SetMetadata('feature', feature);
