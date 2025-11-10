import { NextResponse } from 'next/server';

let TAGS: { name: string; count: number }[] = [];

export async function GET() {
  return NextResponse.json({ data: TAGS });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.name) {
    return NextResponse.json({ error: 'Name required' }, { status: 400 });
  }
  const name = String(body.name).trim().toLowerCase();
  const count = Math.max(0, Number(body.count ?? 0));
  const i = TAGS.findIndex((t) => t.name === name);
  if (i >= 0) TAGS[i] = { name, count };
  else TAGS.push({ name, count });
  return NextResponse.json({ data: { name, count } });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = String(searchParams.get('name') || '')
    .trim()
    .toLowerCase();
  TAGS = TAGS.filter((t) => t.name !== name);
  return NextResponse.json({ ok: true });
}
