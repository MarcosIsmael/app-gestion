import connectToDatabase from "@/app/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest) {
  try {
    const connection = await connectToDatabase();

    const [registroVenta]: any[] = await connection.query(`
    SELECT f.id, f.fecha, f.monto, mp.nombre AS metodo_de_pago, f.descripcion
    FROM finanzas f
    LEFT JOIN registro_de_ventas rc ON f.venta_id = rc.id
    JOIN metodo_pago mp ON mp.id = rc.metodo_pago_id
    WHERE f.monto > 0;
`)
    await connection.end();
    return NextResponse.json(registroVenta);
  } catch (error) {
    console.error('Error fetching sales records:', error);
    return NextResponse.json({ error: 'Error al obtener las ventas' }, { status: 500 });
  }
}
export async function POST(req: Request, res: NextApiResponse) {
  const body= await req.json()
  const { fecha, monto, descripcion, metodo_pago_id } = body;

  if (!fecha || !monto || !descripcion || !metodo_pago_id) {
    return NextResponse.json({ message: 'Todos los campos son requeridos' }, { status: 400 });
  }

  const connection = await connectToDatabase();

  try {
    // Iniciar transacción para garantizar la consistencia entre ambas tablas
    await connection.beginTransaction();

    // Insertar registro en `registro_de_ventas`
    const [resultVenta]: any = await connection.query(
      `
        INSERT INTO registro_de_ventas (fecha, importe, metodo_pago_id) 
        VALUES (?, ?, ?)
        `,
      [fecha, monto, metodo_pago_id]
    );

    const ventaId = resultVenta.insertId;

    // Insertar registro en `finanzas` vinculado con el `registro_de_ventas`
    await connection.query(
      `
        INSERT INTO finanzas (fecha, monto, descripcion, venta_id) 
        VALUES (?, ?, ?, ?)
        `,
      [fecha, monto, descripcion, ventaId]
    );

    // Confirmar transacción
    await connection.commit();

   return NextResponse.json({ message: 'Ingreso registrado exitosamente' });
  } catch (error) {
    // Revertir transacción en caso de error
    await connection.rollback();
    console.error('Error al registrar el ingreso:', error);
   return NextResponse.json({ message: 'Error al registrar el ingreso' }, { status: 500 });
  }
}