import connectToDatabase from "@/app/lib/db";
import {  NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: NextApiResponse) {
    const { codigo, stock } = await req.json();
  
    try {
      const connection = await connectToDatabase();
      await connection.execute('UPDATE producto SET stock = ? WHERE codigo = ?', [stock, codigo]);
      await connection.end();
      return NextResponse.json({ message: 'Stock actualizado con éxito' });
    } catch (error) {
      console.error('Error al actualizar el stock:', error);
      return NextResponse.json({ error: 'Error en la base de datos' }, {status:500});
    }
  }