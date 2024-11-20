import bcrypt from 'bcrypt';
import connectToDatabase, {pool} from '@/app/lib/db';  // Importa el pool
import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest) {
  const { email, password, role } = await req.json();

  if (!email || !password || !role) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
  }

  try {
    const connection = await connectToDatabase();

    // Iniciar una transacción
    await connection.beginTransaction();
    // Usamos el pool para obtener una conexión
    // const connection = await pool.getConnection();
    // // Iniciar una transacción
    // await connection.beginTransaction();
    
    const hashedPassword = await bcrypt.hash(password, 10);
    // Insertar el usuario en la base de datos
    console.log('???', role)
    const [result]: any[] = await connection.execute(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)', 
      [email, hashedPassword, role]
    );

    // Confirmar la transacción
    await connection.commit();

    if (result) {
      return NextResponse.json({ message: 'User created' }, { status: 201 });
    } else {
      return NextResponse.json({ message: 'Error registering user', result }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Error registering user', error: error }, { status: 500 });
  }
}
