import {HttpClient} from "./HttpClient";
import {HttpRequest} from "./HttpRequest";
import {HttpRetryOptions} from "./HttpRetryOptions";
import {HttpResponse} from "./HttpResponse";
import DefaultHttpClient from "./DefaultHttpClient";


/**
 * support retry http client
 * HttpClient with retry, need to be recreated each time you use this client
 */
export default class RetryHttpClient<T extends HttpRequest = HttpRequest> extends DefaultHttpClient<T> implements HttpClient<T> {

    private httpClient: HttpClient<T>;

    // retry options
    private retryOptions: HttpRetryOptions;

    // number of retries
    private countRetry: number = 0;

    private retryEnd = false;

    constructor(httpClient: HttpClient<T>, retryOptions: HttpRetryOptions) {
        super(httpClient);
        this.httpClient = httpClient;
        this.retryOptions = retryOptions;
        if (this.retryOptions.onRetry == null) {
            this.retryOptions.onRetry = this.onRetry;
        }
        if (this.retryOptions.when == null) {
            this.retryOptions.when = this.whenRetry;
        }
    }


    send = (req: T): Promise<HttpResponse> => {
        const retryOptions = this.retryOptions;

        console.debug("retry client request", req, retryOptions);

        const _maxTimeout = retryOptions.maxTimeout;

        return new Promise<HttpResponse>((resolve, reject) => {

            const retries = retryOptions.retries;
            const httpClient = this.httpClient;

            const p: Promise<HttpResponse> = httpClient.send(req).catch((response) => {
                //try retry
                console.log("request failure , ready to retry", response);
                return this.tryRetry(req, response);
            });

            // max timeout control
            const timerId = setTimeout(() => {
                this.retryEnd = true;
                reject(new Error(`retry timeout，retry number${this.countRetry}`));
            }, _maxTimeout + retries * 10);

            p.then(resolve)
                .catch(reject)
                .finally((data) => {
                    console.log("clear timeout", timerId);
                    clearTimeout(timerId);
                    return data;
                });
        });
    };


    /**
     * try retry request
     * @param request
     * @param response
     */
    private tryRetry = (request: T, response): Promise<HttpResponse> => {

        const {onRetry, delay, retries, when} = this.retryOptions;

        const _delay = Math.ceil(Math.random() * delay) + Math.random() * 31;

        return new Promise<HttpResponse>((resolve, reject) => {
            const errorHandle = (resp) => {
                if (this.countRetry === retries) {
                    console.log("request to reach the maximum number of retries", retries);
                    reject(`retry end，count ${retries}`);
                    return
                }
                console.log(`ready to start the ${this.countRetry + 1} retry after ${_delay} milliseconds`, resp);

                setTimeout(() => {
                    if (this.retryEnd) {
                        return;
                    }
                    this.countRetry++;
                    onRetry(request, resp).then(resolve).catch((error) => {
                        if (when(error)) {
                            errorHandle(error);
                        } else {
                            console.log("give up retry ");
                            reject(error);
                        }
                    });
                }, _delay);
            };

            errorHandle(response);
        });
    };


    /**
     * default retry handle
     * @param req
     * @param response
     */
    private onRetry = (req: T, response: HttpResponse): Promise<HttpResponse> => {
        return this.send(req);
    };


    /**
     * whether to retry
     * @param response
     */
    private whenRetry = (response: HttpResponse): boolean => {
        console.log("when retry", response);
        const httpCode = response.statusCode;
        if (httpCode == null) {
            return true;
        }
        // http response code gte 500
        return httpCode >= 500;
    };

}
