import { verifyAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getUserById } from '@/lib/db.server';
import AccountClient from '@/component/AccountClient';

export const metadata = {
  title: 'Account Settings - AfriqNet',
  description: 'Manage your account settings, security, and preferences',
};

export default async function AccountPage() {
  const { session, user } = await verifyAuth();
  
  if (!session || !user) {
    redirect('/login');
  }

  // Get fresh user data from database
  const userData = getUserById(user.id);
  
  if (!userData) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 mt-25">Account Settings</h1>
          <p className="text-gray-400">Manage your account preferences and security settings</p>
        </div>

        <AccountClient user={userData} />
      </div>
    </div>
  );
}
