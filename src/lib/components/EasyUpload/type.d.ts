/**
 * 
 * status:  
 * load = 加载文件
 * waitUpload = 等待上传(同时选中多个的时候，只有一个文件在上传)
 * croping = 裁剪中
 * croped = 裁剪完成
 * uploading = 上传中
 * success = 上传成功
 * error = 各种失败
 */
type FileType = {
    uuid: string; // 文件唯一标识
    name: string; // 文件名
    status: 'load' | 'waitUpload' | 'croping' | 'croped' | 'uploading' | 'success' | 'error';
    error?: string; // 错误信息
    appect?: string; // 文件后缀
    originSize?: number; // 文件原始大小
    size?: number; // 文件大小
    [key: string]: any;    
}