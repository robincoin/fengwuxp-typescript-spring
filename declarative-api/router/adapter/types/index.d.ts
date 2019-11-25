import { LocationDescriptorObject } from 'history';
import { MethodNameCommandResolver } from 'fengwuxp-declarative-command';

/**
 * 路由指令
 */
declare enum RouterCommand {
    PUSH = "push",
    TO = "to",
    POP = "pop",
    POP_TO_TOP = "popToTop",
    RESET = "reLaunch",
    REPLACE = "replace"
}

declare type NavigatorJumpRouteFunction = <T extends NavigatorDescriptorObject = NavigatorDescriptorObject>(object: T | string, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => Promise<any> | void;
interface NavigatorDescriptorObject extends LocationDescriptorObject {
    /**
     * uriVariables
     */
    uriVariables?: RouteUriVariable;
}
/**
 * 导航器适配器
 */
interface NavigatorAdapter<T extends NavigatorDescriptorObject = NavigatorDescriptorObject> {
    /**
     * 跳转到下个页面
     * @param navigatorDescriptorObject
     */
    push: NavigatorJumpRouteFunction;
    /**
     * 跳转到下个页面 {@link NavigatorAdapter#push}
     * @param navigatorDescriptorObject
     */
    toView: NavigatorJumpRouteFunction;
    /**
     * 返回
     * @param num
     */
    goBack: (num?: number, ...args: any[]) => void | Promise<any | void>;
    /**
     * 路由替换
     * @param navigatorDescriptorObject
     */
    replace?: NavigatorJumpRouteFunction;
    /**
     * 跳转到某个页面，并清空历史跳转记录
     * @param navigatorDescriptorObject
     */
    reLaunch?: NavigatorJumpRouteFunction;
    /**
     * /导航到堆栈的顶部路径，解除所有其他路径
     * @param navigatorDescriptorObject
     */
    popToTop?: NavigatorJumpRouteFunction;
}

/**
 * uri path variable
 */
declare type UriPathVariable = Array<boolean | string | number | Date>;
/**
 * query params type
 */
declare type QueryParamType = Record<string, boolean | number | string | Date | UriPathVariable>;
declare type RouteUriVariable = boolean | number | string | UriPathVariable | QueryParamType;
/**
 * @param uriVariables
 * @param state
 * @param command
 */
declare type RouterCommandMethod<T = RouteUriVariable, S = RouteUriVariable> = (uriVariables?: T, state?: S | RouterCommand, command?: RouterCommand) => Promise<void> | void;
/**
 * app command router
 */
interface AppCommandRouter extends NavigatorAdapter {
}

/**
 * Confirm before route jump
 * @param object
 * @return  NavigatorJumpRouteFunction or boolean ,if return  true: jump next route, if return route function NavigatorJumpRouteFunction
 */
declare type RouteConfirmBeforeJumping = <T extends NavigatorDescriptorObject = NavigatorDescriptorObject>(object: T) => true | NavigatorJumpRouteFunction;
interface RouterCommandConfiguration {
    methodNameCommandResolver: () => MethodNameCommandResolver;
    navigatorAdapter: () => NavigatorAdapter;
    confirmBeforeJumping?: () => RouteConfirmBeforeJumping;
}

/**
 * app command router factory
 *
 * @param configuration
 * @param pathPrefix   automatically supplemented prefix
 * @param autoJoinQueryString
 */
declare const appCommandRouterFactory: <T extends AppCommandRouter, N extends NavigatorAdapter<NavigatorDescriptorObject> = NavigatorAdapter<NavigatorDescriptorObject>>(configuration: RouterCommandConfiguration, pathPrefix?: string, autoJoinQueryString?: boolean) => T & N;

export { AppCommandRouter, NavigatorAdapter, NavigatorDescriptorObject, RouteConfirmBeforeJumping, RouteUriVariable, RouterCommand, RouterCommandConfiguration, RouterCommandMethod, appCommandRouterFactory };