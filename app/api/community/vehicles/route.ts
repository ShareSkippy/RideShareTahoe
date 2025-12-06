import { createClient } from '@/libs/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { vehicleSchema } from '@/libs/validations/vehicle';
import { z } from 'zod';

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: vehicles, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching vehicles:', error);
      return NextResponse.json({ error: 'Failed to fetch vehicles' }, { status: 500 });
    }

    return NextResponse.json({ vehicles });
  } catch (error) {
    console.error('Error in vehicles GET API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = vehicleSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: z.treeifyError(validationResult.error) },
        { status: 400 }
      );
    }

    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .insert({
        ...validationResult.data,
        owner_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating vehicle:', error);
      return NextResponse.json({ error: 'Failed to create vehicle' }, { status: 500 });
    }

    return NextResponse.json({ vehicle });
  } catch (error) {
    console.error('Error in vehicles POST API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
