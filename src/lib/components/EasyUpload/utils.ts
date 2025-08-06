import watermark from "watermarkjs";

/** 生成uuid */
export const getUuid = (len: number, radix: number) => {
    const chars =
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
            ""
        );
    const uuid = [];
    let i: number;
    radix = radix || chars.length;
    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
    } else {
        // rfc4122, version 4 form
        let r: number;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
        uuid[14] = "4";

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | (Math.random() * 16);
                uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join("");
};

export const testIsBase64 = (fileStr: string) => {
    return /^data:image/.test(fileStr);
};

export const getFileSuffix = (src: string) => {
    const isBase64 = testIsBase64(src)
    if (isBase64) {
        return 'BASE64'
    }
    // 根据文件后缀判断文件类型
    const suffix = src.split('.').pop() || ""
    return suffix.toUpperCase()
}

/** 默认支持的accept */
export const imageTypes = ['PNG', 'JPG', 'JPEG']
export const videoTypes = ['MP4', 'AVI']

export const createAccept = (types: string[]) => {
    return types.map(item => `.${item.toLowerCase()}`).join(',')
}

export const fileType = (src: string) => {
    const isBase64 = testIsBase64(src)
    if (isBase64) {
        return 'img'
    }
    // 根据文件后缀判断文件类型
    const suffix = getFileSuffix(src)

    if (imageTypes.includes(suffix)) {
        return 'img'
    }
    if (videoTypes.includes(suffix)) {
        return 'video'
    }
    return 'file'
}

export const getName = (item: any) => {
    if (typeof item === "string") {
        // 是一个url或者base64图片
        if (item.indexOf("base64") !== -1) {
            // 正则获取图片格式
            const reg = /data:image\/(\w+);base64,/;
            const result = item.match(reg);
            if (result) {
                return "base64图片" + getUuid(4, 17) + "." + result[1];
            } else {
                return "base64图片" + getUuid(4, 17) + ".png";
            }
        } else {
            // 是一个url
            const arr = item.split("/");
            return arr[arr.length - 1];
        }
    }
};

/** 生成hash */
export const getHash = (str: string) => {
    let hash = 0;
    if (str.length == 0) return hash;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
};

/** 
 * 把一个未知方法封装成promise，它可能是一个异步方法，也可能是一个同步方法
 */
export const promisify = (fn: Function, ...args: any[]) => {
    return new Promise((resolve, reject) => {
        try {
            const result = fn(...args);
            resolve(result);
        } catch (e) {
            reject(e);
        }
    });
};


const createMultipleWatermarks = function (target: any,waterText: string, watermark: any) {
    const context = target.getContext("2d");
    const text = waterText;
    // Set watermark style
    context.globalAlpha = 0.5;
    context.fillStyle = "#fff";
    context.font = "36px 微软雅黑";

    // Rotate the canvas for diagonal watermarks
    context.rotate((-38 * Math.PI) / 180);

    // Calculate text width and height
    const metrics = context.measureText(text);
    const textWidth = metrics.width;
    const textHeight = 48; // Approximate height based on font size
    // 间隔文字用文字长度*空格数
    let spaceString = "";
    for (let i = 0; i < text.length; i++) {
        spaceString += " ";
    }

    // Calculate the diagonal length of the canvas (to cover entire image)
    const diagonalLength = Math.sqrt(
        Math.pow(target.width, 2) + Math.pow(target.height, 2)
    );

    // Calculate spacing between watermark lines
    const lineSpacing = textHeight * 5; // Adjust this value to control spacing

    // Calculate how many lines needed to cover the canvas
    const numLines = Math.ceil(diagonalLength / lineSpacing) * 2;

    // Calculate starting position (left of the rotated canvas)
    const startX = -diagonalLength;
    const startY = -diagonalLength / 2;

    // Draw watermark lines
    for (let i = 0; i < numLines; i++) {
        const y = startY + i * lineSpacing;
        const repeatsNeeded = Math.ceil((diagonalLength * 2) / textWidth);
        let lineText = "";
        for (let j = 0; j < repeatsNeeded; j++) {
            lineText += text + spaceString;
        }
        context.fillText(lineText, startX, y);
    }

    return target;
};

/** 
 * 生成水印
 */
export const makeWatermark = (file: any, text = "", func: Function | null = null) => {
    if (!func) {
        func = createMultipleWatermarks
    }
    const outFunc = (target: any) => {
        const obj =  func(target, text, watermark);
        if(typeof obj === 'function'){
            return obj(target);
        }
        return obj;
    }
    return watermark([file]).blob(outFunc)
};


/**
 * 缩放图片
 * @param {String|Blob} src 图片地址
 * @param {Object} zoomLimit 缩放配置
 * @param {Number} zoomLimit.width 宽度限制
 * @param {Number} zoomLimit.height 高度限制
 * @returns {Promise} 返回一个promise
 */
export const zoomImage = (src: string|Blob, zoomLimit: { width?: number; height?: number }={}) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        if(typeof src === 'string'){
            img.src = src;
        }else{
            // 它是一个blob
            img.src = URL.createObjectURL(src);
        }
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d") as CanvasRenderingContext2D;
            const { width, height } = img;
            const { width: limitWidth, height: limitHeight } = zoomLimit;
            let scale = 1;
            if (limitWidth && limitHeight) {
                scale = Math.min(limitWidth / width, limitHeight / height);
            } else if (limitWidth) {
                scale = limitWidth / width;
            } else if (limitHeight) {
                scale = limitHeight / height;
            }
            canvas.width = width * scale;
            canvas.height = height * scale;
            context.drawImage(img, 0, 0, width, height, 0, 0, width * scale, height * scale);
            canvas.toBlob((blob) => {
                resolve(blob);
            });
        };
        img.onerror = (e) => {
            console.error(e,'图片加载失败');
            reject(e);
        };
    });
}

/**
 * 防抖函数
 * @param {Function} fn 需要防抖的函数
 * @param {Number} delay 防抖时间
 * @param {Boolean} immediate 是否立即执行
 * @returns {Function} 返回一个防抖函数
 */
export const debounce = (fn: Function, delay: number, immediate: boolean) => {
    let timer: any = null;
    return function (...args: any[]) {
        if (timer) {
            clearTimeout(timer);
        }
        if (immediate && !timer) {
            fn.apply(this, args);
        }
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
};

/** 
 * 
 */
export const suffixToType = (suffix: string) => {
    const typeMaps:any = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        webp: 'image/webp',
        bmp: 'image/bmp'
    }
    return typeMaps[suffix] || 'image/png';
}

/**
 * 图片文件文件名获取到canvas格式。
 */
export const getFileFormatToCanvasType = (fileName: string="") => {
    const fileExtension = fileName.split('.').pop().toLowerCase();
    const canvasType = suffixToType(fileExtension);
    return canvasType;
}

/**
 * getObjectValueByPath
 * @param {Object} obj 对象
 * @param {String} path 路径，支持.分割
 * @param {String} defaultValue 默认值
 */
export const getObjectValueByPath = (obj: any, path: string, defaultValue: any) => {
    const paths = path.split('.');
    let result = obj;
    for (let i = 0; i < paths.length; i++) {
        const key = paths[i];
        if (result[key] === undefined) {
            return defaultValue;
        }
        result = result[key];
    }
    return result;
}


