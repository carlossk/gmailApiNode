import fs from 'fs-extra';
import { Credentials } from "google-auth-library";
import { from } from "rxjs";


export const TOKENS_PATH_FOLDER = 'src/tokens/access_user_token.json';
export class FileSystemExtra {
    static saveToken(token: Credentials) {
        return this.saveData$(TOKENS_PATH_FOLDER, { credentials_user: { ...token } });
    }
    static saveDataDefault(path: string, data: any): void {
        this.saveData$(path, data)
    }

    static saveData$(path: string, data: any) {
        console.log(path, data);
        return from(fs.writeJson(path, data));
    }


}   