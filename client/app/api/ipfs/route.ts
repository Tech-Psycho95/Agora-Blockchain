import { NextRequest, NextResponse } from 'next/server';

const JWT = process.env.PINATA_JWT;
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;

function authorizeRequest(request: NextRequest) {
    const providedApiKey = request.headers.get('X-Internal-API-Key');
    if (!INTERNAL_API_KEY || providedApiKey !== INTERNAL_API_KEY) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return null;
}

export async function POST(request: NextRequest) {
    const authError = authorizeRequest(request);
    if (authError) return authError;

    if (!JWT) {
        return NextResponse.json({ error: 'PINATA_JWT not configured' }, { status: 500 });
    }

    try {
        const body = await request.json();

        const response = await fetch(
            'https://api.pinata.cloud/pinning/pinJSONToIPFS',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${JWT}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            }
        );

        const data = await response.json();
        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (err) {
        console.error('Error pinning to IPFS:', err);
        return NextResponse.json({ error: 'Failed to pin to IPFS' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const authError = authorizeRequest(request);
    if (authError) return authError;

    if (!JWT) {
        return NextResponse.json({ error: 'PINATA_JWT not configured' }, { status: 500 });
    }

    try {
        const { cid } = await request.json();
        if (!cid) {
            return NextResponse.json({ error: 'CID is required' }, { status: 400 });
        }

        const response = await fetch(`https://api.pinata.cloud/pinning/unpin/${cid}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${JWT}` },
        });

        if (!response.ok) {
            const errorBody = await response.text(); // Pinata returns text on failure for DELETE
            return NextResponse.json({ error: errorBody || 'Failed to unpin from Pinata' }, { status: response.status });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Error unpinning from IPFS:', err);
        return NextResponse.json({ error: 'Failed to unpin from IPFS' }, { status: 500 });
    }
}
