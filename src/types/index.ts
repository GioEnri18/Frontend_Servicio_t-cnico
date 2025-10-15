
export type UserRole = 'admin' | 'employee' | 'customer';

export type UserStatus = 'active' | 'inactive' | 'pending_verification' | 'blocked';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  address?: string;
  company?: string;
  createdAt: string;
  updatedAt: string;
}
