import { gmail_v1 } from 'googleapis';
import { from, switchMap } from 'rxjs';
import { configProject, firebaseServiceAccount } from '../environment';
import { GoogleApiCredentials } from './google_api_credentials';
const { client_id, client_secret, redirect_uris } = configProject;

//const { google } = require('googleapis');

export class GmailApi {
    private gmail: gmail_v1.Gmail;
    private googleApiCredentials

    constructor() {
        this.gmail = new gmail_v1.Gmail({

        });
        this.googleApiCredentials = GoogleApiCredentials.getInstance(client_id, client_secret, redirect_uris);
    }
    listLabel() {
        return this.googleApiCredentials.refreshAccessToken().pipe(
            switchMap(token => {
                return from(this.gmail.users.labels.list({
                    access_token: token,
                    userId: 'me'
                }))
            })
        )
    }
    listEmails() {
        return this.googleApiCredentials.refreshAccessToken().pipe(
            switchMap(token => {
                return from(this.gmail.users.messages.list({
                    access_token: token,
                    userId: 'me',
                    labelIds: ['INBOX'],
                }))
            })
        )
    }

    readEmail() {
        return this.googleApiCredentials.refreshAccessToken()
            .pipe(
                switchMap(token => {
                    return from(this.gmail.users.messages.get({
                        access_token: token,
                        userId: 'me',
                        id: '2095'
                    }))
                })
            )
    }

    watchEmails() {
        return this.googleApiCredentials.refreshAccessToken()
            .pipe(
                switchMap(token => {
                    return from(
                        this.gmail.users.watch({
                            userId: 'me',
                            access_token: token,
                            requestBody: {
                                labelIds: ['INBOX'],
                                topicName: `projects/${firebaseServiceAccount.project_id}/topics/email`,
                                
                            }
                        })
                    )
                })
            )
    }
}