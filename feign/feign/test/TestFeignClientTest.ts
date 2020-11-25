import * as log4js from "log4js";
import TestFeignClient from "./TestFeignClient";
import FeignConfigurationRegistry from "../src/configuration/FeignConfigurationRegistry";
import ExampleFeignClient from "./ExampleFeignClient";
import MockFeignConfigurationTest from "./MockFeignConfigurationTest";


const logger = log4js.getLogger();
logger.level = 'debug';


describe("test feign client", () => {

    const mockFeignConfiguration = new MockFeignConfigurationTest();
    FeignConfigurationRegistry.setDefaultFeignConfiguration(mockFeignConfiguration);

    const testFeignClient = new TestFeignClient();
    const exampleFeignClient = new ExampleFeignClient();

    const sleep = (times) => {
        return new Promise((resolve) => {
            setTimeout(resolve, times)
        })
    };


    test("test feign client", async () => {

        try {

            const result = await exampleFeignClient.findMember({
                name: "张三",
                userName: "1",
                memberId: 12,
                time: new Date()
            });
            // const result = await ClientRequestDataValidatorHolder.validate({
            //     name: "张三",
            //     userName: "1",
            //     memberId: 1
            // }, {
            //     name: {
            //         required: true
            //     },
            //     memberId: {
            //         message: "用户不能为空",
            //         min: 1,
            //         required: true
            //     }
            // }, false).catch(e => {
            //     return Promise.reject(e);
            // }).then(testFeignClient.findMember);
            console.log("http result", result);
        } catch (e) {
            logger.error(e)
        }
    }, 30 * 1000);

    test("test get example", async () => {

        try {
            const result = await testFeignClient.getExample({
                id: 1,
                date: new Date(),
                test: "1"
            });
            console.log("http result", result);
        } catch (e) {
            logger.error(e)
        }
    }, 40 * 1000);

    test("test retry", async () => {

        try {
            const result = await testFeignClient.testQuery({
                id: 1,
                date: new Date(),
                test: "1"
            });
            console.log("http result", result);
        } catch (e) {
            logger.error(e)
        }
    }, 25 * 1000);


    const sendRequestEvent = async (num) => {
        const queue = [];
        for (let i = 0; i <= num; i++) {
            // if (Math.random() * i * 99188320 % 2 === 0) {
            //
            // }
            const times = Math.random() * 1000;
            await sleep(times);
            (function (index) {
                logger.debug(`开始发出第${index}个请求`);
                testFeignClient.deleteMember({
                    memberId: 1
                }, {
                    // useProgressBar: times % 2 == 0
                }).then((data) => {
                    logger.debug("----s---->", data)
                }).catch((e) => {
                    logger.debug("----e---->", e)
                }).finally(() => {
                    logger.debug(`收到了第${index}个请求的响应`);
                    queue.push(index);
                })
            })(i);
        }
        return queue;
    };

    test("test network status change", async () => {

        try {
            const queue = await sendRequestEvent(100);
            console.log("-------->", queue.length);
        } catch (e) {
            logger.error("error", e)
        }

    }, 160 * 1000);


    test("promise race", async () => {

        const k = await Promise.race([
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log("1");
                    resolve(1)
                }, 1000)
            }),
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log("2");
                    resolve(2)
                }, 2000)
            })
        ])

        await sleep(3000);

        logger.log("k", k)

    }, 10 * 1000)

    test("test auto upload file ", async () => {

        await testFeignClient.evaluateOrder({
            goods: [
                "A",
                "B",
                "C",
                "D"
            ]
        })

    }, 20 * 1000);


    test("test deleted", async () => {

        await testFeignClient.deleteById({ids: [1, 2, 3, 4], a: "22", c: "33"});
    });

    test("test put", async () => {

        // await testFeignClient.batchDistribution({name: "张三", age: 18});
    });
});

