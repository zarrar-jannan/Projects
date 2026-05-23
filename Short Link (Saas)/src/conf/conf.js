export const conf = {
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteUsersCollectionId: String(import.meta.env.VITE_APPWRITE_TABLE_USERS),
    appwriteAvatarBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID_AVATAR),
    emailjsServiceId: String(import.meta.env.VITE_EMAILJS_SERVICE_ID),
    emailjsTemplateId: String(import.meta.env.VITE_EMAILJS_TEMPLATE_ID),
    emailjsPublicKey: String(import.meta.env.VITE_EMAILJS_PUBLIC_KEY),
}