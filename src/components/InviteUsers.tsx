'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type Invitation = {
  id: string
  email: string
  status: 'pending' | 'accepted'
  created_at: string
}

export default function InviteUsers() {
  const [email, setEmail] = useState('')
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchInvitations()
  }, [])

  const fetchInvitations = async () => {
    try {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching invitations:', error)
        return
      }

      setInvitations(data || [])
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      // First check if the email is already invited
      const { data: existingInvite, error: checkError } = await supabase
        .from('invitations')
        .select('*')
        .eq('email', email)
        .single()

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
        throw checkError
      }

      if (existingInvite) {
        setMessage('This email has already been invited')
        return
      }

      // Create the invitation record
      const { error: inviteError } = await supabase
        .from('invitations')
        .insert([{ 
          email, 
          status: 'pending',
          created_at: new Date().toISOString()
        }])

      if (inviteError) throw inviteError

      // Generate a sign-in link
      const { data: { user }, error: signInError } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: email,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      })

      if (signInError) throw signInError

      setMessage('Invitation created successfully! User will receive a sign-in link.')
      setEmail('')
      await fetchInvitations()
    } catch (error: any) {
      console.error('Error:', error)
      setMessage(`Error: ${error.message || 'Failed to create invitation'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Invite Users</h2>
      
      <form onSubmit={handleInvite} className="space-y-4">
        <div>
          <label htmlFor="invite-email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <div className="mt-1">
            <input
              type="email"
              id="invite-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              placeholder="Enter email address"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
        >
          {loading ? 'Sending...' : 'Send Invitation'}
        </button>

        {message && (
          <p className={`text-sm ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}
      </form>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700">Pending Invitations</h3>
        <ul className="mt-2 divide-y divide-gray-200">
          {invitations.map((invitation) => (
            <li key={invitation.id} className="py-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{invitation.email}</p>
                  <p className="text-sm text-gray-500">
                    Status: {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(invitation.created_at).toLocaleDateString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
