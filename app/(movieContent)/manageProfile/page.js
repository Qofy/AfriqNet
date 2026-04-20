import { verifyAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getUserById } from '@/lib/db.server';
import ManageProfileClient from '@/component/ManageProfile.client';

export default async function ManageProfilePage() {
  const { session } = await verifyAuth();
  
  if (!session) {
    redirect('/login');
  }

  const user = getUserById(session.userId);
  
  if (!user) {
    redirect('/login');
  }

  return <ManageProfileClient user={user} />;
}
