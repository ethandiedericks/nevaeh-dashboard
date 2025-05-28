import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db"

export const checkUser = async () => {
    const user = await currentUser();

    if (!user) {
        return null;
    }

    const loggedInUser = await db.user.findUnique({
        where:{
            clerkUserId: user?.id
        }
    });

    if (loggedInUser){
        return loggedInUser;
    }

    const newUser = await db.user.create({
        data: {
            clerkUserId:user.id,
            email: `${user.emailAddresses[0].emailAddress}`,
            imageUrl: user.imageUrl,
        }
    });

    return newUser;
}