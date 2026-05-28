import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  onSnapshot, 
  query, 
  limit 
} from "firebase/firestore";

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

let firebaseConfig: any = null;
let isFirebaseActive = false;
let db: any = null;
let auth: any = null;

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errMsg = error instanceof Error ? error.message : String(error);
  const errInfo: FirestoreErrorInfo = {
    error: errMsg,
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo: auth?.currentUser?.providerData?.map((provider: any) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  
  if (errMsg.toLowerCase().includes('offline') || errMsg.toLowerCase().includes('failed to get document')) {
    console.warn('⚡ [SkillSpark] Firestore connection is offline. Operation bypassed safely.', errInfo);
    return;
  }

  throw new Error(JSON.stringify(errInfo));
}

export async function checkFirebaseReady(): Promise<boolean> {
  try {
    const response = await fetch("/firebase-applet-config.json");
    if (response.ok) {
      const config = await response.json();
      if (config && config.apiKey) {
        firebaseConfig = config;
        
        const app = getApps().length === 0 ? initializeApp(config) : getApp();
        db = getFirestore(app);
        auth = getAuth(app);
        isFirebaseActive = true;
        console.log("⚡ [SkillSpark] Connected successfully to Cloud Firebase.");

        // Hook listener for Auth synchronization
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            console.log("👤 [SkillSpark] User certified in Cloud Session:", user.uid);
            await syncUserProfileFromFirebase(user.uid);
          } else {
            try {
              await signInAnonymously(auth);
            } catch (e) {
              console.warn("Anonymous Cloud Auth disabled/failed:", e);
            }
          }
        });

        // Trigger safe test get connection request
        try {
          const userCheckRef = doc(db, 'test', 'connection');
          await getDoc(userCheckRef);
        } catch (err) {
          // connection established but collections not created
        }

        return true;
      }
    }
  } catch (err) {
    // Suppress console, fall back nicely to offline mock mode
  }
  return false;
}

async function syncUserProfileFromFirebase(uid: string) {
  if (!isFirebaseActive || !db) return;
  try {
    const userDocRef = doc(db, "users", uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const fbProfile = snap.data();
      EmulatedDatabase.storeDirect({
        userId: uid,
        displayName: fbProfile.displayName || "Sparks Club",
        email: fbProfile.email || "cloud.linked@skillspark.com",
        avatar: fbProfile.avatar || "⚡",
        skillLevel: fbProfile.skillLevel || "Novice",
        xp: fbProfile.xp || 120,
        savedCourses: fbProfile.savedCourses || [],
        completedCourses: fbProfile.completedCourses || [],
        completedLessons: fbProfile.completedLessons || [],
        unlockedAchievements: fbProfile.unlockedAchievements || [],
        portfolio: fbProfile.portfolio || []
      });
    } else {
      // Seed user profile from current local mock state
      const localProfile = EmulatedDatabase.getProfile();
      localProfile.userId = uid;
      if (localProfile.email.includes("guest")) {
        localProfile.email = auth?.currentUser?.email || `sparky.${uid.slice(0, 5)}@skillspark.com`;
      }
      EmulatedDatabase.storeDirect(localProfile);
      
      const cleanProfile = {
        userId: uid,
        displayName: localProfile.displayName || "Sparks Club",
        avatar: localProfile.avatar || "⚡",
        skillLevel: localProfile.skillLevel || "Novice",
        xp: Number(localProfile.xp || 120),
        savedCourses: localProfile.savedCourses || [],
        completedCourses: localProfile.completedCourses || [],
        completedLessons: localProfile.completedLessons || [],
        unlockedAchievements: localProfile.unlockedAchievements || [],
        portfolio: localProfile.portfolio || []
      };
      
      await setDoc(userDocRef, cleanProfile);
    }
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    if (errMsg.toLowerCase().includes('offline') || errMsg.toLowerCase().includes('failed to get document')) {
      console.warn('⚡ [SkillSpark] Connection offline during user profile syncing. Loading local emulated profile.');
      const localProfile = EmulatedDatabase.getProfile();
      localProfile.userId = uid;
      EmulatedDatabase.storeDirect(localProfile);
      return;
    }
    handleFirestoreError(error, OperationType.GET, `users/${uid}`);
  }
}

export async function loginWithGoogleCloud() {
  if (!auth) return null;
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Popup auth sign in issue:", error);
    return null;
  }
}

export async function logoutCloud() {
  if (!auth) return;
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Sign out issue:", error);
  }
}

// Client-side Emulated Local Database backed by localStorage
export class EmulatedDatabase {
  private static getStore(key: string, defaultVal: any): any {
    const saved = localStorage.getItem(`skillspark_${key}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultVal;
      }
    }
    return defaultVal;
  }

  private static setStore(key: string, data: any) {
    localStorage.setItem(`skillspark_${key}`, JSON.stringify(data));
  }

  static storeDirect(profile: any) {
    this.setStore("user_profile", profile);
    window.dispatchEvent(new Event("skillspark_profile_updated"));
  }

  static getProfile(): any {
    return this.getStore("user_profile", {
      userId: "spark-user-1337",
      displayName: "CreatorSlayer_99",
      email: "guest.creator@skillspark.com",
      avatar: "🚀",
      skillLevel: "Novice",
      xp: 120,
      savedCourses: ["course-1"],
      completedCourses: [],
      completedLessons: [],
      unlockedAchievements: ["ach-1"],
      portfolio: [
        { id: "p-1", title: "Custom CapCut Vlog Intro", imageUrl: "https://images.unsplash.com/photo-1622737133809-d95047b9e673?w=300&q=80", likes: 24 }
      ]
    });
  }

  static saveProfile(profile: any) {
    this.setStore("user_profile", profile);
    window.dispatchEvent(new Event("skillspark_profile_updated"));

    if (isFirebaseActive && db && auth?.currentUser?.uid) {
      const uid = auth.currentUser.uid;
      const userDocRef = doc(db, "users", uid);
      const cleanProfile = {
        userId: uid,
        displayName: profile.displayName || "Sparks Club",
        avatar: profile.avatar || "⚡",
        skillLevel: profile.skillLevel || "Novice",
        xp: Number(profile.xp || 120),
        savedCourses: profile.savedCourses || [],
        completedCourses: profile.completedCourses || [],
        completedLessons: profile.completedLessons || [],
        unlockedAchievements: profile.unlockedAchievements || [],
        portfolio: profile.portfolio || []
      };
      
      setDoc(userDocRef, cleanProfile).catch((err) => {
        handleFirestoreError(err, OperationType.WRITE, `users/${uid}`);
      });
    }
  }

  static getGigs(): any[] {
    return this.getStore("gigs_list", []);
  }

  static saveGigs(gigs: any[]) {
    this.setStore("gigs_list", gigs);
    window.dispatchEvent(new Event("skillspark_gigs_updated"));
  }

  static getCommunityFeed(): any[] {
    return this.getStore("community_feed", []);
  }

  static saveCommunityFeed(feed: any[]) {
    this.setStore("community_feed", feed);
    window.dispatchEvent(new Event("skillspark_feed_updated"));
  }

  static saveNewCommunityPost(post: any) {
    let localFeed = this.getCommunityFeed();
    localFeed = [post, ...localFeed];
    this.saveCommunityFeed(localFeed);

    if (isFirebaseActive && db && auth?.currentUser?.uid) {
      const postId = post.id || ("post_" + Date.now());
      const postDocRef = doc(db, "community_feed", postId);
      
      const cleanPost = {
        postId: postId,
        authorId: auth.currentUser.uid,
        authorName: post.authorName,
        authorAvatar: post.authorAvatar,
        imageUrl: post.imageUrl || "",
        caption: post.caption || "",
        likesCount: Number(post.likesCount || 0),
        likedBy: post.likedBy || [],
        commentsCount: Number(post.commentsCount || 0),
        createdAt: post.createdAt || new Date().toISOString()
      };
      
      setDoc(postDocRef, cleanPost).catch((err) => {
        handleFirestoreError(err, OperationType.WRITE, `community_feed/${postId}`);
      });
    }
  }

  static savePostLike(postId: string, likedBy: string[], likesCount: number) {
    if (isFirebaseActive && db) {
      const postDocRef = doc(db, "community_feed", postId);
      updateDoc(postDocRef, {
        likedBy: likedBy,
        likesCount: Number(likesCount)
      }).catch((err) => {
        handleFirestoreError(err, OperationType.WRITE, `community_feed/${postId}`);
      });
    }
  }

  static startCommunityFeedListener(onUpdate: (feed: any[]) => void) {
    if (!isFirebaseActive || !db) return null;
    const feedCollection = collection(db, "community_feed");
    const feedQuery = query(feedCollection, limit(50));
    return onSnapshot(feedQuery, (snapshot) => {
      const fbPosts: any[] = [];
      snapshot.forEach((doc) => {
        const d = doc.data();
        fbPosts.push({
          id: d.postId || doc.id,
          authorId: d.authorId,
          authorName: d.authorName,
          authorAvatar: d.authorAvatar,
          imageUrl: d.imageUrl,
          caption: d.caption,
          likesCount: Number(d.likesCount || 0),
          likedBy: d.likedBy || [],
          commentsCount: Number(d.commentsCount || 0),
          comments: d.comments || [],
          createdAt: d.createdAt
        });
      });
      // Sort by creation time desc
      fbPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      this.setStore("community_feed", fbPosts);
      onUpdate(fbPosts);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "community_feed");
    });
  }

  static getSavedCourses(): string[] {
    return this.getProfile().savedCourses || [];
  }

  static saveCourse(courseId: string, action: "save" | "unsave") {
    const profile = this.getProfile();
    let saved = profile.savedCourses || [];
    if (action === "save" && !saved.includes(courseId)) {
      saved.push(courseId);
    } else if (action === "unsave") {
      saved = saved.filter((id: string) => id !== courseId);
    }
    profile.savedCourses = saved;
    this.saveProfile(profile);
  }
}

export { isFirebaseActive, db, auth };
