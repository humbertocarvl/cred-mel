import bcrypt from 'bcryptjs';

export function hashPassword(password: string | undefined): Promise<string> {
  return bcrypt.hash(String(password ?? ''), 10);
}

export function comparePassword(password: string | undefined, hash: string): Promise<boolean> {
  return bcrypt.compare(String(password ?? ''), hash);
}
