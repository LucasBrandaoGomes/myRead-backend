import { UserBook } from "@prisma/client";
import { prisma } from "../database/database";
import { UserBookInsertData } from "../types/userBookType";

export async function insertNewRead(data: UserBookInsertData) : Promise <void> {
    await prisma.userBook.create({data})
}

export async function findUniqueUserBook(userId:number, bookId:number) : Promise < UserBook > {
    const result = await prisma.userBook.findUnique(
        {where: 
            {userId_bookId: {
                userId: userId,
                bookId: bookId
                },
            },
        },
    )
    return result
}

export async function updateReadPages(id:number, value: number) : Promise < void > {
    await prisma.userBook.update({
        where: {
          id: id
        },
        data: {
          readPages: value
        },
      })
}

export async function findUserReads(userId:number) {
    const result = await prisma.userBook.findMany({
        where: {userId:userId},
        select:{
            id:true,
            userId:true,
            bookId:true,
            readPages: true,
            book:{
                select:{
                    title: true,
                    author: true,
                    totalPages:true,
                    synopsis:true
                }

            }
        }
    }
    )
    return result
}

export async function deleteReadById(id:number) {
    await prisma.userBook.delete({where:{id:id}})
}