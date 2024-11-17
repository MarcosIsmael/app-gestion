import {  NextApiResponse } from 'next';
import connectToDatabase from '../../lib/db';
import { RowDataPacket } from 'mysql2';
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';


interface ProductoDBTypes {
  nombre: string;
  codigo:number;
  descripcion: string;
  stock: number;
  marca_tipo: number;
  foto_url:string;
  precio:string;
  costo:string
}

export async function GET(req:NextRequest, res:NextApiResponse) {
  try {
    const connection = await connectToDatabase();

    // Ejecuta la consulta
    const [rows] = await connection.execute<ProductoDBTypes[] & RowDataPacket[]>(
      `SELECT p.codigo, p.nombre, p.descripcion, pp.precio, pp.costo , p.stock, p.foto_url  FROM producto p 
      JOIN precio_producto PP ON PP.producto_id = p.codigo
      ` 
    );

    // Cierra la conexión
    await connection.end();

    // Responde con los productos obtenidos
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error al conectarse a la base de datos o realizar la consulta:', error);
    return NextResponse.json({ error: 'Error en la base de datos' });
  }
}


// export const config = {
//   api: {
//     bodyParser: true, // Necesario para manejar la carga de archivos con formidable
//   },
// };
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Configura tus variables de entorno
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest, res: NextApiResponse) {
  try {
    const formData = await req.formData()
    const data ={
     nombre: formData.get('nombre'),
    descripcion: formData.get('descripcion'),
     stock: formData.get('stock'),
      marca: formData.get('marca'),
      tipoProducto : formData.get('tipoProducto'),
      precio : formData.get('precio'),
      costo: formData.get('costo'),
      imagen: formData.get('imagen'),
    }
    if(!data.imagen){
      return NextResponse.json('falta imagen')
    }
    console.log('???', data)
    const imagenFile = data.imagen as string; // Asegúrate de que el tipo sea 'File'
    // const bytes = await imagenFile.arrayBuffer()
    // const buffer = Buffer.from(bytes)
    const result = await cloudinary.uploader.upload(imagenFile, {
      folder: 'productos', // Opcional: Define una carpeta en Cloudinary
      use_filename: true, // Usa el nombre del archivo original
      unique_filename: false, // Opcional: Permite nombres repetidos
    });
    const { nombre, descripcion, stock, marca, tipoProducto, precio, costo, imagen } = data;

    if (!nombre || !descripcion || stock === undefined || !marca || !tipoProducto || precio === undefined || costo === undefined || !imagen) {
      return NextResponse.json({ message: 'Faltan datos requeridos para crear el producto.' },{status:500});
    }

    // Aquí puedes subir la imagen a un servicio de almacenamiento

    const connection = await connectToDatabase();
    await connection.beginTransaction();

    // Lógica para insertar producto
    let [resultMarca] : any[] = await connection.execute('SELECT id FROM marca WHERE nombre = ?', [marca]);
    let marcaId = resultMarca.length ? resultMarca[0].id : (await connection.execute('INSERT INTO marca (nombre) VALUES (?)', [marca]) as any )  [0].insertId;

    let [resultTipoProducto]:any[] = await connection.execute('SELECT id FROM tipo_producto WHERE nombre = ?', [tipoProducto]);
    let tipoProductoId = resultTipoProducto.length ? resultTipoProducto[0].id : (await connection.execute('INSERT INTO tipo_producto (nombre) VALUES (?)', [tipoProducto]) as any)[0].insertId;

    let [resultMarcaTipoProducto] : any[] = await connection.execute('SELECT id FROM marca_tipo_producto WHERE marca_id = ? AND tipo_producto_id = ?', [marcaId, tipoProductoId]);
    let marcaTipoProductoId = resultMarcaTipoProducto.length ? resultMarcaTipoProducto[0].id : (await connection.execute('INSERT INTO marca_tipo_producto (marca_id, tipo_producto_id) VALUES (?, ?)', [marcaId, tipoProductoId]) as any)[0].insertId;

    const [resultProducto]: any = await connection.execute('INSERT INTO producto (nombre, descripcion, stock, marca_tipo, fecha_ultima_actualizacion, foto_url) VALUES (?, ?, ?, ?, NOW(), ?)', [nombre, descripcion, stock, marcaTipoProductoId, result.secure_url]);
    const productoId = resultProducto.insertId;

    await connection.execute('INSERT INTO precio_producto (producto_id, precio, costo, fecha_inicio, fecha_fin) VALUES (?, ?, ?, NOW(), ?)', [productoId, precio, costo, '9999-12-31']);

    await connection.commit();
    await connection.end();

    return NextResponse.json({ message: 'Producto creado con éxito', productoId });
  } catch (error) {
    console.error('Error al crear el producto:', error);
    return NextResponse.json({ message: 'Error al crear el producto.' },{status:500});
  }
}

