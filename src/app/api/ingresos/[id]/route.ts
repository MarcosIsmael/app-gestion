import connectToDatabase from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const ingresoId = parseInt(params.id, 10);

  if (isNaN(ingresoId)) {
    return NextResponse.json({ error: 'ID de ingreso no válido' }, { status: 400 });
  }

  try {
    // Conectar a la base de datos
    const connection = await connectToDatabase()

    // Obtener datos del ingreso principal
    const [ingresoData]: any[] = await connection.execute(
      `SELECT 
        f.id AS ingresoId, 
        f.fecha, 
        f.monto, 
        f.descripcion,
        rv.id AS ventaId,
        mp.nombre AS metodoPago
      FROM finanzas f
      JOIN registro_de_ventas rv ON f.venta_id = rv.id
      JOIN metodo_pago mp ON rv.metodo_pago_id = mp.id
      WHERE f.id = ?`,
      [ingresoId]
    );

    if (ingresoData.length === 0) {
      return NextResponse.json({ error: 'Ingreso no encontrado' }, { status: 404 });
    }

    const ingreso = ingresoData[0];

    // Obtener los productos relacionados con el ingreso (venta)
    const [productosData]: any[] = await connection.execute(
      `SELECT vp.producto_id , 
        p.nombre AS productoNombre, 
        vp.cantidad,
        p.nombre,
        pp.costo AS precioCompra,
        pp.precio AS precioFinal
      FROM venta_producto vp
      JOIN producto p ON vp.producto_id = p.codigo
      JOIN precio_producto pp ON pp.producto_id = p.codigo 
      WHERE vp.venta_id = ?`,
      [ingreso.ventaId]
    );

    // Formar el objeto de respuesta
    const respuesta = {
      ingreso: {
        id: ingreso.ingresoId,
        fecha: ingreso.fecha,
        monto: ingreso.monto,
        descripcion: ingreso.descripcion,
        metodo_de_pago: ingreso.metodoPago,
      },
      productos: productosData.map((producto: { productoId: any; productoNombre: any; cantidad: any; precioCompra: any; }) => ({
        productoId: producto.productoId,
        productoNombre: producto.productoNombre,
        cantidad: producto.cantidad,
        precioCompra: producto.precioCompra,
      })),
    };

    // Cerrar la conexión a la base de datos
    await connection.end();

    // Devolver la respuesta
    return NextResponse.json(respuesta, { status: 200 });
  } catch (error) {
    console.error('Error al obtener el detalle del ingreso:', error);
    return NextResponse.json({ error: 'Error al obtener el detalle del ingreso' }, { status: 500 });
  }
}
