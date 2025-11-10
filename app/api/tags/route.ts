import { NextResponse } from 'next/server';

type TagRow = { name: string; count: number };

let TAGS: TagRow[] = []; // in-memory for MVP

function normalizeName(name: string) {
  return String(name || '')
    .trim()
    .toLowerCase();
}

export async function GET() {
  return NextResponse.json({ data: TAGS });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<TagRow>;
    const name = normalizeName(body.name ?? '');
    const count = Number.isFinite(body.count as number) ? Number(body.count) : 0;

    if (!name) {
      return NextResponse.json({ error: 'Name required' }, { status: 400 });
    }

    const i = TAGS.findIndex((t) => t.name === name);
    if (i >= 0) {
      TAGS[i] = { ...TAGS[i], count };
      return NextResponse.json({ data: TAGS[i] }, { status: 200 });
    }

    const row = { name, count };
    TAGS.push(row);
    return NextResponse.json({ data: row }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get('name') || '';
  const name = normalizeName(raw);
  if (!name) {
    return NextResponse.json({ error: 'name query param required' }, { status: 400 });
  }
  const before = TAGS.length;
  TAGS = TAGS.filter((t) => t.name !== name);
  if (TAGS.length === before) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
