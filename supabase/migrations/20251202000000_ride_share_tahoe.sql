-- 1. PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  -- Removed private fields: email, phone_number, street_address, zip, emergency contacts
  first_name TEXT,
  last_name TEXT,
  role TEXT DEFAULT 'both' CHECK (role IN ('driver', 'passenger', 'both')),
  
  -- Profile Details
  bio TEXT,
  profile_photo_url TEXT,
  
  -- Admin & Safety Flags
  is_admin BOOLEAN DEFAULT false,
  is_banned BOOLEAN DEFAULT false,
  
  -- Location Privacy
  display_lat DECIMAL,
  display_lng DECIMAL,
  display_lat_offset DECIMAL,
  display_lng_offset DECIMAL,
  neighborhood TEXT,
  city TEXT,
  state TEXT,
  
  -- Safety & Preferences
  preferences JSONB, -- { music: "Rock", smoking: false, pets: true }
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.1 USER PRIVATE INFO (Strictly Private)
CREATE TABLE IF NOT EXISTS user_private_info (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  phone_number TEXT,
  street_address TEXT,
  zip_code TEXT,
  
  -- Emergency Contacts
  emergency_contact_name TEXT,
  emergency_contact_number TEXT,
  emergency_contact_email TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.2 PROFILE SOCIALS (Secure Storage)
CREATE TABLE IF NOT EXISTS profile_socials (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  facebook_url TEXT,
  instagram_url TEXT,
  linkedin_url TEXT,
  airbnb_url TEXT,
  other_social_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.3 REPORTS (User Safety)
CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reported_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('harassment', 'spam', 'safety', 'inappropriate', 'other')),
  details TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT different_reporter_reported CHECK (reporter_id != reported_id)
);

-- 1.5 VEHICLES
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  color TEXT NOT NULL,
  license_plate TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_vehicles_owner_id ON vehicles(owner_id);

-- 2. RIDES
CREATE TABLE IF NOT EXISTS rides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poster_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  posting_type TEXT CHECK (posting_type IN ('driver', 'passenger', 'flexible')) NOT NULL,
  
  -- Trip Details
  start_location TEXT NOT NULL,
  end_location TEXT NOT NULL,
  start_lat DECIMAL,
  start_lng DECIMAL,
  end_lat DECIMAL,
  end_lng DECIMAL,
  departure_date DATE NOT NULL,
  departure_time TIME NOT NULL,
  return_date DATE,
  return_time TIME,
  
  -- Round Trip
  is_round_trip BOOLEAN DEFAULT false,
  round_trip_group_id UUID,
  trip_direction TEXT CHECK (trip_direction IN ('departure', 'return')),
  
  -- Recurring
  is_recurring BOOLEAN DEFAULT false,
  recurring_days TEXT[],
  
  -- Driver/Flexible Specific
  pricing_type TEXT CHECK (pricing_type IN ('per_seat', 'split_costs')),
  price_per_seat DECIMAL,
  gas_estimate DECIMAL,
  total_seats INTEGER,
  available_seats INTEGER,
  car_type TEXT,
  has_awd BOOLEAN DEFAULT false,
  
  -- Preferences
  driving_arrangement TEXT,
  music_preference TEXT,
  conversation_preference TEXT,
  
  -- Metadata
  title TEXT,
  description TEXT,
  special_instructions TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CONVERSATIONS
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant1_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  participant2_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  ride_id UUID REFERENCES rides(id) ON DELETE CASCADE,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(participant1_id, participant2_id, ride_id)
);

-- 4. MESSAGES
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  ride_id UUID REFERENCES rides(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  subject TEXT,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TRIP BOOKINGS (Passengers joining driver trips)
CREATE TABLE IF NOT EXISTS trip_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ride_id UUID REFERENCES rides(id) ON DELETE CASCADE NOT NULL,
  driver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  passenger_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Meeting details
  pickup_location TEXT,
  pickup_lat DECIMAL,
  pickup_lng DECIMAL,
  pickup_time TIMESTAMP WITH TIME ZONE,
  
  -- Status tracking
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'invited')) NOT NULL,
  
  -- Communication
  driver_notes TEXT,
  passenger_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  CONSTRAINT different_driver_passenger CHECK (driver_id != passenger_id),
  CONSTRAINT unique_passenger_per_ride UNIQUE (ride_id, passenger_id)
);

-- 7. REVIEWS
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reviewee_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES trip_bookings(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  reviewer_role TEXT NOT NULL CHECK (reviewer_role IN ('driver', 'passenger')),
  reviewed_role TEXT NOT NULL CHECK (reviewed_role IN ('driver', 'passenger')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'hidden', 'deleted')),
  is_pending boolean DEFAULT false,
  review_trigger_date timestamp with time zone,
  comment TEXT NOT NULL, 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT different_reviewer_reviewee CHECK (reviewer_id != reviewee_id)
);

-- 7. REVIEWS PENDING
CREATE TABLE IF NOT EXISTS reviews_pending (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  other_participant_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES trip_bookings(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('driver', 'passenger')),
  other_role text NOT NULL CHECK (other_role IN ('driver', 'passenger')),
  days_since_last_message integer NOT NULL,
  is_notified boolean DEFAULT false,
  notification_sent_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT reviews_pending_pkey PRIMARY KEY (id)
);

-- 8. ACCOUNT DELETION REQUESTS
CREATE TABLE IF NOT EXISTS account_deletion_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (
    status IN (
      'pending',
      'processing',
      'completed',
      'cancelled'
    )
  ),
  scheduled_deletion_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. INDEXES
CREATE INDEX IF NOT EXISTS idx_rides_poster_id ON rides(poster_id);
CREATE INDEX IF NOT EXISTS idx_rides_end_location ON rides(end_location);
CREATE INDEX IF NOT EXISTS idx_rides_departure_date ON rides(departure_date);
CREATE INDEX IF NOT EXISTS idx_rides_status ON rides(status);
CREATE INDEX IF NOT EXISTS idx_rides_round_trip_group_id ON rides(round_trip_group_id);

CREATE INDEX IF NOT EXISTS idx_trip_bookings_driver_id ON trip_bookings(driver_id);
CREATE INDEX IF NOT EXISTS idx_trip_bookings_passenger_id ON trip_bookings(passenger_id);
CREATE INDEX IF NOT EXISTS idx_trip_bookings_status ON trip_bookings(status);

CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_ride_id ON messages(ride_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);

CREATE INDEX IF NOT EXISTS idx_deletion_requests_user_id ON account_deletion_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_deletion_requests_status ON account_deletion_requests(status);

CREATE INDEX IF NOT EXISTS idx_conversations_participant2_id ON conversations(participant2_id);
CREATE INDEX IF NOT EXISTS idx_conversations_ride_id ON conversations(ride_id);

CREATE INDEX IF NOT EXISTS idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_reviews_conversation_id ON reviews(conversation_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

CREATE INDEX IF NOT EXISTS idx_reviews_pending_booking_id ON reviews_pending(booking_id);
CREATE INDEX IF NOT EXISTS idx_reviews_pending_user_id ON reviews_pending(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_pending_conversation_id ON reviews_pending(conversation_id);
CREATE INDEX IF NOT EXISTS idx_reviews_pending_other_participant_id ON reviews_pending(other_participant_id);

-- New Indexes for Security Features
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);
CREATE INDEX IF NOT EXISTS idx_profiles_is_banned ON profiles(is_banned);

CREATE INDEX IF NOT EXISTS idx_reports_reporter_id ON reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_reports_reported_id ON reports(reported_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);

-- 10. HELPER FUNCTIONS FOR RLS
CREATE OR REPLACE FUNCTION has_active_booking_with(other_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM trip_bookings
    WHERE status IN ('pending', 'confirmed', 'invited')
    AND (
      (driver_id = (select auth.uid()) AND passenger_id = other_user_id)
      OR
      (passenger_id = (select auth.uid()) AND driver_id = other_user_id)
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

-- 11. RLS POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_private_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews_pending ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_deletion_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_socials ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK ((select auth.uid()) = id);
CREATE POLICY "Authenticated users can update profiles" ON profiles
  FOR UPDATE TO authenticated USING (
    (select auth.uid()) = id
    OR
    (select is_admin from profiles where id = (select auth.uid())) = true
  );

-- User Private Info
CREATE POLICY "Users and admins can view private info" ON user_private_info
  FOR SELECT TO authenticated USING (
    (select auth.uid()) = id
    OR
    (select is_admin from profiles where id = (select auth.uid())) = true
  );
CREATE POLICY "Users can insert their own private info" ON user_private_info
  FOR INSERT WITH CHECK ((select auth.uid()) = id);
CREATE POLICY "Users can update their own private info" ON user_private_info
  FOR UPDATE USING ((select auth.uid()) = id);

-- Profile Socials
CREATE POLICY "Socials viewable by owner or connected users" ON profile_socials
  FOR SELECT USING (
    (select auth.uid()) = user_id
    OR
    has_active_booking_with(user_id)
  );
CREATE POLICY "Users can insert their own socials" ON profile_socials
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY "Users can update their own socials" ON profile_socials
  FOR UPDATE USING ((select auth.uid()) = user_id);
CREATE POLICY "Users can delete their own socials" ON profile_socials
  FOR DELETE USING ((select auth.uid()) = user_id);

-- Reports
CREATE POLICY "Users can create reports" ON reports
  FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = reporter_id);
CREATE POLICY "Authenticated users can view reports" ON reports
  FOR SELECT TO authenticated USING (
    (select auth.uid()) = reporter_id
    OR
    (select is_admin from profiles where id = (select auth.uid())) = true
  );
CREATE POLICY "Admins can update reports" ON reports
  FOR UPDATE TO authenticated USING (
    (select is_admin from profiles where id = (select auth.uid())) = true
  );

-- Vehicles
CREATE POLICY "Vehicles are viewable by everyone" ON vehicles
  FOR SELECT USING (true);
CREATE POLICY "Users can insert their own vehicles" ON vehicles
  FOR INSERT WITH CHECK ((select auth.uid()) = owner_id);
CREATE POLICY "Users can update their own vehicles" ON vehicles
  FOR UPDATE USING ((select auth.uid()) = owner_id);
CREATE POLICY "Users can delete their own vehicles" ON vehicles
  FOR DELETE USING ((select auth.uid()) = owner_id);

-- Rides
CREATE POLICY "Users can view active rides or their own rides" ON rides
  FOR SELECT USING (status = 'active' OR (select auth.uid()) = poster_id);
CREATE POLICY "Users can create their own rides" ON rides
  FOR INSERT WITH CHECK ((select auth.uid()) = poster_id);
CREATE POLICY "Users can update their own rides" ON rides
  FOR UPDATE USING ((select auth.uid()) = poster_id);
CREATE POLICY "Users can delete their own rides" ON rides
  FOR DELETE USING ((select auth.uid()) = poster_id);
-- Banned User Restrictions (Rides)
CREATE POLICY "Banned users cannot insert rides" ON rides
  AS RESTRICTIVE
  FOR INSERT WITH CHECK (
    (select is_banned from profiles where id = (select auth.uid())) = false
  );
CREATE POLICY "Banned users cannot update rides" ON rides
  AS RESTRICTIVE
  FOR UPDATE USING (
    (select is_banned from profiles where id = (select auth.uid())) = false
  );

-- Conversations
CREATE POLICY "Users can view their conversations" ON conversations
  FOR SELECT USING ((select auth.uid()) = participant1_id OR (select auth.uid()) = participant2_id);
CREATE POLICY "Users can create conversations with active booking" ON conversations
  FOR INSERT WITH CHECK (
    ((select auth.uid()) = participant1_id OR (select auth.uid()) = participant2_id)
    AND
    has_active_booking_with(
      CASE 
        WHEN (select auth.uid()) = participant1_id THEN participant2_id
        ELSE participant1_id
      END
    )
  );
CREATE POLICY "Users can update their conversations" ON conversations
  FOR UPDATE USING ((select auth.uid()) = participant1_id OR (select auth.uid()) = participant2_id);

-- Messages
CREATE POLICY "Users can view their messages" ON messages
  FOR SELECT USING ((select auth.uid()) = sender_id OR (select auth.uid()) = recipient_id);
CREATE POLICY "Users can send messages with active booking" ON messages
  FOR INSERT WITH CHECK (
    (select auth.uid()) = sender_id
    AND
    has_active_booking_with(recipient_id)
  );
CREATE POLICY "Users can update their received messages" ON messages
  FOR UPDATE USING ((select auth.uid()) = recipient_id);
-- Banned User Restrictions (Messages)
CREATE POLICY "Banned users cannot insert messages" ON messages
  AS RESTRICTIVE
  FOR INSERT WITH CHECK (
    (select is_banned from profiles where id = (select auth.uid())) = false
  );
CREATE POLICY "Banned users cannot update messages" ON messages
  AS RESTRICTIVE
  FOR UPDATE USING (
    (select is_banned from profiles where id = (select auth.uid())) = false
  );

-- Trip Bookings
CREATE POLICY "Users can view their bookings" ON trip_bookings
  FOR SELECT USING ((select auth.uid()) = driver_id OR (select auth.uid()) = passenger_id);
CREATE POLICY "Users can create bookings or invitations" ON trip_bookings
  FOR INSERT WITH CHECK ((select auth.uid()) = driver_id OR (select auth.uid()) = passenger_id);
CREATE POLICY "Participants can update their bookings" ON trip_bookings
  FOR UPDATE USING ((select auth.uid()) = driver_id OR (select auth.uid()) = passenger_id);
-- Banned User Restrictions (Bookings)
CREATE POLICY "Banned users cannot insert bookings" ON trip_bookings
  AS RESTRICTIVE
  FOR INSERT WITH CHECK (
    (select is_banned from profiles where id = (select auth.uid())) = false
  );
CREATE POLICY "Banned users cannot update bookings" ON trip_bookings
  AS RESTRICTIVE
  FOR UPDATE USING (
    (select is_banned from profiles where id = (select auth.uid())) = false
  );

-- Reviews
CREATE POLICY "Reviews are public" ON reviews
  FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT WITH CHECK ((select auth.uid()) = reviewer_id);
CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING ((select auth.uid()) = reviewer_id);
-- Banned User Restrictions (Reviews)
CREATE POLICY "Banned users cannot insert reviews" ON reviews
  AS RESTRICTIVE
  FOR INSERT WITH CHECK (
    (select is_banned from profiles where id = (select auth.uid())) = false
  );

-- Reviews Pending
CREATE POLICY "Users can view their own pending reviews" ON reviews_pending
  FOR SELECT USING ((select auth.uid()) = user_id);
CREATE POLICY "Authenticated users can insert pending reviews" ON reviews_pending
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update pending reviews" ON reviews_pending
  FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete pending reviews" ON reviews_pending
  FOR DELETE USING ((select auth.uid()) = user_id);

-- Account Deletion Requests
CREATE POLICY "Users can view their own deletion requests" ON account_deletion_requests
  FOR SELECT USING ((select auth.uid()) = user_id);
CREATE POLICY "Users can create their own deletion requests" ON account_deletion_requests
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY "Users can update their own deletion requests" ON account_deletion_requests
  FOR UPDATE USING ((select auth.uid()) = user_id);

-- 12. FUNCTIONS & TRIGGERS

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (new.id, '', '');
  
  INSERT INTO public.user_private_info (id, email)
  VALUES (new.id, new.email);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = 'pg_catalog', 'public', 'auth';

-- RPC: Search Users (Admin)
CREATE OR REPLACE FUNCTION search_users(search_term TEXT, page_number INTEGER, page_size INTEGER)
RETURNS TABLE (
  id UUID,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  role TEXT,
  is_banned BOOLEAN,
  is_admin BOOLEAN,
  profile_photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  total_count BIGINT
) AS $$
DECLARE
  total_rows BIGINT;
BEGIN
  -- Get total count first
  SELECT COUNT(*) INTO total_rows
  FROM profiles p
  JOIN user_private_info u ON p.id = u.id
  WHERE 
    search_term IS NULL OR search_term = '' OR
    p.first_name ILIKE '%' || search_term || '%' OR
    p.last_name ILIKE '%' || search_term || '%' OR
    u.email ILIKE '%' || search_term || '%';

  RETURN QUERY
  SELECT 
    p.id, 
    p.first_name, 
    p.last_name, 
    u.email, 
    p.role, 
    p.is_banned, 
    p.is_admin, 
    p.profile_photo_url, 
    p.created_at,
    total_rows
  FROM profiles p
  JOIN user_private_info u ON p.id = u.id
  WHERE 
    search_term IS NULL OR search_term = '' OR
    p.first_name ILIKE '%' || search_term || '%' OR
    p.last_name ILIKE '%' || search_term || '%' OR
    u.email ILIKE '%' || search_term || '%'
  ORDER BY p.created_at DESC
  LIMIT page_size
  OFFSET page_number * page_size;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = 'pg_catalog', 'public', 'auth';

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = 'pg_catalog', 'public';

CREATE OR REPLACE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_user_private_info_updated_at BEFORE UPDATE ON user_private_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_rides_updated_at BEFORE UPDATE ON rides FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_trip_bookings_updated_at BEFORE UPDATE ON trip_bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_deletion_requests_updated_at BEFORE UPDATE ON account_deletion_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profile_socials_updated_at BEFORE UPDATE ON profile_socials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Handle User Ban (Deactivate Rides)
CREATE OR REPLACE FUNCTION handle_user_ban()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_banned = true AND OLD.is_banned = false THEN
    UPDATE public.rides
    SET status = 'inactive'
    WHERE poster_id = NEW.id AND status = 'active';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

CREATE TRIGGER on_profile_ban_update
  AFTER UPDATE OF is_banned ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_user_ban();


-- Function to get user average rating
CREATE OR REPLACE FUNCTION get_user_average_rating(user_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  avg_rating DECIMAL;
BEGIN
  SELECT AVG(rating) INTO avg_rating
  FROM reviews
  WHERE reviewee_id = user_id;
  
  RETURN COALESCE(avg_rating, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

-- Function to get user review count
CREATE OR REPLACE FUNCTION get_user_review_count(user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  count_reviews INTEGER;
BEGIN
  SELECT COUNT(*) INTO count_reviews
  FROM reviews
  WHERE reviewee_id = user_id;
  
  RETURN COALESCE(count_reviews, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;


CREATE TABLE IF NOT EXISTS email_events (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('queued', 'sent', 'failed', 'skipped')),
  external_message_id TEXT,
  error TEXT,
  to_email TEXT NOT NULL,
  subject TEXT,
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_email_events_user_id ON email_events(user_id);
CREATE INDEX IF NOT EXISTS idx_email_events_email_type ON email_events(email_type);
CREATE INDEX IF NOT EXISTS idx_email_events_status ON email_events(status);
CREATE INDEX IF NOT EXISTS idx_email_events_created_at ON email_events(created_at);
CREATE INDEX IF NOT EXISTS idx_email_events_user_type ON email_events(user_id, email_type);

CREATE TABLE IF NOT EXISTS scheduled_emails (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_type TEXT NOT NULL,
  run_after TIMESTAMP WITH TIME ZONE NOT NULL,
  payload JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_scheduled_emails_user_id ON scheduled_emails(user_id);

-- User activity tracking
CREATE TABLE IF NOT EXISTS user_activity (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);

-- Email events RLS
ALTER TABLE email_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own email events" ON email_events
  FOR SELECT USING ((select auth.uid()) = user_id);
CREATE POLICY "Authenticated users can insert email events" ON email_events
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update email events" ON email_events
  FOR UPDATE TO authenticated USING (true);

-- Scheduled emails RLS
ALTER TABLE scheduled_emails ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own scheduled emails" ON scheduled_emails
  FOR SELECT USING ((select auth.uid()) = user_id);

-- User activity RLS
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own activity" ON user_activity
  FOR SELECT USING ((select auth.uid()) = user_id);
CREATE POLICY "Authenticated users can insert user activity" ON user_activity
  FOR INSERT TO authenticated WITH CHECK (true);

-- Email events trigger
CREATE OR REPLACE TRIGGER update_email_events_updated_at BEFORE UPDATE ON email_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 13. STORAGE BUCKETS

-- Create profile photos storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true) ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies
CREATE POLICY "Public Access" ON storage.objects FOR
SELECT USING (bucket_id = 'profile-photos');
CREATE POLICY "Authenticated users can upload their own photos" ON storage.objects FOR
INSERT WITH CHECK (
        bucket_id = 'profile-photos'
        AND (select auth.uid())::text = (storage.foldername(name))[1]
    );
CREATE POLICY "Authenticated users can update their own photos" ON storage.objects FOR
UPDATE USING (
        bucket_id = 'profile-photos'
        AND (select auth.uid())::text = (storage.foldername(name))[1]
    );
CREATE POLICY "Authenticated users can delete their own photos" ON storage.objects FOR DELETE USING (
    bucket_id = 'profile-photos'
    AND (select auth.uid())::text = (storage.foldername(name))[1]
);
