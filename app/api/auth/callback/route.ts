import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/libs/supabase/server';
import { type Session, type User, type UserMetadata } from '@supabase/supabase-js';

// Define types locally for safety (mirroring database schema)
interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  profile_photo_url: string | null;
  bio: string | null;
  role: string | null;
  phone_number: string | null;
  display_lat: number | null;
  display_lng: number | null;
}

/**
 * Determines the final destination URL based on user status and profile completeness.
 * Appends a cache-busting parameter to ensure client-side session freshness.
 */
function determineRedirectPath(
  finalRedirectBaseUrl: string,
  profile: Profile,
  isNewUser: boolean,
  hasPhonePrivate: boolean
): string {
  const cacheBust: string = `_t=${Date.now()}`;

  // NEW USERS → Always go to profile edit
  if (isNewUser) {
    console.log('🆕 NEW USER → Redirecting to /profile/edit');
    return `${finalRedirectBaseUrl}/profile/edit?${cacheBust}`;
  }

  // Check profile completeness for existing users
  // Treat bio as optional; require role, phone, and a verified location
  const hasRole: boolean = !!profile.role && profile.role.trim().length > 0;
  const hasLocation: boolean = profile.display_lat !== null && profile.display_lng !== null;

  console.log('📊 Profile completeness check:');
  console.log('   ✓ Role:', hasRole ? '✅ Complete' : '❌ Missing');
  console.log('   ✓ Phone:', hasPhonePrivate ? '✅ Complete' : '❌ Missing');
  console.log(
    '   ✓ Location:',
    hasLocation ? '✅ Verified (display_lat/lng present)' : '❌ Missing'
  );

  // Existing user logic
  if (hasRole && hasPhonePrivate && hasLocation) {
    console.log('✅ PROFILE COMPLETE → Redirecting to /community');
    return `${finalRedirectBaseUrl}/community?${cacheBust}`;
  } else {
    console.log('📝 PROFILE INCOMPLETE → Redirecting to /profile/edit');
    return `${finalRedirectBaseUrl}/profile/edit?${cacheBust}`;
  }
}

/**
 * Executes the core OAuth logic: code exchange, profile synchronization, emails, and final routing.
 */
async function processCodeExchangeAndProfileUpdate(
  requestUrl: URL,
  code: string
): Promise<NextResponse> {
  // Use secure Publishable Key client with cookie handling
  const supabase = await createClient();

  // 1. Exchange Code
  const { data, error: exchangeError } = (await supabase.auth.exchangeCodeForSession(code)) as {
    data: { session: Session | null; user: User | null };
    error: unknown;
  };

  if (exchangeError) {
    console.error('Session exchange error:', exchangeError);
    return NextResponse.redirect(
      new URL('/login?error=session_exchange_failed', requestUrl.origin)
    );
  }

  if (!data.session || !data.user) {
    console.error('No session or user created after code exchange');
    return N
