"use client";

import { useState, useEffect, useCallback } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type Invitation = {
  id: string;
  email: string;
  status: "pending" | "accepted";
  created_at: string;
};

export default function Sidebar() {
  const [email, setEmail] = useState("");
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false); // Super admin flag
  const supabase = createClientComponentClient();

  // Check if user is a super admin
  const checkIfSuperAdmin = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const adminEmail = "admin@justice-minds.com";
      setIsSuperAdmin(user?.email === adminEmail);
    } catch (error) {
      console.error("Error checking super admin status:", error);
    }
  }, [supabase]);

  // Fetch all invitations
  const fetchInvitations = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("invitations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching invitations:", error);
        return;
      }

      setInvitations(data || []);
    } catch (error) {
      console.error("Error:", error);
    }
  }, [supabase]);

  useEffect(() => {
    checkIfSuperAdmin();
    fetchInvitations();
  }, [checkIfSuperAdmin, fetchInvitations]);

  // Handle the invitation process
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      setMessage("Only the super admin can add participants.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Check if email already exists and is accepted
      const { data: existingInvite, error: checkError } = await supabase
        .from("invitations")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (checkError) {
        throw checkError;
      }

      if (existingInvite?.status === "accepted") {
        setMessage("This participant has already joined.");
        return;
      }

      // Generate a unique token for verification
      const verificationToken = crypto.randomUUID();

      // Insert or update the invitation with the verification token
      const { error: inviteError } = await supabase
        .from("invitations")
        .upsert([
          {
            email,
            status: "pending",
            verification_token: verificationToken,
            created_at: new Date().toISOString(),
          },
        ]);

      if (inviteError) throw inviteError;

      // Send the magic link with verification token
      const { error: magicLinkError } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?token=${verificationToken}`,
          data: {
            verification_token: verificationToken,
          },
        },
      });

      if (magicLinkError) throw magicLinkError;

      setMessage("Invitation sent successfully!");
      setEmail("");
      await fetchInvitations();
    } catch (error: Error | unknown) {
      console.error("Error:", error);
      setMessage(`Error: ${error instanceof Error ? error.message : 'Failed to send invitation'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="w-64 bg-blue-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-4">Participants</h2>

      {/* Admin-only form to add participants */}
      {isSuperAdmin && (
        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <label
              htmlFor="invite-email"
              className="block text-sm font-medium text-gray-200"
            >
              Email Address
            </label>
            <input
              type="email"
              id="invite-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-blue-700 border border-blue-500 text-white"
              placeholder="Enter email address"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || !isSuperAdmin}
            className="w-full py-2 bg-green-500 rounded text-white disabled:bg-green-300"
          >
            {loading ? "Sending..." : "Send Invitation"}
          </button>
          {message && (
            <p
              className={`text-sm ${
                message.includes("Error") ? "text-red-400" : "text-green-400"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      )}

      {/* Participant List - Static role and organization for now */}
      {/* {!isSuperAdmin && ( */}
        <div className="mt-6">
          <h3 className="text-lg font-medium">Participant List</h3>
          <ul className="mt-2 space-y-2">
            {invitations.map((invitation) => (
              <li key={invitation.id} className="p-2 bg-blue-700 rounded">
                <div>
                  <p className="text-sm">{invitation.email}</p>
                  <p className="text-xs text-gray-300">Role: Participant</p>
                  <p className="text-xs text-gray-300">Organization: Justice Minds</p>
                  <p className="text-xs text-gray-400">
                    Status:{" "}
                    {invitation.status.charAt(0).toUpperCase() +
                      invitation.status.slice(1)}
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  {new Date(invitation.created_at).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      {/* // )} */}
    </aside>
  );
}
