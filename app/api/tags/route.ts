import { NextResponse } from 'next/server';
import { addTag, deleteTag, listTags } from '@/lib/tag-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ ok: true, data: listTags() });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name, count } = body ?? {};
    const created = addTag(name, count ?? 0);
    return NextResponse.json({ ok: true, data: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? 'Bad Request' }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const name = url.searchParams.get('name');
    if (!name) throw new Error('Missing name');
    deleteTag(name);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? 'Bad Request' }, { status: 400 });
  }
}
