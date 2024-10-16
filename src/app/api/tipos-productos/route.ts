import connectToDatabase from '@/app/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const connection = await connectToDatabase();

    // Consulta para obtener todos los tipos de productos
    const [rows] = await connection.execute('SELECT id, nombre FROM tipo_producto');

    await connection.end();

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error al obtener los tipos de productos:', error);
    return NextResponse.json({ error: 'Error en la base de datos', status:500 });
  }
}

export async function POST(req: Request, res: NextApiResponse) {
  try {
    // Extraer el nombre del cuerpo de la solicitud
    const { nombre } = await req.json();

    // Validar que el nombre no esté vacío
    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es requerido' });
    }

    // Conectar a la base de datos
    const connection = await connectToDatabase();

    // Comprobar si el tipo de producto ya existe
    const [existingType] = await connection.execute(
      'SELECT * FROM tipo_producto WHERE nombre = ?',
      [nombre]
    );

    // Si existe, devolver un error 409 (Conflicto)
    if (existingType.length > 0) {
      return NextResponse.json({ error: 'El tipo de producto ya existe', status:409 });
    }

    // Agregar el nuevo tipo de producto
    await connection.execute(
      'INSERT INTO tipo_producto (nombre) VALUES (?)',
      [nombre]
    );

    // Cerrar la conexión
    await connection.end();

    // Responder con éxito
    return NextResponse.json({ message: 'Tipo de producto agregado exitosamente', status:201 });
  } catch (error) {
    console.error('Error al agregar el tipo de producto:', error);
    return NextResponse.json({ error: 'Error en la base de datos', status:500 });
  }
}
