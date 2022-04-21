import { Credentials, OAuth2Client } from "google-auth-library";
import { GetAccessTokenResponse } from "google-auth-library/build/src/auth/oauth2client";
import moment from "moment";
import { from, map, mapTo, Observable, switchMap } from "rxjs";
import { credentials_user } from '../tokens/access_user_token.json';
import { FileSystemExtra } from "../utils/file_system";


export interface UserAccessToken {
    access_token?: string;
    refresh_token?: string,
    scope?: string,
    token_type?: string,
    expiry_date?: number
}

export interface ProjectConfig {
    client_id?: string;
    project_id?: string;
    auth_uri?: string;
    token_uri?: string;
    auth_provider_x509_cert_url?: string;
    client_secret?: string;
    redirect_uris: string[];
}

export class GoogleCredentials {
    private oauth2: OAuth2Client;
    constructor(private client_id: string, private client_secret: string, private redirect_uris: string[]) {
        this.oauth2 = new OAuth2Client({
            clientId: client_id,
            clientSecret: client_secret,
            redirectUri: redirect_uris[0],
        })
    }

    isTokenExpired(accessToken: UserAccessToken) {
        const expirationDate = moment(accessToken.expiry_date)
        return !!moment().diff(expirationDate, 'millisecond').valueOf();
    }

    generateAuthUrl(accessToken: UserAccessToken, { client_id, client_secret, redirect_uris }: ProjectConfig) {

        return this.oauth2
            .generateAuthUrl({
                access_type: 'offline',
                scope: [<string>accessToken.scope],

            });

    }
    getToken(code: string): Observable<Credentials> {
        return from(this.oauth2.getToken(code)).pipe(map(({ tokens }) => tokens));
    }
    getAccessToken() {
        this.setCredentials(credentials_user);
        return from(this.oauth2.getAccessToken())
            .pipe(
                switchMap(({ token }) => {
                    let cred = credentials_user;
                    cred.access_token = token!;
                    return FileSystemExtra.saveToken(cred).pipe(mapTo(token));
                }));
    }

    setCredentials(credentials: Credentials) {
        this.oauth2.credentials = credentials;
    }
    

}