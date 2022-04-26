import { Credentials, OAuth2Client } from "google-auth-library";
import { from, map, mapTo, Observable, switchMap } from "rxjs";
import { credentials_user } from '../tokens/access_user_token.json';
import { FileSystemExtra } from "../utils/file_system";

export interface ProjectConfig {
    client_id?: string;
    project_id?: string;
    auth_uri?: string;
    token_uri?: string;
    auth_provider_x509_cert_url?: string;
    client_secret?: string;
    redirect_uris: string[];
}

export class GoogleApiCredentials {
    private static instance: GoogleApiCredentials;
    private oauth2: OAuth2Client;
    constructor(private client_id: string, private client_secret: string, private redirect_uris: string[]) {
        
        this.oauth2 = new OAuth2Client({
            clientId: client_id,
            clientSecret: client_secret,
            redirectUri: redirect_uris[0],
        })
    }
    public static getInstance(client_id: string, client_secret: string, redirect_uris: string[]) {
        if (!GoogleApiCredentials.instance) {
            GoogleApiCredentials.instance = new GoogleApiCredentials(client_id, client_secret, redirect_uris)
        }
        return GoogleApiCredentials.instance;
    }

    generateAuthUrl(scope: string) {

        return this.oauth2
            .generateAuthUrl({
                access_type: 'offline',
                scope: [scope],
            });

    }
    getTokenWithCode(code: string): Observable<Credentials> {

        return from(this.oauth2.getToken(code))
            .pipe(
                map(({ tokens }) => {
                    return tokens
                }));
    }

    refreshAccessToken(): Observable<string> {
        this.setCredentials(credentials_user);
        return from(this.oauth2.getAccessToken())
            .pipe(
                switchMap(({ token }) => {
                    let cred = credentials_user;
                    cred.access_token = token!;
                    this.setCredentials(cred);
                    return FileSystemExtra.saveToken(cred).pipe(mapTo(token!));
                }));
    }

    setCredentials(credentials: Credentials) {
        this.oauth2.setCredentials(credentials);
    }


}