// pages/api/estadisticas.ts
import connectToDatabase from '@/app/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextApiResponse) {
  const mes = req.nextUrl.searchParams.get('mes');
  const connection = await connectToDatabase();

  try {
    const [productoMasVendido] = await connection.query(`
      SELECT p.nombre, COUNT(*) as cantidad
      FROM venta_producto vp
      JOIN producto p ON vp.producto_id = p.codigo
      JOIN registro_de_ventas rv ON vp.venta_id = rv.id 
      WHERE MONTH(rv.fecha) = ?
      GROUP BY p.nombre
      ORDER BY cantidad DESC
      LIMIT 5
    `, [mes]);

    const [ventasComparativas] = await connection.query(`
      SELECT DATE_FORMAT(fecha, '%Y-%m') as mes, COUNT(*) as ventas
      FROM registro_de_ventas
      GROUP BY mes
    `);

    const [actualizacionesPrecios] = await connection.query(`
      SELECT DATE_FORMAT(fecha_inicio, '%Y-%m') as mes, COUNT(*) as actualizaciones
      FROM precio_producto
      WHERE MONTH(fecha_inicio) = ?
      GROUP BY mes
    `, [mes]);

    const [marcaMasVendida] = await connection.query(`
      SELECT m.nombre as marca, COUNT(*) as cantidad
      FROM venta_producto vp
      JOIN producto p ON vp.producto_id = p.codigo
      JOIN marca_tipo_producto mtp ON p.marca_tipo = mtp.id
      JOIN marca m ON mtp.marca_id = m.id
      JOIN registro_de_ventas rv ON vp.venta_id = rv.id
      WHERE MONTH(rv.fecha) = ?
      GROUP BY m.nombre
      ORDER BY cantidad DESC
      LIMIT 5
    `, [mes]);

    return NextResponse.json({
      productoMasVendido,
      ventasComparativas,
      actualizacionesPrecios,
      marcaMasVendida,
    });
  } catch (error) {
    console.error("Error al obtener las estadísticas:", error);
    return NextResponse.json({ error: 'Error al obtener las estadísticas' }, { status: 500 });
  } finally {
    connection.end();
  }
}
