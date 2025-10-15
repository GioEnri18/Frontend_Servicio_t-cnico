export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'login'
  | 'logout'
  | 'generate_report'
  | 'send_quotation'
  | 'update_quotation_status';

export interface AuditLog {
  id: string;
  action: AuditAction;
  entityName: string;
  entityId?: string;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  user?: { id: string; firstName: string; lastName: string; email: string; };
  userId?: string;
}
