import { NextResponse } from 'next/server';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import connectToDatabase from '@/app/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nombre, direccion, telefono, celular, descripcion } = body;

    // Validaciones básicas
    if (!nombre || !direccion || !telefono || !celular) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 });
    }

    const connection = await connectToDatabase();

    // Verificar si el proveedor ya existe
    const [existingProveedor] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM proveedores WHERE nombre = ?',
      [nombre]
    );

    if (existingProveedor.length > 0) {
      await connection.end();
      return NextResponse.json({ error: 'El proveedor ya existe' }, { status: 400 });
    }

    // Inserción del nuevo proveedor
    const [result] = await connection.execute<ResultSetHeader>(
      'INSERT INTO proveedores (nombre, direccion, telefono, celular, descripcion) VALUES (?, ?, ?, ?, ?)',
      [nombre, direccion, telefono, celular, descripcion || null]
    );

    await connection.end();

    return NextResponse.json({ message: 'Proveedor agregado exitosamente', id: result.insertId });
  } catch (error) {
    console.error('Error al agregar el proveedor:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
export async function GET() {
    try {
      const connection = await connectToDatabase();
  
      // Consulta para obtener todos los proveedores
      const [rows] = await connection.execute<RowDataPacket[]>('SELECT * FROM proveedores');
  
      await connection.end();
  
      return NextResponse.json(rows);
    } catch (error) {
      console.error('Error al obtener los proveedores:', error);
      return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
  }