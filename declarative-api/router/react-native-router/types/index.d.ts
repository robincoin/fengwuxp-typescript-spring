import { AppCommandRouter, NavigatorDescriptorObject, NavigatorAdapter, RouteConfirmBeforeJumping, NavigatorContextAdapter, RouteUriVariable } from 'fengwuxp-declarative-router-adapter';

/**
 *
 * @param confirmBeforeJumping
 * @param navigatorAdapter
 * @param navigatorContextAdapter
 */
declare const reactNativeAppCommandRouterFactory: <T extends AppCommandRouter<NavigatorDescriptorObject>, N extends NavigatorAdapter<NavigatorDescriptorObject> = NavigatorAdapter<NavigatorDescriptorObject>>(confirmBeforeJumping?: RouteConfirmBeforeJumping, navigatorAdapter?: NavigatorAdapter<NavigatorDescriptorObject>, navigatorContextAdapter?: NavigatorContextAdapter<NavigatorDescriptorObject>) => T;

/**
 * react-native navigator adapter
 */
declare class ReactNativeNavigatorAdapter implements NavigatorAdapter<NavigatorDescriptorObject> {
    goBack: (num?: number, ...args: any[]) => void;
    popToTop: (descriptorObject: string | NavigatorDescriptorObject, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => void;
    toView: (descriptorObject: string | NavigatorDescriptorObject, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => void;
    push: (descriptorObject: string | NavigatorDescriptorObject, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => void;
    reLaunch: (descriptorObject: string | NavigatorDescriptorObject, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => void;
    replace: (descriptorObject: string | NavigatorDescriptorObject, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => void;
    private jump;
    private genRouteProps;
}

export { ReactNativeNavigatorAdapter, reactNativeAppCommandRouterFactory };
