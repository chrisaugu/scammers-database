import { Client, Account, ID, AppwriteException, Databases, Storage, Models } from 'appwrite';

const ENDPOINT_URL = String(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT_URL);
const PROJECT_ID = String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT);
const DATABASE_ID = String(process.env.NEXT_PUBLIC_APPWRITE_DATABASE);
const SMS_COLLECTION_ID = String(process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_SMS);
const PHONE_NUMBER_COLLECTION_ID = String(process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_PHONE_NUMBER);

// Permission.read()

export type ScamSMS = Omit<Models.Document, '$id' | '$databaseId' | '$collectionId' | '$createdAt' | '$updatedAt'> & {
    id?: string
    phoneNumber: string
    smsIp?: string
    smsContent: string,
    dateReceived: string
}

export async function createSessionClient() {
    let client = new Client();
    client
        .setEndpoint(ENDPOINT_URL)
        .setProject(PROJECT_ID);

    return {
        // account
        get account() {
            return new Account(client);
        },
        // database
        get database() {
            return new Databases(client);
        },
        // storage
        get storage() {
            return new Storage(client);
        },
    };
}

export async function getLoggedInUser() {
    try {
        const { account } = await createSessionClient();
        return await account.get();
    } catch (error) {
        return null;
    }
}

export const getCurrentUser = async () => {
    try {
        const { account } = await createSessionClient();
        return account.get()
    } catch (error) {
        const appwriteError = error as AppwriteException;
        throw new Error(appwriteError.message)
    }
}

export const getScams = async () => {
    try {
        const { database } = await createSessionClient();
        const { documents } = await database.listDocuments(DATABASE_ID, SMS_COLLECTION_ID);
        return documents;
    } catch (error) {
        const appwriteError = error as AppwriteException;
        throw new Error(appwriteError.message)
    }
}

export const addScam = async (data: ScamSMS) => {
    try {
        const { database } = await createSessionClient();
        const doc = await database.createDocument(
            DATABASE_ID, 
            SMS_COLLECTION_ID,
            ID.unique(),
            data
        );
        return doc;
    } catch (error) {
        const appwriteError = error as AppwriteException;
        throw new Error(appwriteError.message)
    }
}

export const login = async (email: string, password: string) => {
    try {
        const { account } = await createSessionClient();
        return account.createEmailPasswordSession(email, password)
    } catch (error) {
        const appwriteError = error as AppwriteException;
        throw new Error(appwriteError.message)
    }
}

export const logout = async () => {
    try {
        const { account } = await createSessionClient();
        return account.deleteSession('current')
    } catch (error: unknown) {
        const appwriteError = error as AppwriteException;
        throw new Error(appwriteError.message)
    }
}

export const register = async (email: string, password: string) => {
    try {
        const { account } = await createSessionClient();
        return account.create('unique()', email, password)
    } catch (error) {
        const appwriteError = error as AppwriteException;
        throw new Error(appwriteError.message)
    }
}
