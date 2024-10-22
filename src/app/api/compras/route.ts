import { NextResponse } from 'next/server';

import { ResultSetHeader } from 'mysql2';
import connectToDatabase from '@/app/lib/db';

export async function POST(req: Request) {
  try {
    const { fecha, proveedorId, importeTotal, compraProductos } = await req.json();

    // Validaciones
    if (!fecha || !proveedorId || !importeTotal || !Array.isArray(compraProductos) || compraProductos.length === 0) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios y compraProductos debe ser un arreglo no vacío' }, { status: 400 });
    }

    const connection = await connectToDatabase();

    // Insertar la compra
    const [result] = await connection.execute<ResultSetHeader>(
      'INSERT INTO compras (fecha, proveedor_id, importe_total) VALUES (?, ?, ?)',
      [fecha, proveedorId, parseFloat(importeTotal)] // Asegúrate de que importeTotal sea un número
    );

    // Obtener el ID de la compra recién creada
    const compraId = result.insertId;

    // Aquí deberías agregar la lógica para insertar los productos en la tabla correspondiente, si es necesario.

    // Cerrar la conexión
    await connection.end();

    return NextResponse.json({ insertId: compraId }, { status: 201 });
  } catch (error) {
    console.error('Error al guardar la compra:', error);
    return NextResponse.json({ error: 'Error al guardar la compra' }, { status: 500 });
  }
}
export async function GET() {
    try {
      const connection = await connectToDatabase();
  
      // Ejecuta la consulta para obtener las compras
      const [compras] = await connection.execute(`
        SELECT c.id, p.nombre AS proveedor, c.fecha, c.importe_total AS importeTotal
        FROM compras c
        JOIN proveedores p ON c.proveedor_id = p.id
      `);
  
      // Cierra la conexión
      await connection.end();
  
      // Responde con los datos de las compras
      return NextResponse.json(compras);
    } catch (error) {
      console.error('Error al obtener las compras:', error);
      return NextResponse.json({ error: 'Error al obtener las compras' }, { status: 500 });
    }
  }
