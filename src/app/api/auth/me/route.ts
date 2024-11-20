import { NextApiRequest, NextApiResponse } from 'next';
import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/db';

export async function GET(req: NextRequest, res: NextApiResponse) {
  const token = req.cookies.get('auth')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Not authenticated' }, {status:401});
  }

  try {
    const connection = await connectToDatabase();

    // Consulta el usuario en la base de datos
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const [users]: any[] = await connection.execute('SELECT * FROM users WHERE id = ?', [payload.id]);
    const user = users[0];

    return NextResponse.json({...payload, ...user}, {status:200});
  } catch (error) {
    return NextResponse.json({ message: 'Invalid token' },{status:401});
  }
}
