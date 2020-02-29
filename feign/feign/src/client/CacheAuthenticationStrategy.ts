import {AuthenticationStrategy, AuthenticationToken} from "./AuthenticationStrategy";
import {HttpRequest} from './HttpRequest';


/**
 * cache AuthenticationStrategy
 */
export default class CacheAuthenticationStrategy implements AuthenticationStrategy {

    private authenticationStrategy: AuthenticationStrategy;

    private cacheAuthenticationToken: AuthenticationToken;

    constructor(authenticationStrategy: AuthenticationStrategy<AuthenticationToken>) {
        this.authenticationStrategy = authenticationStrategy;
    }

    appendAuthorizationHeader = (authorization: AuthenticationToken, headers: Record<string, string>): Record<string, string> => {
        return this.authenticationStrategy.appendAuthorizationHeader(authorization, headers);
    };

    getAuthorization = async (req: Readonly<HttpRequest>) => {
        if (this.cacheAuthenticationToken == null) {
            this.cacheAuthenticationToken = await this.authenticationStrategy.getAuthorization(req);
        }
        return this.cacheAuthenticationToken;
    };

    getAuthorizationHeaderNames = () => this.authenticationStrategy.getAuthorizationHeaderNames();

    refreshAuthorization = async (authorization: AuthenticationToken, req: Readonly<HttpRequest>) => {
        this.cacheAuthenticationToken = await this.authenticationStrategy.refreshAuthorization(authorization, req);
        return this.cacheAuthenticationToken;
    }


}