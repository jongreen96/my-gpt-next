import CreditsForm from '@/components/addCreditsForm';
import DefaultSettingsForm from '@/components/defaultSettingsForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getUser } from '@/lib/db/queries';
import { auth } from '@clerk/nextjs';

export const metadata = {
  title: 'Settings',
  description: 'Change your settings',
};

export default async function SettingsPage() {
  const { userId } = auth();
  const user = await getUser(userId);

  return (
    <div className='mx-auto flex max-w-7xl flex-col gap-8 p-2 pt-10'>
      <h1 className='text-center text-4xl font-bold tracking-tighter sm:text-left'>
        Settings
      </h1>

      <section className='flex flex-col gap-2 sm:flex-row'>
        <Card className='h-fit w-full'>
          <CardHeader className='text-center sm:text-left'>
            <CardTitle>Credits</CardTitle>
            <CardDescription>Manage your credits</CardDescription>
          </CardHeader>

          <CardContent>
            <CreditsForm credits={user.credits} />
          </CardContent>
        </Card>

        <Card className='h-fit w-full'>
          <CardHeader className='text-center sm:text-left'>
            <CardTitle>Defaults</CardTitle>
            <CardDescription>Manage your default settings</CardDescription>
          </CardHeader>

          <CardContent>
            <DefaultSettingsForm user={user} />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
