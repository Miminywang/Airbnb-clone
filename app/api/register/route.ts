import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

import prisma from '../../libs/prismadb';

export async function POST (
    request: Request
) {
    //從request物件中提取並解析JASON
    const body = await request.json();
    const {
        email,
        name,
        password,
    } = body;

    //使用bcrypt庫中的hash函式對密碼進行雜湊(哈希)運算
    const hashedPassword = await bcrypt.hash(password, 12);

    //user.create創建新的用戶
    const user = await prisma.user.create({
        data: {
            email,
            name,
            hashedPassword
        }
    });

    //將用戶相關資訊以JSON格式回傳給客戶端
    return NextResponse.json(user);
}