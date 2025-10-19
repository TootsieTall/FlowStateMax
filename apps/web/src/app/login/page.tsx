import { redirect } from 'next/navigation'

export default function LoginPage() {
  // Redirect to onboarding where the proper auth form is
  redirect('/onboarding')
}
