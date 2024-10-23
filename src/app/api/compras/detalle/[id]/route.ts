import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/db';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const connection = await connectToDatabase();

    // Obtener los datos principales de la compra
    const [compraData]: any[] = await connection.execute(
      `SELECT c.id, c.fecha, c.importe_total AS importeTotal, 
              p.nombre AS proveedorNombre, p.telefono, p.celular
       FROM compras c
       JOIN proveedores p ON c.proveedor_id = p.id
       WHERE c.id = ?`,
      [id]
    );

    // Verifica si se encontró la compra
    if (compraData.length === 0) {
      return NextResponse.json({ error: 'Compra no encontrada' }, { status: 404 });
    }

    const compra = compraData[0];

    // Obtener los productos relacionados con la compra
    const [productosData]: any[] = await connection.execute(
      `SELECT cp.producto_id AS productoId, pr.nombre AS productoNombre, 
              cp.cantidad, cp.precio_compra AS precioCompra
       FROM compra_producto cp
       JOIN producto pr ON cp.producto_id = pr.codigo
       WHERE cp.compra_id = ?`,
      [id]
    );

    // Formar el objeto de respuesta
    const respuesta = {
      compra: {
        id: compra.id,
        fecha: compra.fecha,
        importeTotal: compra.importeTotal,
        proveedorNombre: compra.proveedorNombre,
        telefono: compra.telefono,
        celular: compra.celular,
      },
      productos: productosData.map((producto: { productoId: any; productoNombre: any; cantidad: any; precioCompra: any; }) => ({
        productoId: producto.productoId,
        productoNombre: producto.productoNombre,
        cantidad: producto.cantidad,
        precioCompra: producto.precioCompra,
      })),
    };

    // Enviar la respuesta JSON
    return NextResponse.json(respuesta, { status: 200 });
  } catch (error) {
    console.error('Error al obtener el detalle de la compra:', error);
    return NextResponse.json({ error: 'Error al obtener el detalle de la compra' }, { status: 500 });
  }
}
