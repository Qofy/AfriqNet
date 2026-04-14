import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import { Lucia } from "lucia";
import db from "./db.server";
import { cookies } from "next/headers";

const adapter = new BetterSqlite3Adapter(db,{
    user: "users",
    session: "sessions"
})
const lucia = new Lucia(adapter,{
    sessionCookies:{
        expires:false,
        attributes:{
            secure: process.env.NODE_ENV === "production"
        }
    },
    getUserAttributes: (attributes) => {
        return {
            id: attributes.id,
            name: attributes.name,
            email: attributes.email
        };
    }
});

export async function createAuthSession(userId) {
   const session = await lucia.createSession(userId, {});
   const sessionCookie = lucia.createSessionCookie(session.id);
   const cookiesStore = await cookies();
   cookiesStore.set(
       sessionCookie.name,
       sessionCookie.value,
       sessionCookie.attributes
   );
};

export async function verifyAuth() {
    const sessionCookie = (await cookies()).get(
        lucia.sessionCookieName
    );
    if(!sessionCookie){
        return{
            user: null,
            session:null
        }
    }

    const sessionId = sessionCookie.value;
    if(!sessionId){
        return{
            user:null,
            session:null
        }
    };

    const result = await lucia.validateSession(sessionId);
    try{
        if(result.session && result.session.fresh){
            const sessionCookie = lucia.createSessionCookie(result.session);
             const cookiesStore = await cookies();
    cookiesStore.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
    );
        }
        if(!result.session){
            const sessionCookie = lucia.createBlankSessionCookie();
             const cookiesStore = await cookies();
    cookiesStore.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
    );
        }
    }catch{}

    // Return structured result for server components
    return {
        user: result?.user ?? null,
        session: result?.session ?? null
    };
}

export default async function destorySession(){
    const {session} = await verifyAuth();
    if(!session){
        return{
            error:"Unauthorized"
        }
    }
    await lucia.invalidateSession(session.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    const cookiesStore = await cookies();
    cookiesStore.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
    );
}