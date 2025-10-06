import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export default async function OnboardingStart() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to FlowState
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your deep work companion, inspired by Cal Newport's methodology
          </p>
          <blockquote className="text-lg italic text-gray-500 mb-8 border-l-4 border-primary pl-4">
            "Deep Work is the ability to focus without distraction on a cognitively demanding task.
            It's a skill that allows you to quickly master complicated information and produce better
            results in less time."
            <footer className="text-sm mt-2">— Cal Newport</footer>
          </blockquote>
          <a
            href="/api/auth/signin"
            className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors"
          >
            Get Started
          </a>
        </div>
      </div>
    )
  }
  
  redirect('/onboarding/goals')
}