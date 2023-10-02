import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(
    request: Request
) {
    const currentUser = await getCurrentUser();

    //檢查currentUser是否存在
    if (!currentUser) {
        return NextResponse.error();
    }

    //提取request物件並解析json格式
    const body = await request.json();

    const {
        listingId,
        startDate,
        endDate, 
        totalPrice
    } = body

    if (!listingId || !startDate || !endDate || !totalPrice) {
        return Response.error();
    }

    //在資料庫更新列表資訊
    const listingAndReservation = await prisma.listing.update({
        where: {
            id: listingId
        },
        data: {
            reservations: {
                create: {
                  userId: currentUser.id,
                  startDate,
                  endDate,
                  totalPrice  
                }
            }
        }
    });
    return NextResponse.json(listingAndReservation);
}