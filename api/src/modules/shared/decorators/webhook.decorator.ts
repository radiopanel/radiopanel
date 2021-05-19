import { SetMetadata } from '@nestjs/common';

export const Webhook = (webhook: string) => SetMetadata('webhook', webhook);
