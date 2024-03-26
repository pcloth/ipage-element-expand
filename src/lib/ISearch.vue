<template>
    <el-form
        ref="formRef"
        :model="form"
        v-if="!hideSearch"
        :class="className"
        v-bind="mergeFormProps"
    >
        <template v-for="(v, k) in searchItems">
            <RenderCell
                :ref="v.id"
                v-if="!v.isMore&&!allinMore"
                :item="v"
                :key="k"
                :allItems="searchItems"
                v-model="form[v.id]"
                :formData="form"
                defaultSlot="input"
                :defaultProp="inputProp"
                @change="handleChange"
            ></RenderCell>
        </template>
        <el-form-item v-if="canShowButton">
            <RenderCell
                v-if="canShowResetButton"
                :item="mergeResetButton"
            ></RenderCell>
            <RenderCell
                v-if="canShowSubmitButton"
                :item="mergeSubmitButton"
            ></RenderCell>
            <!-- <el-button
                v-if="showResetButton"
                @click="handleReset"
                :disabled="loading"
                v-bind="resetButtonProps"
                >清空</el-button
            > -->
            <!-- <el-button
                v-if="showSearchButton"
                v-loading="loading"
                :disabled="loading"
                @click="handleSearch()"
                v-bind="searchButtonProps"
                >搜索
            </el-button> -->
            <el-popover
            v-if="hasMore"
            placement="bottom"
            trigger="click"
            :width="360"
            :teleported="false"
            :offset="-126"
        >
                <el-badge
                slot="reference"
                :hidden="!moreParams"
                is-dot
                >
                    <div
                        class="high-search-button"
                    >
                        <span>更多搜索</span>
                        <div class="icon">
                            <i class="el-icon-s-operation"></i>
                        </div>
                    </div>
                </el-badge>

            

            <div class="high-search-popover">
            <div class="title">更多搜索</div>

            <div class="content">
                <template v-for="(v, k) in searchItems">
                    <RenderCell
                        :ref="v.id"
                        :item="v"
                        :key="k"
                        v-if="v.isMore||allinMore"
                        :allItems="searchItems"
                        v-model="form[v.id]"
                        :formData="form"
                        defaultSlot="input"
                        @change="handleChange"
                        :defaultProp="inputProp"
                    ></RenderCell>
                </template>
            </div>
        </div>
      </el-popover>
        </el-form-item>
        <!-- 扩展按钮 -->
        <RenderCell
            v-for="(v, k) in expandButtons"
            :item="v"
            :key="k"
            :allItems="expandButtons"
            :formData="form"
            defaultSlot="button"
            :defaultProp="buttonProp"
        ></RenderCell>
    </el-form>
</template>

<script lang="jsx">
import RenderCell from "./components/RenderCell";
import { meargeObject,deepAssign, preventRepeat,effectiveValue } from "./utils";
import {config as $c} from './config';

export default {
    name:'ISearch',
    components:{
        RenderCell,
    },
    props:{
        hideSearch:{
            type:Boolean,
            default:false
        },
        value:{
            type:Object,
            default(){
                return {}
            }
        },
        // 重置按钮按下要不要重新搜索
        resetReQuery:{
            type:Boolean,
            default:true
        },
        formProps:{
            type:Object,
            default(){
                return $c.get('searchFormProps')
            }
        },
        inputProp:{
            type:Object,
            default(){
                return $c.get('searchInput')
            }
        },
        buttonProp:{
            type:Object,
            default(){
                return $c.get('searchButton')
            }
        },
        /** 扩展按钮列表 */
        expandButtons: {
            type: Array,
            default() {
                return [];
            }
        },
        /** 是否显示搜索按钮 */
        showSearchButton: {
            type: Boolean,
            default: $c.get('showSearchButton')
        },

        /** 搜索按钮的配置 */
        searchButtonProps: {
            type: Object,
            default() {
                return $c.get('searchButtonProps');
            }
        },
        /** 是否显示重置按钮 */
        showResetButton: {
            type: Boolean,
            default: $c.get('showResetButton')
        },
        /** 重置按钮的配置 */
        resetButtonProps: {
            type: Object,
            default() {
                return $c.get('resetButtonProps');
            }
        },
        searchSubmitButton:{
            type:[Object,Boolean],
            default(){
                return $c.get('searchSubmitButton')
            }
        },
        searchResetButton:{
            type:[Object,Boolean],
            default(){
                return $c.get('searchResetButton')
            }
        },
        /** 搜索项目 */
        searchItems: {
            type: Array,
            default() {
                return [];
            }
        },
        /** 附加查询参数 */
        qData: {
            type: Object,
            default() {
                return {};
            }
        },
        /** 查询方法，需要是一个Promise对象 */
        queryFunc: {
            type: Function
        },
        autoQuery:{
            type:Boolean,
            default:false
        },
        /** 强制所有搜索项目进more 比如在有些手机尺寸上可以用这个控制 */
        allinMore:{
            type:Boolean,
            default:$c.get('allinMore')
        },
        className:{
            type:String,
            default:$c.get('class').ISearchRoot
        }
    },
    computed:{
        hasMore(){
            return this.allinMore||this.searchItems.some(v=>v.isMore)
        },
        canShowButton(){
            const oldVerStatus = (this.showSearchButton || this.showResetButton)
            const newVerStatus = (this.searchSubmitButton || this.searchResetButton)?true:false
            const expandButtonsStatus = this.expandButtons && this.expandButtons.length
            return (oldVerStatus||newVerStatus)||expandButtonsStatus
        },
        canShowSubmitButton(){
            return this.showSearchButton || (this.searchSubmitButton?true:false)
        },
        canShowResetButton(){
            return this.showResetButton || (this.searchResetButton?true:false)
        },
        mergeSubmitButton(){
            const rcellData = {
                show:this.canShowSubmitButton,
                slot:'button',
                tip:'搜索',
                props:{
                    loading:this.loading,
                    ...this.searchButtonProps
                },
                on:{
                    click:()=>this.handleSearch()
                }
            }
            return deepAssign(rcellData,this.searchSubmitButton?this.searchSubmitButton:{show:false})
        },
        mergeResetButton(){
            const rcellData = {
                show:this.canShowResetButton,
                slot:'button',
                tip:'重置',
                props:{
                    loading:this.loading,
                    ...this.resetButtonProps
                },
                on:{
                    click:()=>this.handleReset()
                }
            }
            return deepAssign(rcellData,this.searchResetButton?this.searchResetButton:{show:false})
        },
        mergeFormProps(){
            return {
                ...$c.get('searchFormProps'),
                ...this.formProps
            }
        }
    },
    watch:{
        form(val){
            this.$emit('input',val)
        },
        value:{
            handler(){
                this.form = this.value
                this.clearValidate()
            },
            deep:true
        },
    },
    data(){
        return {
            form:{...(this.value||{})},
            loading:false,
            initSearch:false,
            openHighSearch:false,
            moreParams:false,
        }
    },
    beforeMount(){
        this.initOptions();
    },
    created(){
        // 外部调用最好也调用这一个
        this.handleSearch = preventRepeat((params)=>this._handleSearchNow(params), 500);
    },
    mounted(){
        if(this.autoQuery){
          this.handleSearch()
        }
    },
    methods:{
        initOptions(){
            // 制作查询表单数据
            this.form = this.value
        },
        mergeQData(obj = {}) {
            const newObj = meargeObject(
                {},
                this.form || {},
                this.qData || {},
                obj || {}
            );
            // 清理空字符串和null
            Object.keys(newObj).forEach(key => {
                if (newObj[key] === "" || newObj[key] === null) {
                    delete newObj[key];
                }
            });
            return newObj
        },
        clearValidate(){
            this.$nextTick(() => {
                this.$refs.formRef?.clearValidate();
            });
        },
        checkMoreParams(){
            this.$nextTick(()=>{
                let moreParams = false;
                this.searchItems.forEach(it=>{
                    if(it.isMore && effectiveValue(this.form[it.id])){
                        moreParams = true
                    }
                })
                this.moreParams = moreParams
            })
            
        },
        handleChange(value, loadData) {
            this.checkMoreParams()
            this.$emit("changeParams", this.form, value, loadData);
        },
        async _handleSearchNow(qdata){
            try {
                await this.$refs.formRef.validate()
            } catch (info) {
                // 校验表单失败
                Object.keys(info).forEach(key=>{
                    info[key].forEach(row=>{
                        this.$message.error(row.message)
                        return
                    })
                })
                
            }
            
            return new Promise((resolve) => {
                const fromData = this.mergeQData(qdata);
                this.$emit("beforeSearch", fromData);
                // 如果有查询方法
                if (this.queryFunc) {
                    this.loading = true;
                    this.queryFunc(fromData)
                        .then(res => {
                            this.loading = false;
                            this.$emit("searchSuccess", res);
                            resolve(true);
                        })
                        .catch(error => {
                            this.$emit("searchFail", error);
                        })
                        .finally(data => {
                            this.$emit("searchFinally", data);
                            this.loading = false;
                        });
                } else {
                    resolve(true);
                }
            });
        },
        handleSearchExBtn(btn){
            this.$emit("clickExBtn", btn);
        },
        handleReset(){
            this.searchItems.forEach(item=>{
                this.$set(this.form,item.id,undefined)
            })
            this.checkMoreParams()
            if(this.resetReQuery){
                this.handleSearch()
            }
            this.$emit("changeParams", this.form);
            this.$emit("resetFields", this.form);
        },
    }
}

</script>

<style lang="scss" scoped>
.high-search-button {
  display: inline-flex;
  align-items: center;
  border-left: solid 1px #f0f0f0;
  cursor: pointer;
  padding-left: 16px;
  margin-left: 16px;
  color: #185aff;
  & > span {
    font-size: 14px;
    margin-right: 5px;
  }
}

.high-search-popover {
  & > .title {
    font-size: 14px;
    font-weight: bold;
    line-height: 1;
    text-align: center;
    padding: 20px 16px 16px;
  }

  & > .content {
    margin: 0 16px;

    .title-setting {
      display: inline-flex;
      width: 100%;
    }

    v-deep .el-form-item--small.el-form-item {
      margin-bottom: 16px;
    }

    v-deep .el-form-item__content {
      display: flex;

      .el-input,
      .el-select {
        flex: 1;
      }
    }
  }

  & > .handle {
    display: flex;
    padding: 0 16px 12px;

    & > .close {
      flex: 1;
    }

    .el-button {
      font-size: 12px;
    }

    .el-button.el-button--primary,
    .el-button.el-button--default {
      padding: 8px;
    }
  }

  //
}
</style>


