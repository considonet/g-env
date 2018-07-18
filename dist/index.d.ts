declare module "@considonet/g-env" {

    interface IBrowserInfo {
        "appleWebKitVersion": number,
        "chromeVersion": number,
        "isAndroidBrowser": boolean,
        "iOSVersion": string,
        "IEWindows7": boolean,
        "supportsTransitions": boolean,
        "supportsAnimations": boolean,
        "IEVersion": number,
        "scrollbarWidth": number
    }

    interface IMobileInfo {
        "Android": boolean,
        "Windows": boolean,
        "BlackBerry": boolean,
        "iOS": boolean
    }

    interface IEnv {
        "isTouchDevice": boolean,
        "browserInfo": IBrowserInfo,
        "isMobile": IMobileInfo
    }

    const _default: IEnv;

    export default _default;

}