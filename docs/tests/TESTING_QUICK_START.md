# Quick Start: Testing Messages Between Two Users

This guide shows you the fastest way to verify that messaging works between two users.

## Option 1: Manual Testing (Fastest)

### Step 1: Create Two Test Users

1. Open your browser to `http://localhost:3000`
2. Sign up as User A:
   - Email: `alice@test.com`
   - Password: `TestPassword123!`
   - First Name: `Alice`
   - Last Name: `Test`
3. Sign out
4. Sign up as User B:
   - Email: `bob@test.com`
   - Password: `TestPassword123!`
   - First Name: `Bob`
   - Last Name: `Test`

### Step 2: Send a Message

1. Sign in as Alice
2. Go to Community page
3. Find Bob's profile
4. Click "Message" button
5. Type: "Hello Bob! Want to share a ride?"
6. Send the message

### Step 3: Verify Receipt

1. Sign out
2. Sign in as Bob
3. Go to Messages page
4. You should see a conversation with Alice
5. Click on the conversation
6. You should see Alice's message

### Step 4: Reply

1. Still signed in as Bob
2. Type a reply: "Hi Alice! Yes, I'd love to!"
3. Send the message

### Step 5: Verify Reply

1. Sign out
2. Sign in as Alice
3. Go to Messages page
4. Click on the conversation with Bob
5. You should see both messages

✅ **If you can see both messages, messaging is working!**

---

## Option 2: Automated Integration Test

### Prerequisites

1. **Start Supabase** (if using local):

   ```bash
   npx supabase start
   ```

2. **Start Next.js dev server**:

   ```bash
   npm run dev
   ```

3. **Create test users**:

   ```bash
   npx ts-node scripts/setup-test-users.ts
   ```

4. **Create `.env.test.local`**:
   ```env
   TEST_USER_A_EMAIL=alice.test@ridetahoe.local
   TEST_USER_A_PASSWORD=TestPassword123!
   TEST_USER_B_EMAIL=bob.test@ridetahoe.local
   TEST_USER_B_PASSWORD=TestPassword123!
   RUN_INTEGRATION_TESTS=true
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### Run the Test

**PowerShell (Windows):**

```powershell
$env:RUN_INTEGRATION_TESTS="true"; npm test -- messages-simple.integration.test.ts
```

**Bash/Zsh (Mac/Linux):**

```bash
RUN_INTEGRATION_TESTS=true npm test -- messages-simple.integration.test.ts
```

### Expected Output

```shell
 PASS  app/api/messages/messages-simple.integration.test.ts
  Simple Messages API Integration Test
    Authentication
      ✓ should authenticate User A (150ms)
      ✓ should authenticate User B (145ms)
    Messaging Flow
      ✓ should allow User A to send a message to User B (200ms)
      ✓ should allow User B to fetch the conversation and see the message (180ms)
      ✓ should allow User B to reply to User A (195ms)
      ✓ should allow User A to see the reply (175ms)
    Error Handling
      ✓ should reject unauthenticated message sending (50ms)
      ✓ should reject message with missing content (45ms)
      ✓ should reject message with missing recipient (48ms)

Test Suites: 1 passed, 1 total
Tests:       9 passed, 9 total
```

✅ **If all tests pass, messaging is working!**

---

## Option 3: Database-Level Test

### Using Supabase Studio

1. Open Supabase Studio: `http://localhost:54323` (or your Supabase dashboard)
2. Go to **SQL Editor**
3. Run this query:

```sql
-- Get User IDs
SELECT id, email, first_name, last_name
FROM profiles
WHERE email IN ('alice@test.com', 'bob@test.com');

-- Check conversations
SELECT * FROM conversations
WHERE participant1_id IN (
  SELECT id FROM profiles WHERE email IN ('alice@test.com', 'bob@test.com')
)
OR participant2_id IN (
  SELECT id FROM profiles WHERE email IN ('alice@test.com', 'bob@test.com')
);

-- Check messages
SELECT
  m.*,
  sender.first_name as sender_name,
  recipient.first_name as recipient_name
FROM messages m
JOIN profiles sender ON m.sender_id = sender.id
JOIN profiles recipient ON m.recipient_id = recipient.id
WHERE m.sender_id IN (
  SELECT id FROM profiles WHERE email IN ('alice@test.com', 'bob@test.com')
)
ORDER BY m.created_at ASC;
```

✅ **If you see messages in the results, messaging is working at the database level!**

---

## Troubleshooting

### Issue: "No conversations yet"

**Possible causes:**

- Messages table is empty
- RLS policies are blocking access
- Conversation wasn't created

**Solution:**

1. Check database with SQL query above
2. Verify RLS policies are enabled
3. Check browser console for errors

### Issue: "Unauthorized" error

**Possible causes:**

- User not signed in
- Session expired
- Auth cookies not set

**Solution:**

1. Sign out and sign back in
2. Clear browser cookies
3. Check Supabase auth status

### Issue: Messages not appearing

**Possible causes:**

- Real-time subscription not working
- Page not refreshing
- Database query error

**Solution:**

1. Refresh the page manually
2. Check browser console for errors
3. Verify messages exist in database

### Issue: Integration tests fail

**Possible causes:**

- Test users don't exist
- Environment variables not set
- Dev server not running

**Solution:**

1. Run setup script: `npx ts-node scripts/setup-test-users.ts`
2. Verify `.env.test.local` exists and has correct values
3. Ensure `npm run dev` is running
4. Check that `RUN_INTEGRATION_TESTS=true` is set

---

## What to Check

Here's a checklist to verify messaging is working:

- [ ] User A can send a message to User B
- [ ] User B can see the message from User A
- [ ] User B can reply to User A
- [ ] User A can see the reply from User B
- [ ] Messages appear in chronological order
- [ ] Conversation is created automatically
- [ ] Unauthenticated users cannot send messages
- [ ] Users can only see their own conversations
- [ ] RLS policies prevent unauthorized access

---

## Next Steps

Once you've verified messaging works:

1. **Test with ride posts**: Send messages about specific rides
2. **Test notifications**: Verify email notifications are sent
3. **Test edge cases**: Try sending empty messages, very long messages, etc.
4. **Test performance**: Send multiple messages quickly
5. **Test real-time updates**: Open two browser windows and send messages

---

## Files Created

- `app/api/messages/route.integration.test.ts` - Full integration test with user creation
- `app/api/messages/messages-simple.integration.test.ts` - Simple test using existing users
- `scripts/setup-test-users.ts` - Script to create test users
- `docs/INTEGRATION_TESTING.md` - Detailed testing guide
- `docs/TESTING_QUICK_START.md` - This file

## Need Help?

If messaging isn't working:

1. Check the browser console for errors
2. Check the Next.js server logs
3. Check the Supabase logs: `npx supabase logs`
4. Review the RLS policies in the migration file
5. Verify the API route is working: `curl http://localhost:3000/api/messages`
