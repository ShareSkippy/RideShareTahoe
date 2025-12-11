import type { NextRequest } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import { POST } from './route';
import { getAuthenticatedUser, ensureProfileComplete } from '@/libs/supabase/auth';
import { sendConversationMessage } from '@/libs/supabase/conversations';

jest.mock('@/libs/supabase/conversations', () => ({
  sendConversationMessage: jest.fn(),
}));

jest.mock('@/libs/supabase/auth', () => ({
  getAuthenticatedUser: jest.fn(),
  createUnauthorizedResponse: jest.fn(),
  ensureProfileComplete: jest.fn(),
}));

describe('POST /api/trips/invitations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (ensureProfileComplete as jest.Mock).mockResolvedValue(null);
  });

  it('creates an invitation and notifies the passenger', async () => {
    const ride = {
      poster_id: 'driver-idd',
      available_seats: 2,
      status: 'active',
      title: 'Mountain Ride',
      start_location: 'SF',
      end_location: 'Tahoe',
      departure_date: '2025-12-20',
      departure_time: '08:30',
    };

    const supabase = {
      from: jest.fn((tableName: string) => {
        if (tableName === 'rides') {
          const single = jest.fn().mockResolvedValue({ data: ride, error: null });
          const eq = jest.fn().mockReturnValue({ single });
          return { select: jest.fn().mockReturnValue({ eq }) };
        }

        if (tableName === 'trip_bookings') {
          const maybeSingle = jest.fn().mockResolvedValue({ data: null, error: null });
          const inChain = jest.fn().mockReturnValue({ maybeSingle });
          const eqSecond = jest.fn().mockReturnValue({ in: inChain });
          const eqFirst = jest.fn().mockReturnValue({ eq: eqSecond });
          const select = jest.fn().mockReturnValue({ eq: eqFirst });
          const insert = jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: { id: 'booking-xx' }, error: null }),
            }),
          });
          return { select, insert };
        }

        if (tableName === 'profiles') {
          const maybeSingle = jest
            .fn()
            .mockResolvedValue({ data: { first_name: 'Driver', last_name: 'Test' }, error: null });
          const eq = jest.fn().mockReturnValue({ maybeSingle });
          return { select: jest.fn().mockReturnValue({ eq }) };
        }

        return { select: jest.fn(), insert: jest.fn() };
      }),
    } as unknown as SupabaseClient<Database>;

    const user = { id: 'driver-idd' };

    (getAuthenticatedUser as jest.Mock).mockResolvedValue({
      user,
      authError: null,
      supabase,
    });

    const request = {
      json: jest.fn().mockResolvedValue({
        ride_id: 'a3c8e5a6-ec45-4e90-9f3b-52f4ef6ccebf',
        passenger_id: 'b6a5b6a7-6f7e-4d3f-9485-9bf6f9c0942f',
        pickup_location: 'San Francisco',
        pickup_time: new Date('2025-12-20T08:30:00Z').toISOString(),
        driver_notes: 'I can take you along',
      }),
    } as unknown as NextRequest;

    await POST(request);

    expect(sendConversationMessage).toHaveBeenCalledWith({
      supabase,
      senderId: user.id,
      recipientId: 'b6a5b6a7-6f7e-4d3f-9485-9bf6f9c0942f',
      rideId: 'a3c8e5a6-ec45-4e90-9f3b-52f4ef6ccebf',
      content: expect.stringContaining('invited you'),
    });
  });
});
