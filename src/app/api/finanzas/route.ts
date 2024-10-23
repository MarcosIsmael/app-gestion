import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/db';

export async function GET(req: Request) {
  try {
    const connection = await connectToDatabase();

    // Consultar todos los registros de la tabla finanzas
    const [finanzas]: any[] = await connection.execute(
      `SELECT id, fecha, monto, descripcion, venta_id AS ventaId, compra_id AS compraId
       FROM finanzas`
    );

    // Cerrar la conexión
    await connection.end();

    return NextResponse.json(finanzas, { status: 200 });
  } catch (error) {
    console.error('Error al obtener los registros de finanzas:', error);
    return NextResponse.json({ error: 'Error al obtener los registros de finanzas' }, { status: 500 });
  }
}
