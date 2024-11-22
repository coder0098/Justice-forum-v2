import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import SignInForm from './SignInForm'
import Link from 'next/link'

export default async function SignIn() {
  try {
    const supabase = createServerComponentClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    // If already authenticated, redirect to home
    if (session) {
      redirect('/')
    }

    return (
      <div className="flex min-h-screen flex-col items-center justify-center py-2 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          <div>
            <Link href="/" className="block">
              <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900">
                Justice Forum
              </h1>
            </Link>
            <h2 className="mt-6 text-center text-2xl font-semibold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your email to receive a secure sign-in link
            </p>
          </div>
          <SignInForm />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Sign-in page error:', error)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center py-2 bg-gray-50">
        <div className="text-red-600">
          An error occurred. Please try again later.
          <Link href="/" className="block mt-4 text-indigo-600 hover:text-indigo-500">
            Return to home
          </Link>
        </div>
      </div>
    )
  }
}
