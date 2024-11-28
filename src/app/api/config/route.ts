import { NextResponse } from 'next/server';

import { ResultSetHeader } from 'mysql2';
import connectToDatabase from '@/app/lib/db';
interface ConfigOptions {
    actualizarStock: boolean;
    actualizarPrecioCosto: boolean;
    actualizarPrecioVenta: boolean;
    gananciaPredeterminada: number;
}

export async function POST(req: Request) {
    const connection = await connectToDatabase();
    const { actualizarStock, actualizarPrecioCosto, actualizarPrecioVenta, gananciaPredeterminada } = await req.json() as ConfigOptions;
    try {
          // Iniciar una transacción
    await connection.beginTransaction();
    const updateQuery = `
    UPDATE configuraciones
    SET
      valor_booleano = CASE
        WHEN clave = 'actualizarPrecioCosto' THEN ?
        WHEN clave = 'actualizarPrecioVenta' THEN ?
        WHEN clave = 'actualizarStock' THEN ?
        ELSE valor_booleano
      END,
      valor_entero = CASE
        WHEN clave = 'gananciaPredeterminada' THEN ?
        ELSE valor_entero
      END,
      actualizado_en = NOW()
    WHERE clave IN ('actualizarPrecioCosto', 'actualizarPrecioVenta', 'actualizarStock', 'gananciaPredeterminada')
  `;
  
await connection.execute(updateQuery, [
    actualizarPrecioCosto,
    actualizarPrecioVenta,
    actualizarStock,
    gananciaPredeterminada,
  ]);

        // Confirmar la transacción
        await connection.commit();

        // Cerrar la conexión
        await connection.end();
        return NextResponse.json({message:'Actualizado con éxito'},{status:201})
    } catch (error) {
        return NextResponse.json({message:error?.message},{status:500})
    }
  
}
export async function GET(req: Request) {

    try {
        const connection = await connectToDatabase();
        const [configuraciones]   = await connection.execute(`
            SELECT c.clave, c.descripcion, c.valor_texto, c.valor_decimal, c.valor_booleano, c.tipo, c.valor_entero FROM configuraciones c`);

            return NextResponse.json(configuraciones);
    } catch (error) {
        return NextResponse.json({message:error?.message},{status:500})
    }
}