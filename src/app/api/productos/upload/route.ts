import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Deshabilitar el procesamiento automático del cuerpo
export const config = {
  api: {
    bodyParser: false,
  },
};

// Función para manejar la carga de archivos de forma nativa
export async function POST(req: NextRequest) {
  try {
    const formData= await req.formData()
    
    // Crear un archivo temporal en el servidor para almacenar el archivo subido
    return NextResponse.json({
      message: 'Archivo subido correctamente',
      filename: 'uploaded-file',
    });
  } catch (error) {
    console.error('Error al manejar la carga de archivos:', error);
    return NextResponse.json({ error: 'Error procesando la solicitud' }, { status: 500 });
  }
}
