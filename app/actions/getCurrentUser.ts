import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/app/libs/prismadb";

// 用於獲取用戶的身分驗證訊息，包括登入狀態等
export async function getSession() {
  return await getServerSession(authOptions)
}

//用於獲取用戶的個人訊息，例如戶名、信箱等
export default async function getCurrentUser() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    //使用prisma進行數據庫查詢，根據用戶信箱查找該用戶紀錄
    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      }
    });

    if (!currentUser) {
      return null;
    }

    return {
      ...currentUser,
      createdAt: currentUser.createdAt.toISOString(),
      updatedAt: currentUser.updatedAt.toISOString(),
      emailVerified: 
        currentUser.emailVerified?.toISOString() || null,
    };
  } catch (error: any) {
    return null;
  }
}