import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/app/lib/db';
import { NextRequest } from 'next/server';
import { NextApiResponse } from 'next';

export async function POST(req : NextRequest, res : NextApiResponse) {
 
    const { email, password } = await req.json();

    try {
        const connection = await connectToDatabase();
            // Iniciar una transacción
    await connection.beginTransaction();
      const [rows] : any[] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);

      if (rows.length === 0) {
        return res.status(401).json({ error: 'Usuario no encontrado' });
      }

      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
      }

      // Genera un token JWT con el rol del usuario
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        'secret_key',
        { expiresIn: '1h' }
      );

      res.status(200).json({ token });
    } catch (err) {
      res.status(500).json({ error: 'Error en el servidor' });
    }
   
}
