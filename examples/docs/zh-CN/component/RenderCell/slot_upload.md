# 上传组件

## 基本用法

业务中，我们经常会需要重新封装一个上传组件，用来处理多种格式和内容，图片可能还需要剪裁和水印等功能: 这是一个标准的上传图片并剪裁加水印的例子
一般来说，你只需要配置
`action`接口地址;
`responseSrcPath`返回url所在的path
`headers`里面配置接口授权token
上传成功后，v-model就会根据图片`url,url2`这样组成值

注意，测试这个doc的最终上传，请你在本地建立一个简易的上传接收的后端，否则你将在控制台和文件列表面板上看到错误信息，如果你想看完整的例子，后面我会模拟一个接口来返回上传信息；



:::demo 常规用法
```html
<template>
    <div class="pages">
        <div class="easy-upload-title">
            当前value：{{ images }}
        </div>
        <RenderCell v-model="images" :item="item"/>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                images:'https://picsum.photos/200/200?random=2.jpg',
                item:{
                    slot:"easy-upload",
                    isFormItem:false,
                    props:{
                        action: 'http://127.0.0.1:5000/upload',
                        responseSrcPath: 'data.linkPath',
                        useWatermark: true,
                        watermarkText: '水印文字',
                        headers: {
                            token:'123456'
                        },
                        // 业务附加数据，放到data参数下
                        data:{
                            orderId:'1222'
                        }
                    }
                }
            }
        }
    }
</script>
```
:::

<div style="margin-top: 120px;"/>


## 自定义上传方法

很多时候，我们请求会封装一些东西，那么上传接口我们就可以传入我们的封装好的api方法即可，请注意`responseSrcPath`这个配置，它支持.分割，用来描述接口返回值所在的位置

:::demo 自定义上传方法
```html
<template>
    <div class="pages">
        <RenderCell v-model="images" :item="item"/>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                images:'',
                item:{
                    id:'images',
                    slot:'easy-upload',
                    isFormItem: false,
                    props:{
                        uploadFunc: this.uploadFunc,
                        responseSrcPath: 'data.linkPath',
                    }
                }
            }
        },
        methods:{
            uploadFunc(fileItem){
                console.log('uploadFunc',fileItem)
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        // 模拟上传成功，fileItem.raw里的数据转换成浏览器可访问的url
                        const reader = new FileReader()
                        reader.readAsDataURL(fileItem.raw)
                        reader.onload = () => {
                            resolve({
                                // 这里返回的结构，需要和responseSrcPath配置一致
                                data: {
                                    linkPath: reader.result,
                                },
                            })
                        }
                        reader.onerror = () => {
                            reject(new Error('File upload failed'))
                        }
                    }, 1000)
                })
            }
        }
    }
</script>
```
:::
