import { NextRequest, NextResponse } from 'next/server';

const JWT = process.env.PINATA_JWT;

export async function POST(request: NextRequest) {
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
        return NextResponse.json(data);
    } catch (err) {
        console.error('Error pinning to IPFS:', err);
        return NextResponse.json({ error: 'Failed to pin to IPFS' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    if (!JWT) {
        return NextResponse.json({ error: 'PINATA_JWT not configured' }, { status: 500 });
    }

    try {
        const { cid } = await request.json();

        await fetch(`https://api.pinata.cloud/pinning/unpin/${cid}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${JWT}` },
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Error unpinning from IPFS:', err);
        return NextResponse.json({ error: 'Failed to unpin from IPFS' }, { status: 500 });
    }
}
