import { serve } from 'https://deno.fresh.dev/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { email } = await req.json()
    const signInLink = `${req.headers.get('origin')}/auth/signin`

    // Generate a secure invite token
    const { data: token, error: tokenError } = await supabaseClient
      .auth
      .admin
      .generateLink({
        type: 'magiclink',
        email,
        options: {
          redirectTo: `${req.headers.get('origin')}/auth/callback`,
        },
      })

    if (tokenError) throw tokenError

    // Send the invitation email
    const { error: emailError } = await supabaseClient
      .from('emails')
      .insert({
        to: email,
        subject: 'Invitation to Justice Forum',
        html: `
          <h2>You've been invited to Justice Forum</h2>
          <p>Click the link below to sign in:</p>
          <a href="${token.properties?.action_link}">${token.properties?.action_link}</a>
          <p>This link will expire in 24 hours.</p>
        `,
      })

    if (emailError) throw emailError

    return new Response(
      JSON.stringify({ message: 'Invitation sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
