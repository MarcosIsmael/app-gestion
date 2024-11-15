import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/db';
import { ResultSetHeader } from 'mysql2';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
      const connection = await connectToDatabase();

      const [result]: any[] = await connection.execute(
          `SELECT 
              p.codigo AS id, 
              p.nombre, 
              p.descripcion, 
              pp.precio AS precio, 
              pp.costo AS costo,
              p.stock,
              pp.fecha_inicio AS fechaInicio,
              pp.fecha_fin AS fechaFin,
              p.foto_url
          FROM 
              producto p 
          LEFT JOIN 
              precio_producto pp ON p.codigo = pp.producto_id 
          WHERE 
              p.codigo = ?`,
          [params.id]
      );

      // Verificar si se encontró el producto
      if (result.length === 0) {
          return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
      }

      const producto = result[0];

      return NextResponse.json(producto, { status: 200 });
  } catch (error) {
      console.error('Error al obtener el detalle del producto:', error);
      return NextResponse.json({ error: 'Error al obtener el producto' }, { status: 500 });
  }
}


export async function PUT(req: Request) {
  try {
      const {
          nombre,
          descripcion,
          stock,
          precio,
          productoId,
          fecha_ultima_actualizacion,
      } = await req.json();

      // Convertir la fecha al formato adecuado (YYYY-MM-DD)
      const fechaFormateada = new Date(fecha_ultima_actualizacion).toISOString().split('T')[0];

      const connection = await connectToDatabase();

      // Actualizar el producto
      const [result]: any[] = await connection.execute(
          `UPDATE producto 
          SET nombre = ?, descripcion = ?, stock = ?, fecha_ultima_actualizacion = ? 
          WHERE codigo = ?`,
          [nombre, descripcion, stock, fechaFormateada, productoId]
      );

      // Actualizar el precio
      await connection.execute(
          `UPDATE precio_producto 
          SET precio = ?, costo = ? 
          WHERE producto_id = ?`,
          [precio.precio, precio.costo, productoId]
      );

      // Verificar si se actualizó correctamente
      if (result.affectedRows === 0) {
          return NextResponse.json({ error: 'Producto no encontrado o no se realizó ninguna actualización' }, { status: 404 });
      }

      return NextResponse.json({ message: 'Producto actualizado correctamente' }, { status: 200 });
  } catch (error) {
      console.error('Error al actualizar el producto:', error);
      return NextResponse.json({ error: 'Error al actualizar el producto' }, { status: 500 });
  }
}



export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const connection = await connectToDatabase();
    
    const [precioProducto]: any[] = await connection.execute(
      `DELETE FROM precio_producto WHERE producto_id = ?`,
      [params.id]
    );
    const [ventaProducto]: any[] = await connection.execute(
      `DELETE FROM venta_producto WHERE producto_id = ?`,
      [params.id]
    );
    const [compra_producto]: any[] = await connection.execute(
      `DELETE FROM compra_producto WHERE producto_id = ?`,
      [params.id]
    );
    const [result]: any[] = await connection.execute(
      `DELETE FROM producto WHERE codigo = ?`,
      [params.id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Producto eliminado correctamente' }, { status: 200 });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    return NextResponse.json({ error: 'Error al eliminar el producto' }, { status: 500 });
  }
}
