'use server';

import { setAdminSession, clearAdminSession } from '@/lib/admin-auth';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  const validUsername = process.env.ADMIN_USERNAME ?? 'admin';
  const validPassword = process.env.ADMIN_PASSWORD ?? 'solevault2024';

  if (username === validUsername && password === validPassword) {
    await setAdminSession();
    return { success: true };
  }

  return { error: 'Invalid username or password' };
}

export async function logoutAction() {
  await clearAdminSession();
  redirect('/admin/login');
}
