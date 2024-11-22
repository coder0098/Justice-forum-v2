# Justice Forum - Edge Function Deployment

## Prerequisites
1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link your project (replace 'your-project-ref' with your Supabase project reference):
```bash
supabase link --project-ref your-project-ref
```

## Deploy Edge Function

1. Deploy the send-invite function:
```bash
supabase functions deploy send-invite
```

2. Set the required secrets for the function:
```bash
supabase secrets set SUPABASE_URL=your-project-url
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Testing Locally

To test the Edge Function locally:

1. Start the Supabase Edge Function locally:
```bash
supabase functions serve send-invite
```

2. The function will be available at:
```
http://localhost:54321/functions/v1/send-invite
```

## Function URL

After deployment, your function will be available at:
```
https://[your-project-ref].supabase.co/functions/v1/send-invite
```

Remember to update the InviteUsers component with your deployed function URL.
