import ApiService from 'src/core/service/api.service';

// TODO: Bitte die ganze Klasse Unit testen!
export default class ImportExportService extends ApiService {
    constructor(httpClient, loginService, apiEndpoint = 'import-export') {
        super(httpClient, loginService, apiEndpoint);
        this.name = 'importExportService';
        this.httpClientMock = new HttpClientMock();
        this.httpClient = httpClient;
    }

    /**
     * Export data from the Shop with the given profile. The callback function gets called with progress information
     * and final result data.
     *
     * @param profileId {Entity} Profile entity
     * @param cb {Function} Callback for progress
     * @returns {Promise<void>}
     */
    async export(profileId, cb) {
        const headers = this.getBasicHeaders();

        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 30);

        const createdLog = await this.httpClient.post('/_action/import-export/initiate', {
            profileId: profileId,
            expireDate: expireDate.toDateString()
        }, {
            headers
        });

        let data = { data: { offset: 0 } };

        do {
            var oldOffset = data.data.offset;

            data = await this.httpClient.post('/_action/import-export/process', {
                logId: createdLog.data.log.id,
                offset: oldOffset
            }, {
                headers
            });
        } while (oldOffset !== data.data.offset);

        // this.handleExportProgress(progress, cb);
    }

    /**
     * Download the export file
     *
     * @param fileId {Entity} File entity
     * @param accessToken
     * @returns {Promise<void>}
     */
    getDownloadUrl(fileId, accessToken) {
        return `/api/v1/_action/${this.getApiBasePath()}/file/download?fileId=${fileId}&accessToken=${accessToken}`;
    }

    /**
     * Imports data from the csv file with the given profile. The callback function gets called with progress information
     * and final result data.
     * TODO: The implementation could be differ strong from the final implementation, because I don´t know how the file
     *  uploading is handled.
     *
     * @param profile {Entity} Profile entity
     * @param file {File} The csv file
     * @param cb {Function} Callback for progress
     * @returns {Promise<void>}
     */
    async import(profile, file, cb) {
        const profileMock = { ...profile, profileId: profile.id };

        // TODO: the implementation could be different when not using the mock
        const progress = await this.httpClientMock.post('/_action/import', {
            profile: profileMock,
            // TODO: when we build the final implementation we should check for progress in file uploads
            file: file
        });

        this.handleImportProgress(progress, cb);
    }

    /**
     * Recursive function, which requests the new url for fetching progress. The callback get called with every progress
     * information.
     *
     * @param progress {Object}
     * @param cb {Function}
     * @returns {Promise<void>}
     */
    async handleImportProgress(progress, cb) {
        // the callback gets the progress information
        // TODO: an adapter could be needed
        cb(progress);

        if (progress.status === 'finished') {
            // stop recursion when exporting is finished
            return;
        }

        // fetch new progress information from the given url
        // TODO: the implementation could be different when not using the mock
        const newProgress = await this.httpClientMock.post(
            `/_action/import/${progress.progressUrl}`
        );

        // handle the progress
        this.handleImportProgress(newProgress, cb);
    }
}

/* eslint-disable */















var maxCounter = 300;
var counter = 0;

function HttpClientMock() {
    this.post = function post(url, data) {
        return new Promise((resolve) => {
            window.setTimeout(() => {
                if (url.includes('import')) {
                    resolve({
                        // TODO: this is the mock data from the server.
                        //  It could be different when backend is finished.
                        //  Then you need an adapter to convert the data.
                        index: counter,
                        maxIndex: maxCounter,
                        progressUrl: '/_action/import/?progress_id=12345678',
                        status: counter < maxCounter ? 'pending' : 'finished',
                        statusText: counter < maxCounter ? 'Importing ...' : 'Finished',
                        stats: counter < maxCounter ? null : {
                            success: 298,
                            failure: 2,
                            filename: 'Default product_20200204-082535.csv',
                            logfileUrl: 'https://placekitten.com/300/900',
                            fileUrl: 'https://placekitten.com/900/600'
                        }
                    });
                }

                if (url.includes('export')) {
                    resolve({
                        // TODO: this is the mock data from the server.
                        //  It could be different when backend is finished.
                        //  Then you need an adapter to convert the data.
                        index: counter,
                        maxIndex: maxCounter,
                        progressUrl: '/_action/export/?progress_id=12345678',
                        status: counter < maxCounter ? 'pending' : 'finished',
                        statusText: counter < maxCounter ? 'Exporting ...' : 'Finished',
                        stats: counter < maxCounter ? null : {
                            success: 298,
                            failure: 2,
                            filename: 'Default product_20200204-082535.csv',
                            logfileUrl: 'https://placekitten.com/300/900',
                            fileUrl: 'https://placekitten.com/900/600'
                        }
                    });
                }

                counter += 10;

                if (counter > maxCounter) {
                    counter = 0;
                }
            }, Math.random() * 200);
        });
    };
}
/* eslint-enable */
