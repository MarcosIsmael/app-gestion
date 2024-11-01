import connectToDatabase from "@/app/lib/db";
import { RowDataPacket } from "mysql2";
import { NextApiRequest, NextApiResponse } from "next";
import { useParams } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest, { params }: { params: { id: string } }) {
    try {
        const {id} = params
      const connection = await connectToDatabase();
      const [registroVenta]: any[] = await connection.query(`
        SELECT rv.fecha, rv.importe, mp.nombre AS tipo_pago 
        FROM registro_de_ventas rv 
        JOIN metodo_pago mp ON mp.id = rv.metodo_pago_id
        WHERE rv.id = ?
        `, [id]
      );
      const [productos]: any[] = await connection.query(`
        SELECT vp.cantidad, p.nombre, p.stock, p.fecha_ultima_actualizacion, p.foto_url, pp.precio 
        FROM venta_producto vp 
        JOIN producto p ON p.codigo = vp.producto_id 
        JOIN precio_producto pp ON pp.producto_id = p.codigo  
        WHERE vp.venta_id = ?
        AND (pp.fecha_fin IS NULL OR pp.fecha_fin > CURDATE())
    `, [id]
      );
      await connection.end();
      return NextResponse.json({...registroVenta[0], productos:productos});
    } catch (error) {
      console.error('Error fetching sales records:', error);
      return NextResponse.json({ error: 'Error al obtener las ventas' }, {status:500});
    }
  }