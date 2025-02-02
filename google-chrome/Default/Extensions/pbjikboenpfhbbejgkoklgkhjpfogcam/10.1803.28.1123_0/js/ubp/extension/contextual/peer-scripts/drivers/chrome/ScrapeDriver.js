var ScrapeChromeDriver;
(function (ScrapeChromeDriver) {
    ScrapeChromeDriver.ExtensionNamespace = typeof browser != 'undefined' ? browser : chrome;
    ScrapeChromeDriver.initialized;
    ScrapeChromeDriver.library = new ScrapeLibrary.Scraper(document);
    function getTime() {
        return (window.performance) ? window.performance.now() : Date.now();
    }
    ScrapeChromeDriver.getTime = getTime;
    function createNewResponse(messageId) {
        return {
            msgId: messageId,
            error: undefined,
            payload: undefined,
            performanceTiming: {
                requestStart: undefined,
                requestEnd: undefined
            }
        };
    }
    function handleMessage(request, sender, sendResponse) {
        if (request && this.library.canHandle(request.type)) {
            var response = createNewResponse(request.msgId);
            try {
                response.performanceTiming.requestStart = this.getTime();
                response.payload = this.library.handle(request.payload);
                response.performanceTiming.requestEnd = this.getTime();
            }
            catch (e) {
                response.error = (e && typeof e.toString === "function") ? e.toString() : "Error object in ScrapeChromeDriver is undefined or has no toString method";
            }
            finally {
                sendResponse(response);
            }
        }
    }
    ScrapeChromeDriver.handleMessage = handleMessage;
    function bootstrap() {
        if (!this.initialized) {
            this.initialized = true;
            ScrapeChromeDriver.ExtensionNamespace.runtime.onMessage.addListener(this.handleMessage.bind(this));
        }
    }
    ScrapeChromeDriver.bootstrap = bootstrap;
    ScrapeChromeDriver.bootstrap.call(ScrapeChromeDriver);
})(ScrapeChromeDriver || (ScrapeChromeDriver = {}));
