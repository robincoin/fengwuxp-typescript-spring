import * as log4js from "log4js";
import {appCommandRouterFactory} from '../src/AppCommandRouterFactory';
import {NavigatorAdapter, NavigatorDescriptorObject} from "../src/NavigatorAdapter";
import {AppCommandRouter, RouterCommandMethod} from "../src/AppCommandRouter";
import {RouterCommand} from "../src/RouterCommand";
import {tryConverterPathnameVariableResolver} from "../src/PathnameMethodNameCommandResolver";
import {toLineResolver} from "fengwuxp-declarative-command";


const logger = log4js.getLogger();
logger.level = 'debug';

interface MockAppRouter extends NavigatorAdapter, AppCommandRouter {

    login: RouterCommandMethod;

    isLoginView: () => boolean;

    index: RouterCommandMethod;

    webview: RouterCommandMethod;

    my: RouterCommandMethod;

    goodsById: RouterCommandMethod<number>;

    popToTopGoodsDetail: RouterCommandMethod<{ id: number }>;

    pushOrderDetail: RouterCommandMethod<{ id: string }>;

    toOrderDetail: RouterCommandMethod<{ id: string }>;

    isOrderDetailView: () => boolean;

    pushOrderDetailById: RouterCommandMethod<string>;

    toModuleByUserId: RouterCommandMethod<[string, number]>;

    reLaunchOrderDetailById: RouterCommandMethod<string>;

    replaceOrderDetailById: RouterCommandMethod<string>;
}

describe("test  app command router factory", () => {

    const mockAppRouter: MockAppRouter = appCommandRouterFactory<MockAppRouter>({
        // methodNameCommandResolver: () => {
        //     return (name) => name;
        // },
        methodNameCommandResolver: () => toLineResolver,
        navigatorAdapter: <E extends NavigatorAdapter = NavigatorAdapter>(): E => {
            return {
                goBack: function (num?: number) {
                    logger.debug(`goBack`, num || 1);
                    return;
                },
                popToTop: function (navigatorDescriptorObject: NavigatorDescriptorObject) {
                    logger.debug(`popToTop`, navigatorDescriptorObject);
                    return;
                },
                push: function (navigatorDescriptorObject: NavigatorDescriptorObject) {
                    logger.debug(`push`, navigatorDescriptorObject)
                    return;
                },
                // toView: function (navigatorDescriptorObject: NavigatorDescriptorObject) {
                //     logger.debug(`toView`, navigatorDescriptorObject)
                //     return;
                // },
                reLaunch: function (navigatorDescriptorObject: NavigatorDescriptorObject) {
                    logger.debug(`reLaunch`, navigatorDescriptorObject)
                    return;
                },
                replace: function (navigatorDescriptorObject: NavigatorDescriptorObject) {
                    logger.debug(`replace`, navigatorDescriptorObject)
                    return;
                }

            } as E;
        }

    });

    test("test mock app router", () => {

        mockAppRouter.login();
        logger.debug("--->", mockAppRouter.isLoginView());
        logger.debug("--->", mockAppRouter.getCurrentPathname());
        logger.debug("--->", mockAppRouter.isStackTop());
        mockAppRouter.webview({url: 1});
        mockAppRouter.index();

        mockAppRouter["home"]();

        mockAppRouter.index({
            a: 1
        }, RouterCommand.RESET);

        mockAppRouter.goodsById(100);


        mockAppRouter.popToTopGoodsDetail({id: 100});

        mockAppRouter.pushOrderDetail({id: "100"});

        mockAppRouter.pushOrderDetailById("100");

        mockAppRouter.toOrderDetail({id: "1"});
        logger.debug(" mockAppRouter.isOrderDetailView()", mockAppRouter.isOrderDetailView());

        mockAppRouter.reLaunchOrderDetailById("1");
        logger.debug("--->", mockAppRouter.getCurrentPathname());
        logger.debug("--->", mockAppRouter.isStackTop());
        mockAppRouter.replaceOrderDetailById("1");

        mockAppRouter.toModuleByUserId(["member", 1]);

        mockAppRouter.goBack();

        mockAppRouter.push({
            pathname: "goods_list",
            uriVariables: {id: 2},
            state: {}
        });
        mockAppRouter.push("goods_list", {id: 2});
        mockAppRouter.toView("goods_list", {id: 2});

        logger.debug("--->", mockAppRouter.getCurrentPathname());
        logger.debug("--->", mockAppRouter.isStackTop());
        logger.debug("--->", mockAppRouter.getCurrentUriVariables());
        logger.debug("--->", mockAppRouter.getCurrentState());
    });

    test("test try converter pathname variable resolver", () => {

        logger.debug("goodsDetailById==>", tryConverterPathnameVariableResolver("goodsDetailById"));
        logger.debug("userById==>", tryConverterPathnameVariableResolver("userById"));
        logger.debug("simpleBName==>", tryConverterPathnameVariableResolver("simpleBName"));
    });


});
