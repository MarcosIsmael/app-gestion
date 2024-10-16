import connectToDatabase from '@/app/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
// Asegúrate de tener esta función para conectar a tu DB

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const connection = await connectToDatabase();

    // Consulta para obtener todas las marcas
    const [rows] = await connection.execute('SELECT id, nombre FROM marca');

    await connection.end();

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error al obtener las marcas:', error);
    return NextResponse.json({ error: 'Error en la base de datos' });
  }
}

// src/app/api/marcas/route.ts


export async function POST(req: Request, res: NextApiResponse) {
  try {
    // Parsear el cuerpo de la solicitud
    const body = await req.json();
    const { nombre } = body;

    // Validar que el nombre no esté vacío
    if (!nombre || typeof nombre !== 'string' || nombre.trim().length === 0) {
      return res.status(400).json({ error: 'El nombre es obligatorio y no puede estar vacío.' });
    }

    const connection = await connectToDatabase();

    // Verificar si la marca ya existe
    const [existingMarca] = await connection.execute(`
      SELECT * FROM marca WHERE nombre = ?
    `, [nombre]);

    if (existingMarca.length > 0) {
      return NextResponse.json({ error: 'La marca ya existe.', status:400 });
    }

    // Crear la nueva marca
    await connection.execute(`
      INSERT INTO marca (nombre) VALUES (?)
    `, [nombre]);

    // Cerrar la conexión
    await connection.end();

    return NextResponse.json({ message: 'Marca agregada exitosamente.', status:201 });
  } catch (error) {
    console.error('Error al agregar la marca:', error);
    return NextResponse.json({ error: 'Error al agregar la marca', status:500 });
  }
}
