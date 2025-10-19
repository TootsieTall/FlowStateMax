import { redirect } from 'next/navigation'

export default function SignupPage() {
  // Redirect to onboarding where the proper auth form is
  redirect('/onboarding')
}
