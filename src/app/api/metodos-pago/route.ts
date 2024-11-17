import {  NextApiResponse } from 'next';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import connectToDatabase from '@/app/lib/db';
import { NextRequest, NextResponse } from 'next/server';

interface MetodoPago extends RowDataPacket {
  id: number;
  nombre: string;
}

export async function GET(req: NextRequest, res: NextApiResponse) {

  try {
    const connection = await connectToDatabase();

    // Consulta para obtener los métodos de pago
    const [metodosPago] = await connection.execute<MetodoPago[]>(
      'SELECT id, nombre FROM metodo_pago'
    );

    // Cerrar la conexión a la base de datos
    await connection.end();

    // Responder con los métodos de pago obtenidos
    return NextResponse.json(metodosPago);
  } catch (error) {
    console.error('Error al obtener métodos de pago:', error);
    return NextResponse.json({ message: 'Error al obtener métodos de pago' },{status:500});
  }
}
export async function POST(req: NextRequest) {
  try {
    const { nombre } = await req.json(); // Obtener los datos enviados desde el cliente

    // Validación del nombre del método de pago
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
      return NextResponse.json({ error: 'El nombre del método de pago es requerido y debe ser una cadena válida.' }, { status: 400 });
    }

    const connection = await connectToDatabase();

    // Verificar si el método de pago ya existe
    const [existingMetodo]: [RowDataPacket[], any] = await connection.execute(
      'SELECT id FROM metodo_pago WHERE nombre = ?',
      [nombre]
    );

    if (existingMetodo.length > 0) {
      await connection.end();
      return NextResponse.json({ error: 'El método de pago ya existe.' }, { status: 409 });
    }

    // Insertar el nuevo método de pago
    const [result]: [ResultSetHeader, any]= await connection.execute(
      'INSERT INTO metodo_pago (nombre) VALUES (?)',
      [nombre]
    );

    await connection.end();

    // Respuesta exitosa
    return NextResponse.json({ message: 'Método de pago agregado exitosamente', metodoId: result.insertId }, { status: 201 });
  } catch (error) {
    console.error('Error al agregar el método de pago:', error);
    return NextResponse.json({ error: 'Error interno en el servidor' }, { status: 500 });
  }
}
