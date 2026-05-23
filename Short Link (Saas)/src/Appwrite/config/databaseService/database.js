import { TablesDB, ID, Client, Role, Permission } from "appwrite";
import { conf } from "../../../conf/conf";

export class DatabaseService {
  client = new Client();
  databases;

  constructor() {
    this.client.setEndpoint(conf.appwriteUrl);
    this.client.setProject(conf.appwriteProjectId);
    this.databases = new TablesDB(this.client);
  }

  async createUser({
    full_name,
    email,
    avatar_file_id,
    plan,
    role,
    total_links,
    is_verified,
    userId,
    bio,
    location
  }) {
    try {
      const user = await this.databases.createRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteUsersCollectionId,
        rowId: userId,
        data: {
          full_name,
          email,
          avatar_file_id,
          plan,
          role,
          total_links,
          is_verified,
          bio,
          location
        },
        permissions: [
          Permission.read(Role.any()),
          Permission.update(Role.any()),
          Permission.delete(Role.any()),
        ],
      });

      return user;
    } catch (error) {
      console.log(`CREATE USER ERROR: ${error}`);
      throw error;
    }
  }

  async setVerificationCode({userId,code,expires,}){
    try {
       const res = await this.databases.updateRow({
         databaseId: conf.appwriteDatabaseId,
         tableId: conf.appwriteUsersCollectionId,
         rowId: userId,
         data: {
          verification_code: code,
          verification_expires: expires,
         }
       })
       return res
    } catch (error) {
      console.log(`VERIFICATION CODE ERROR: ${error}`);
      throw error
    }
  }

  async updateUser({ userId, data }) {
    try {
      const res = await this.databases.updateRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteUsersCollectionId,
        rowId: userId,
        data,
      });
      return res;
    } catch (error) {
      console.log(`UPDATE USER ERORR: ${error}`);
      throw error;
    }
  }

  async getUser({ userId }) {
    try {
      const user = await this.databases.getRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteUsersCollectionId,
        rowId: userId,
      });

      return user;
    } catch (error) {
      console.log(`GET USER: ${error}`);
      throw error;
    }
  }
}
