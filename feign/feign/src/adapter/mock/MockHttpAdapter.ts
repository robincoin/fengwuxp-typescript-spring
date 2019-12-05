import {HttpAdapter} from "../HttpAdapter";
import {HttpRequest} from "../../client/HttpRequest";
import {HttpResponse} from "../../client/HttpResponse";
import {ResolveHttpResponse} from "../../resolve/ResolveHttpResponse";
import CommonResolveHttpResponse from "../../resolve/CommonResolveHttpResponse";
import {contentTypeName, HttpMediaType, mediaTypeIsEq} from "../..";


export type MockDataType = (options: HttpRequest) => Promise<any> | any;

/**
 * mock http adapter
 */
export default class MockHttpAdapter implements HttpAdapter {

    private resolveHttpResponse: ResolveHttpResponse = new CommonResolveHttpResponse();

    protected mockDataSource: Record<string, MockDataType> = {};

    protected baseUrl: string = "";

    //是否启用参数匹配
    // protected enabledParamsPattern: boolean = false;

    constructor(baseUrl: string, mockDataSource?: Record<string, any>) {
        this.baseUrl = baseUrl;
        this.mockDataSource = mockDataSource || {};
    }

    send = (req: HttpRequest): Promise<HttpResponse> => {
        console.log("mock http adapter", req);
        const {url, headers} = req;
        if (mediaTypeIsEq(headers[contentTypeName] as HttpMediaType, HttpMediaType.MULTIPART_FORM_DATA)) {
            // remove content-type
            // @see {@link https://segmentfault.com/a/1190000010205162}
            delete headers[contentTypeName];
        }

        const key = url.split("?")[0].replace(this.baseUrl, "");
        const result: MockDataType = this.mockDataSource[key];
        // const isFailure = new Date().getDate() % 2 == 0
        const isFailure = result == null;
        if (isFailure) {
            const response: Response = {
                status: 404,
                statusText: "Not Found",
                ok: false,
                url,
                redirected: null,
                headers: null
            } as any;
            return Promise.reject(this.resolveHttpResponse.resolve(response));
        } else {
            return Promise.resolve(this.resolveHttpResponse.resolve({
                status: 200,
                statusText: null,
                data: req,
                ok: true,
                url,
                redirected: null,
                headers: null
            }));
        }

        // if (typeof result === "function") {
        //     return result(req);
        // }
        //
        // return Promise.resolve(result);
    };


    /**
     * set mock data
     * @param url
     * @param data
     */
    setMockData = (url: string, data: MockDataType) => {
        this.mockDataSource[url] = data;
    }


}
