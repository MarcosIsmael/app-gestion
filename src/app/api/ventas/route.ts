import { NextRequest, NextResponse } from 'next/server';
import { RowDataPacket } from 'mysql2';
import connectToDatabase from '@/app/lib/db';

export async function POST(req: NextRequest) {
  try {
    // Extraer los datos del body
    const body = await req.json();
    const { productos, metodoPagoId, importe } = body;

    // Validar datos
    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return NextResponse.json({ error: 'Debe proporcionar al menos un producto.' }, { status: 400 });
    }
    if (!metodoPagoId || !importe) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios.' }, { status: 400 });
    }

    const connection = await connectToDatabase();

    // Insertar el registro de la venta
    const [ventaResult] = await connection.execute(
      'INSERT INTO registro_de_ventas (fecha, importe, metodo_pago_id) VALUES (NOW(), ?, ?)',
      [importe, metodoPagoId]
    );
    
    // Obtener el ID de la venta recién creada
    const ventaId = (ventaResult as RowDataPacket).insertId;

    // Insertar cada producto en la tabla venta_producto
    for (const producto of productos) {
      const { productoId, cantidad } = producto;
      if (!productoId || !cantidad) {
        return NextResponse.json({ error: 'Datos de producto incompletos.' }, { status: 400 });
      }

      await connection.execute(
        'INSERT INTO venta_producto (venta_id, producto_id, cantidad) VALUES (?, ?, ?)',
        [ventaId, productoId, cantidad]
      );
    }

    await connection.end();

    return NextResponse.json({ message: 'Venta registrada correctamente.' });
  } catch (error) {
    console.error('Error al registrar la venta:', error);
    return NextResponse.json({ error: 'Error al registrar la venta.' }, { status: 500 });
  }
}
