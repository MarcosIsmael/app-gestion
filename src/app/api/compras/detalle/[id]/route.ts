import { NextResponse } from 'next/server';
import { RowDataPacket } from 'mysql2';
import connectToDatabase from '@/app/lib/db';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const connection = await connectToDatabase();

  try {
    const [rows] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM compras WHERE id = ?',
      [params.id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Registro de compra no encontrado' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error fetching registro de compra:', error);
    return NextResponse.json({ error: 'Error en la base de datos' }, { status: 500 });
  } finally {
    await connection.end();
  }
}
