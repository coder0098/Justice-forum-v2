import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import SignOutButton from '../components/SignOutButton'

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
        <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-800">
              Justice Forum
            </h1>
            <p className="mt-4 text-gray-600">
              A platform for justice collaboration
            </p>
          </div>
          <div>
            <Link
              href="/auth/signin"
              className="block w-full text-center py-3 px-4 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <SignOutButton />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2 bg-white shadow-md rounded-lg p-6">
            <div className="border-b pb-4 mb-4">
              <h2 className="text-xl font-medium text-gray-900">Welcome to Justice Forum</h2>
              <p className="mt-2 text-sm text-gray-600">
                You are signed in as <span className="font-semibold text-gray-800">{session.user.email}</span>.
              </p>
            </div>
            <p className="text-gray-700">
              Use the sidebar to invite new members to the platform. They will receive an email with a secure link to join.
            </p>
          </div>
          <div className="bg-indigo-600 text-white rounded-lg shadow-md p-6 flex flex-col justify-between">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/invite"
                  className="block py-2 px-4 bg-indigo-700 hover:bg-indigo-800 rounded-lg text-center"
                >
                  Invite Members
                </Link>
              </li>
              <li>
                <Link
                  href="/settings"
                  className="block py-2 px-4 bg-indigo-700 hover:bg-indigo-800 rounded-lg text-center"
                >
                  Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
