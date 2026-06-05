import { NextResponse } from 'next/server';
import crypto from 'crypto';

// 1. Helper Function: Hash data using SHA-256 as required by Meta
const hashData = (data: string) => {
  if (!data) return '';
  // Meta requires data to be trimmed, lowercased, and hashed in SHA-256
  return crypto.createHash('sha256').update(data.trim().toLowerCase()).digest('hex');
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Extract data sent from your frontend
    const { eventName, eventId, eventSourceUrl, userData, customData } = body;

    const pixelId = process.env.META_PIXEL_ID;
    const accessToken = process.env.META_ACCESS_TOKEN;
    const testEventCode = process.env.META_TEST_EVENT_CODE;

    // 2. Extract User Agent and IP Address from Next.js Request Headers
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '';
    const userAgent = req.headers.get('user-agent') || '';

    // 3. Construct the Payload
    const payload = {
      data: [
        {
          event_name: eventName || 'Purchase',
          event_time: Math.floor(Date.now() / 1000), // Unix timestamp in seconds
          event_id: eventId, // Essential for Deduplication!
          event_source_url: eventSourceUrl,
          action_source: 'website',
          user_data: {
            client_ip_address: ip,
            client_user_agent: userAgent,
            // Hash the email and phone if they exist
            em: userData?.email ? [hashData(userData.email)] : [],
            ph: userData?.phone ? [hashData(userData.phone)] : [],
            // You can add fn (first name), ln (last name) here using the same hashData function
          },
          custom_data: customData || {},
        }
      ],
      // 4. Test Events: Include the test code if it exists in env variables
      ...(testEventCode && { test_event_code: testEventCode })
    };

    // 5. Send to Meta Graph API
    const response = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Meta CAPI Error:', data);
      return NextResponse.json({ error: 'Failed to send event to Meta' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Event successfully sent to Meta API' });

  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}