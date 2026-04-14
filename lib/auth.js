import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import { Lucia } from "lucia";
import db from "./db.server";
import { cookies } from "next/headers";

const adapter = new BetterSqlite3Adapter(db,{
    users: "users",
    sessions: "sessions"
})
const lucia = new Lucia(adapter,{
    sessionCookies:{
        expires:false,
        attributes:{
            secure: process.env.NODE_ENV === "production"
        }
    }
});

export async function createAuthSession(userId) {
   const session = await lucia.createSession(userId,{})
   const sessionCookie=  lucia.createSessionCookie(session.id)
    (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
    )
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

    const result = lucia.validateSession(sessionId);
    try{
        if(result.session && result.session.fresh){
            const sessionCookie = lucia.createSessionCookie(result.session);
            (await cookies()).set(
                sessionCookie.name,
                sessionCookie.value,
                sessionCookie.attributes
            )
        }
        if(!result.session){
            const sessionCookie = lucia.createBlankSessionCookie();
            (await cookies()).set(
                sessionCookie.name,
                sessionCookie.value,
                sessionCookie.attributes
            )
        }
    }catch{}

    // Return structured result for server components
    return {
        user: result?.user ?? null,
        session: result?.session ?? null
    };
}