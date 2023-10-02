//與數據庫進行交互運用
import prisma from "@/app/libs/prismadb";
//獲取用戶當前訊息
import getCurrentUser from "./getCurrentUser";

export default async function getFavoriteListings() {
    try {
      const currentUser = await getCurrentUser();
  
      if (!currentUser) {
        return [];
      }

      //使用prisma查詢數據庫，以獲取用戶的收藏列表
      const favorites = await prisma.listing.findMany({
        where: {
          id: {
            in: [...(currentUser.favoriteIds || [])]
          }
        }
      });
      
      //使用map方法遍歷favorites數組並進行處理
      const safeFavorites = favorites.map((favorite) => ({
        ...favorite,
        createdAt: favorite.createdAt.toString()
        }));
        
        return safeFavorites;
    } catch (error: any) {
        throw new Error(error);
    }
}