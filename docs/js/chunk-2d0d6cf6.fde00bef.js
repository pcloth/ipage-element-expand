(window["webpackJsonpIpageElementExpand"]=window["webpackJsonpIpageElementExpand"]||[]).push([["chunk-2d0d6cf6"],{"73ae":function(t,e,r){"use strict";r.r(e);var n=function(){var t=this,e=t._self._c;return e("section",{staticClass:"content element-doc"},[t._m(0),t._m(1),t._m(2),t._m(3),t._m(4),e("demo-block",[e("div",[e("p",[t._v("搜索组件是一个对el-form表单的封装，所有的输入单元和按钮都是"),e("code",[t._v("RenderCell")]),t._v("组件")])]),e("template",{slot:"source"},[e("element-demo0")],1),e("template",{slot:"highlight"},[e("pre",{pre:!0},[e("code",{pre:!0,attrs:{class:"html"}},[t._v("<template>\n    <IForm \n        v-model=\"formData\" \n        :formItems=\"formItems\" \n        :formRules=\"formRules\"\n        :queryFunc=\"queryFunc\"\n        @searchSuccess=\"searchSuccess\"\n    />\n</template>\n<script>\n    export default {\n        data(){\n            return {\n                formData:{\n                    gender:1,\n                },\n                results:{},\n                formItems:[\n                    {\n                        id:'name',\n                        label:'姓名',\n                        props:{\n                            placeholder:\"请输入姓名\"\n                        },\n                    },\n                    {\n                        id:'gender',\n                        label:'性别',\n                        slot:'select',\n                        props:{\n                            placeholder:\"请选择性别\"\n                        },\n                        options:[\n                            {\n                                label:'男',\n                                value:1\n                            },\n                            {\n                                label:'女',\n                                value:2\n                            },\n                            {\n                                label:'中性',\n                                value:3,\n                                disabled:true\n                            }\n                        ]\n                    },\n                ],\n                formRules:{\n                    name:{ required: true, message: '请输入姓名', trigger: 'blur' },\n                    gender:{ required: true, message: '请选择性别', trigger: 'blur' },\n                }\n            }\n        },\n        methods:{\n            async queryFunc(params){\n                return new Promise((resolve, reject) => {\n                    const records = []\n                    for(let i=0;i<10;i++){\n                        records.push({\n                            name:'张三',\n                            gender:(i%2)+1,\n                        })\n                    }\n                    setTimeout(()=>{\n                        resolve({\n                            data:{\n                                records\n                            },\n                            total:records.length\n                        })\n                    },1500)\n                })\n            },\n            searchSuccess(resp){\n                console.log(resp,resp)\n                this.results = JSON.stringify(resp)\n            }\n        }\n    }\n<\/script>\n")])])])],2),t._m(5),t._m(6),t._m(7),t._m(8),t._m(9),t._m(10),t._m(11)],1)},a=[function(){var t=this,e=t._self._c;return e("nav",{staticClass:"table-of-contents"},[e("ol",[e("li",[e("a",{attrs:{href:"#biao-dan-zu-jian"}},[t._v(" 表单组件")]),e("ol",[e("li",[e("a",{attrs:{href:"#ji-ben-yong-fa"}},[t._v(" 基本用法")])])])]),e("li",[e("a",{attrs:{href:"#shu-xing"}},[t._v(" 属性")])]),e("li",[e("a",{attrs:{href:"#formitems-pei-zhi"}},[t._v(" formItems 配置")])]),e("li",[e("a",{attrs:{href:"#shi-jian"}},[t._v(" 事件")])])])])},function(){var t=this,e=t._self._c;return e("h2",{attrs:{id:"biao-dan-zu-jian"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#biao-dan-zu-jian"}},[t._v("¶")]),t._v(" 表单组件")])},function(){var t=this,e=t._self._c;return e("div",{staticClass:"tip"},[e("p",[t._v("表单组件和ISearch很类似，都是对el-form的封装")])])},function(){var t=this,e=t._self._c;return e("h3",{attrs:{id:"ji-ben-yong-fa"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#ji-ben-yong-fa"}},[t._v("¶")]),t._v(" 基本用法")])},function(){var t=this,e=t._self._c;return e("div",{staticClass:"tip"},[e("p",[t._v("1、ISearch组件只负责发起请求，对数据不做任何处理")])])},function(){var t=this,e=t._self._c;return e("h2",{attrs:{id:"shu-xing"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#shu-xing"}},[t._v("¶")]),t._v(" 属性")])},function(){var t=this,e=t._self._c;return e("table",[e("thead",[e("tr",[e("th",[t._v("属性")]),e("th",[t._v("类型")]),e("th",[t._v("说明")]),e("th",[t._v("默认值")])])]),e("tbody",[e("tr",[e("td",[t._v("value")]),e("td",[t._v("object")]),e("td",[t._v("表单v-model")]),e("td",[t._v("{}")])]),e("tr",[e("td",[t._v("formClass")]),e("td",[t._v("string")]),e("td",[t._v("表单根节点的class")]),e("td",[t._v("配置项"),e("code",[t._v("class.IFormRoot")])])]),e("tr",[e("td",[t._v("formProps")]),e("td",[t._v("object")]),e("td",[t._v("传递给el-form的props参数")]),e("td",[t._v("配置项"),e("code",[t._v("formProps")])])]),e("tr",[e("td",[t._v("formOn")]),e("td",[t._v("object")]),e("td",[t._v("传递给el-form的事件")]),e("td",[t._v("配置项"),e("code",[t._v("formOn")])])]),e("tr",[e("td",[t._v("formRules")]),e("td",[t._v("object")]),e("td",[t._v("表单校验规则，直接传递给el-form组件")]),e("td",[t._v("{}")])]),e("tr",[e("td",[t._v("expandButtons")]),e("td",[t._v("array")]),e("td",[t._v("扩展按钮的"),e("code",[t._v("RenderCell")]),t._v("组件配置")]),e("td",[t._v("[]")])]),e("tr",[e("td",[t._v("submitButton")]),e("td",[t._v("object,boolean")]),e("td",[t._v("false=不显示提交按钮，object=显示并控制提交按钮的"),e("code",[t._v("RenderCell")]),t._v("组件配置")]),e("td",[t._v("配置项"),e("code",[t._v("submitButton")])])]),e("tr",[e("td",[t._v("cancelButton")]),e("td",[t._v("object,boolean")]),e("td",[t._v("false=不显示取消按钮，object=显示并控制取消按钮的"),e("code",[t._v("RenderCell")]),t._v("组件配置")]),e("td",[t._v("配置项"),e("code",[t._v("cancelButton")])])]),e("tr",[e("td",[t._v("formItems")]),e("td",[t._v("array")]),e("td",[t._v("表单项目列表，每个子项都是一个"),e("code",[t._v("RenderCell")]),t._v("组件配置")]),e("td",[t._v("[]")])]),e("tr",[e("td",[t._v("qData")]),e("td",[t._v("object")]),e("td",[t._v("附加给每个渲染单元的qData参数，方便制作一些高阶操作")]),e("td",[t._v("{}")])]),e("tr",[e("td",[t._v("submitPreventRepeat")]),e("td",[t._v("boolean")]),e("td",[t._v("调用submitFunc时是否节流")]),e("td",[t._v("false")])]),e("tr",[e("td",[t._v("submitFunc")]),e("td",[t._v("function")]),e("td",[t._v("提交方法")]),e("td",[t._v("null")])]),e("tr",[e("td",[t._v("loading")]),e("td",[t._v("boolean")]),e("td",[t._v("外部控制的loading")]),e("td",[t._v("false")])]),e("tr",[e("td",[t._v("className")]),e("td",[t._v("string")]),e("td",[t._v("组件根节点的class类名，方便控制整体样式")]),e("td",[t._v("配置项"),e("code",[t._v("class.ISearchRoot")])])])])])},function(){var t=this,e=t._self._c;return e("h2",{attrs:{id:"formitems-pei-zhi"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#formitems-pei-zhi"}},[t._v("¶")]),t._v(" formItems 配置")])},function(){var t=this,e=t._self._c;return e("div",{staticClass:"tip"},[e("p",[t._v("除了以下独特的参数，其他参数都和"),e("code",[t._v("RenderCell")]),t._v("渲染单元配置一样")])])},function(){var t=this,e=t._self._c;return e("table",[e("thead",[e("tr",[e("th",[t._v("属性")]),e("th",[t._v("类型")]),e("th",[t._v("说明")]),e("th",[t._v("默认值")])])]),e("tbody",[e("tr",[e("td",[t._v("span")]),e("td",[t._v("number")]),e("td",[t._v("表单单元外部的el-col组件参数")]),e("td",[t._v("24")])])])])},function(){var t=this,e=t._self._c;return e("h2",{attrs:{id:"shi-jian"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#shi-jian"}},[t._v("¶")]),t._v(" 事件")])},function(){var t=this,e=t._self._c;return e("table",[e("thead",[e("tr",[e("th",[t._v("事件")]),e("th",[t._v("说明")]),e("th",[t._v("参数")])])]),e("tbody",[e("tr",[e("td",[t._v("changeForm")]),e("td",[t._v("表单内容发生变动")]),e("td",[t._v("formValue,item")])]),e("tr",[e("td",[t._v("beforeSubmit")]),e("td",[t._v("表单校验通过，提交前")]),e("td",[t._v("formValue")])]),e("tr",[e("td",[t._v("afterSubmit")]),e("td",[t._v("表单提交成功后")]),e("td",[t._v("response")])]),e("tr",[e("td",[t._v("validationFailed")]),e("td",[t._v("表单校验失败")]),e("td",[t._v("formValue")])]),e("tr",[e("td",[t._v("cancel")]),e("td",[t._v("点击取消按钮后")]),e("td",[t._v("formValue")])])])])}],s=r("5530"),o=r("c7eb"),d=r("1da1"),l=(r("14d9"),r("e9c4"),r("d3b7"),{name:"component-doc",components:{"element-demo0":function(){var t=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",[[r("IForm",{attrs:{formItems:t.formItems,formRules:t.formRules,queryFunc:t.queryFunc},on:{searchSuccess:t.searchSuccess},model:{value:t.formData,callback:function(e){t.formData=e},expression:"formData"}})]],2)},e=[],r={data:function(){return{formData:{gender:1},results:{},formItems:[{id:"name",label:"姓名",props:{placeholder:"请输入姓名"}},{id:"gender",label:"性别",slot:"select",props:{placeholder:"请选择性别"},options:[{label:"男",value:1},{label:"女",value:2},{label:"中性",value:3,disabled:!0}]}],formRules:{name:{required:!0,message:"请输入姓名",trigger:"blur"},gender:{required:!0,message:"请选择性别",trigger:"blur"}}}},methods:{queryFunc:function(t){return Object(d["a"])(Object(o["a"])().mark((function t(){return Object(o["a"])().wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.abrupt("return",new Promise((function(t,e){for(var r=[],n=0;n<10;n++)r.push({name:"张三",gender:n%2+1});setTimeout((function(){t({data:{records:r},total:r.length})}),1500)})));case 1:case"end":return t.stop()}}),t)})))()},searchSuccess:function(t){console.log(t,t),this.results=JSON.stringify(t)}}};return Object(s["a"])({render:t,staticRenderFns:e},r)}()}}),c=l,_=r("2877"),v=Object(_["a"])(c,n,a,!1,null,null,null);e["default"]=v.exports}}]);
//# sourceMappingURL=chunk-2d0d6cf6.fde00bef.js.map