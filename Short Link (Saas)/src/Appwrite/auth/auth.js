import { Client, Account, OAuthProvider } from "appwrite";
import { conf } from "../../conf/conf";
import { ID } from "appwrite";
import { DatabaseService } from "../config/databaseService/database";

const database = new DatabaseService();

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client.setEndpoint(conf.appwriteUrl);
    this.client.setProject(conf.appwriteProjectId);

    this.account = new Account(this.client);
  }

  async createAccount({ username, email, password }) {
    try {
      // const res = await fetch("https://geo.kamero.ai/api/geo");
      // const IpData = await res.json();

      const userId = ID.unique();

      await this.account.create({
        userId: userId,
        name: username,
        email: email,
        password: password,
      });

      //Create Profile
      await database.createUser({
        userId: userId,
        full_name: username,
        email,
        // location: IpData.city,
        avatar_file_id: null,
        plan: "free",
        role: "user",
        total_links: 0,
        is_verified: false,
        bio: "I always use tinyurl.",
      });

      const login = await this.loginUser({ email, password });
      return login;
    } catch (error) {
      console.log(
        `ACCOUNT CREATE ERROR: ${error} ${error.code} ${error.message}`,
      );
      throw error;
    }
  }

  async updateUsername({ username, userId }) {
    try {
      const res = await this.account.updateName({
        name: username,
      });

      if (res)
        return await database.updateUser({
          userId,
          data: {
            full_name: username,
          },
        });
    } catch (error) {
      console.log(`UpdateUsername Error: ${error}`);
      throw error;
    }
  }

  async updateEmail({ password, email, userId }) {
    try {
      const res = await this.account.updateEmail({
        email,
        password,
      });

      if (res) {
        await database.updateUser({
          userId,
          data: {
            email,
            is_verified: false,
          },
        });
      }

      return true;
    } catch (error) {
      console.log(`UPDATE EMAIL ERROR: ${error}`);
      throw error;
    }
  }

  async loginUser({ email, password }) {
    try {
      const user = await this.account.createEmailPasswordSession({
        email,
        password,
      });
      return user;
    } catch (error) {
      console.log(`LOGIN ACCOUNT ERROR: ${error}`);
      throw error;
    }
  }

  async authWithGoogle() {
    try {
      const oAuth = this.account.createOAuth2Session({
        provider: OAuthProvider.Google,
        success: `${window.location.origin}/`,
        failure: `${window.location.origin}/login`,
      });
      return oAuth;
    } catch (error) {
      console.log(`AUTH WITH GOOGLE ERROR: ${error}`);
      throw error;
    }
  }

  async logOut() {
    try {
      await this.account.deleteSessions("current");
      return true;
    } catch (error) {
      console.log(`LOGOUT ERROR: ${error}`);
      throw error;
    }
  }

  async getUserData() {
    try {
      const user = await this.account.get();
      return user;
    } catch (error) {
      console.log(`GET USER DATA: ${error}`);
      return null;
    }
  }

  async resetPasswordRequest({ email }) {
    try {
      const res = await this.account.createRecovery({
        email,
        url: "http://localhost:5173/update-password",
      });
      return res;
    } catch (error) {
      console.log(`RESET PASSOWRD REQUEST ERROR: ${error}`);
      return null;
    }
  }

  async resetPassword({ userId, secret, password }) {
    try {
      const res = await this.account.updateRecovery({
        userId,
        password,
        secret,
      });
      return res;
    } catch (error) {
      console.log(`RESET PASSWORD ERROR: ${error}`);
      throw error;
    }
  }

  async updatePassword({ oldPassword, password }) {
    try {
      const res = await this.account.updatePassword({
        oldPassword,
        password,
      });

      if (res) return res;
    } catch (error) {
      console.log(`UPDATE PASSWORD ERROR: ${error}`);
      throw error;
    }
  }
}
