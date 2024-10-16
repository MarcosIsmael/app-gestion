import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/db';
import { OkPacket, RowDataPacket } from 'mysql2';
import { NextResponse } from 'next/server';

interface ProductoDBTypes {
  codigo: number;
  nombre: string;
  descripcion: string;
  stock: number;
}

export async function GET(req:NextApiRequest, res:NextApiResponse) {
  try {
    const connection = await connectToDatabase();

    // Ejecuta la consulta
    const [rows] = await connection.execute<ProductoDBTypes[] & RowDataPacket[]>(
      'SELECT * FROM producto'
    );

    // Cierra la conexión
    await connection.end();

    // Responde con los productos obtenidos
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error al conectarse a la base de datos o realizar la consulta:', error);
    NextResponse.json({ error: 'Error en la base de datos' });
  }
}

export async function POST(req:Request, res:NextApiResponse) {

  try {
    const body= await req.json()
    const { marca,tipoProducto,nombre, descripcion, stock,precio, costo } = body
    console.log(body)
    if (
      !nombre || 
      !descripcion || 
      stock === undefined || 
      !marca || 
      !tipoProducto || 
      precio === undefined || 
      costo === undefined
    ) {
      return NextResponse.json({ message: 'Faltan datos requeridos para crear el producto.', json:{marca,tipoProducto,nombre, descripcion, stock,precio, costo }});
    }
    const connection = await connectToDatabase();

    // Iniciar una transacción para asegurar la atomicidad
    await connection.beginTransaction();

    // 1. Verificar si la marca ya existe, si no, insertarla
    let [resultMarca] = await connection.execute<RowDataPacket[]>(
      'SELECT id FROM marca WHERE nombre = ?',
      [marca]
    );

    let marcaId: number;
    if (resultMarca.length > 0) {
      marcaId = resultMarca[0].id;
    } else {
      const [insertMarcaResult] = await connection.execute<OkPacket>(
        'INSERT INTO marca (nombre) VALUES (?)',
        [marca]
      );
      marcaId = insertMarcaResult.insertId;
    }

    // 2. Verificar si el tipo de producto ya existe, si no, insertarlo
    let [resultTipoProducto] = await connection.execute<RowDataPacket[]>(
      'SELECT id FROM tipo_producto WHERE nombre = ?',
      [tipoProducto]
    );

    let tipoProductoId: number;
    if (resultTipoProducto.length > 0) {
      tipoProductoId = resultTipoProducto[0].id;
    } else {
      const [insertTipoProductoResult] = await connection.execute<OkPacket>(
        'INSERT INTO tipo_producto (nombre) VALUES (?)',
        [tipoProducto]
      );
      tipoProductoId = insertTipoProductoResult.insertId;
    }

    // 3. Verificar si la relación marca-tipoproducto ya existe, si no, insertarla
    let [resultMarcaTipoProducto] = await connection.execute<RowDataPacket[]>(
      'SELECT id FROM marca_tipo_producto WHERE marca_id = ? AND tipo_producto_id = ?',
      [marcaId, tipoProductoId]
    );

    let marcaTipoProductoId: number;
    if (resultMarcaTipoProducto.length > 0) {
      marcaTipoProductoId = resultMarcaTipoProducto[0].id;
    } else {
      const [insertMarcaTipoProductoResult] = await connection.execute<OkPacket>(
        'INSERT INTO marca_tipo_producto (marca_id, tipo_producto_id) VALUES (?, ?)',
        [marcaId, tipoProductoId]
      );
      marcaTipoProductoId = insertMarcaTipoProductoResult.insertId;
    }

    // 4. Insertar el producto en la tabla `producto`
    const [resultProducto] = await connection.execute<OkPacket>(
      'INSERT INTO producto (nombre, descripcion, stock, marca_tipo, fecha_ultima_actualizacion) VALUES (?, ?, ?, ?, NOW())',
      [nombre, descripcion, stock, marcaTipoProductoId]
    );

    const productoId = resultProducto.insertId; // Obtener el ID del producto insertado

    // 5. Insertar el precio en la tabla `precioproducto`
    await connection.execute<OkPacket>(
      'INSERT INTO precio_producto (producto_id, precio, costo, fecha_inicio, fecha_fin) VALUES (?, ?, ?, NOW(), ?)',
      [productoId, precio, costo, '9999-12-31'] // Fecha de finalización futura para indicar que está activo
    );

    // Confirmar la transacción
    await connection.commit();

    // Cerrar la conexión
    await connection.end();

    return NextResponse.json({ message: 'Producto creado con éxito', productoId });
  } catch (error) {
    console.error('Error al agregar el producto y el precio:', error);

    // En caso de error, revertir la transacción
    const connection = await connectToDatabase();
    await connection.rollback();

    return NextResponse.json({ message: 'Error en el servidor' });
  }
}
export const config = { 
  api: {
    bodyParser: {
      sizeLimit: '1mb',  // Establece el tamaño máximo del cuerpo de la solicitud
    },
  },
};