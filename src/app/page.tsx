import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect anyone visiting the root domain directly to the admin dashboard
  redirect('/admin');
}
