import { Client, Storage, ID } from "appwrite";
import { conf } from "../../../conf/conf";

export class StorageService {
  client = new Client();
  storage;

  constructor() {
    this.client.setEndpoint(conf.appwriteUrl);
    this.client.setProject(conf.appwriteProjectId);
    this.storage = new Storage(this.client);
  }

  uploadAvatar(file) {
    try {
      const res = this.storage.createFile({
        bucketId: conf.appwriteAvatarBucketId,
        fileId: ID.unique(),
        file,
      });

      return res;
    } catch (error) {
      console.log(`UPLOAD AVATAR ERROR: ${error}`);
      throw error;
    }
  }

  getAvatarPreview(fileId) {
    try {
      const res = this.storage.getFileView({
        bucketId: conf.appwriteAvatarBucketId,
        fileId,
      });

      return res;
    } catch (error) {
      console.log(`GET AVATAR PREVIEW ERROR: ${error}`);
      throw error;
    }
  }

  deleteAvatarFile({fileId}) {
    try {
      const res = this.storage.deleteFile({
        bucketId: conf.appwriteAvatarBucketId,
        fileId,
      });

      return res;
    } catch (error) {
      console.log(`DELETE AVATAR FILE: ${error}`);
      throw error;
    }
  }
}
