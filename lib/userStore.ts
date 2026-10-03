// In-memory customer credentials store for server-side auth fallback
export interface StoredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  createdAt: string;
}

// Global in-memory storage across API requests
const globalUsers = (globalThis as any).__zyle_users__ || new Map<string, StoredUser>();
if (!(globalThis as any).__zyle_users__) {
  (globalThis as any).__zyle_users__ = globalUsers;
  // Seed demo customer
  globalUsers.set('tushar@zyle.in', {
    id: 'usr_demo_1',
    name: 'Tushar Hota',
    email: 'tushar@zyle.in',
    phone: '9876543210',
    password: 'password123',
    createdAt: new Date().toISOString(),
  });
}

export function findUserByEmail(email: string): StoredUser | undefined {
  return globalUsers.get(email.toLowerCase().trim());
}

export function saveUser(user: StoredUser): void {
  globalUsers.set(user.email.toLowerCase().trim(), user);
}
