import { Lucia } from "lucia";
import { getFirestoreDb } from "./firebase.server";
import { cookies } from "next/headers";

const adapter = {
  async getSessionAndUser(sessionId) {
    const db = getFirestoreDb();
    const sessionDoc = await db.collection("sessions").doc(sessionId).get();
    if (!sessionDoc.exists) return [null, null];
    const sessionData = sessionDoc.data();
    const userDoc = await db.collection("users").doc(sessionData.user_id).get();
    if (!userDoc.exists) return [null, null];
    const userData = userDoc.data();
    return [
      {
        id: sessionDoc.id,
        userId: sessionData.user_id,
        expiresAt: new Date(sessionData.expires_at),
        fresh: false
      },
      {
        id: userData?.id || userDoc.id,
        ...userData
      }
    ];
  },
  async getUserSessions(userId) {
    const db = getFirestoreDb();
    const snap = await db.collection("sessions").where("user_id", "==", userId).get();
    return snap.docs.map(doc => ({
      id: doc.id,
      userId: doc.data().user_id,
      expiresAt: new Date(doc.data().expires_at),
      fresh: false
    }));
  },
  async setSession(session) {
    const db = getFirestoreDb();
    await db.collection("sessions").doc(session.id).set({
      user_id: session.userId,
      expires_at: session.expiresAt.getTime()
    });
  },
  async updateSessionExpiration(sessionId, expiresAt) {
    const db = getFirestoreDb();
    await db.collection("sessions").doc(sessionId).update({
      expires_at: expiresAt.getTime()
    });
  },
  async deleteSession(sessionId) {
    const db = getFirestoreDb();
    await db.collection("sessions").doc(sessionId).delete();
  },
  async deleteUserSessions(userId) {
    const db = getFirestoreDb();
    const snap = await db.collection("sessions").where("user_id", "==", userId).get();
    const batch = db.batch();
    snap.docs.forEach(doc => batch.delete(doc.ref));
    if (snap.docs.length > 0) await batch.commit();
  },
  async deleteExpiredSessions() {
    const db = getFirestoreDb();
    const snap = await db.collection("sessions").where("expires_at", "<", Date.now()).get();
    const batch = db.batch();
    snap.docs.forEach(doc => batch.delete(doc.ref));
    if (snap.docs.length > 0) await batch.commit();
  }
};

export const lucia = new Lucia(adapter,{
    sessionCookies:{
        expires:false,
        attributes:{
            secure: process.env.NODE_ENV === "production"
        }
    },
    getUserAttributes: (attributes) => {
        if (!attributes) {
            return {
                id: '',
                name: '',
                email: '',
                profileImage: null
            };
        }
        return {
            id: attributes.id || '',
            name: attributes.name || '',
            email: attributes.email || '',
            profileImage: attributes.profile_image || null
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