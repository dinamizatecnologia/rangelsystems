'use server';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    const { usuario, senha, dias } = await req.json();

    try {
        await connectToDatabase();

        // Buscar usuário
        const user = await User.findOne({ email: usuario });
        if (!user) {
            return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
        }

        // Comparar senha (se usar hash)
        const senhaCorreta = await bcrypt.compare(senha, user.senha);
        if (!senhaCorreta) {
            return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
        }

        // Montar payload do JWT
        const payload = {
            id: user._id,
            email: user.email,
            nome: user.nome,
            cel: user.cel,
            nv_acesso: user.nv_acesso,
            ...user.acessos
        };

        const secretKey = process.env.JWT_SECRET_KEY || 'secreta';
        const token = jwt.sign(payload, secretKey, { expiresIn: dias ? '14d' : '3d' });

        // Criar cookie seguro
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: dias ? 14 * 24 * 60 * 60 : 3 * 24 * 60 * 60
        };

        cookies().set('auth_token', token, cookieOptions);

        return NextResponse.json({ message: 'Login bem-sucedido' });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
