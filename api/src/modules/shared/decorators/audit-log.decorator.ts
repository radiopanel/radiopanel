import { SetMetadata } from '@nestjs/common';

export const AuditLog = (eventName: string) => SetMetadata('auditLog', eventName);
