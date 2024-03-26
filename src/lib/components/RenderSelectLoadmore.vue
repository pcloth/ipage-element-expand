<!--
 * @Description: 
 * @Author: Ran junlin
 * @Date: 2023-08-17 09:32:25
 * @LastEditTime: 2024-02-20 16:21:05
 * @LastEditors: Ran junlin
-->
<template>
  <el-select
    v-model="customValue"
    style="width: 100%"
    v-bind="$props"
    filterable
    remote
    reserve-keyword
    :placeholder="defaultValue"
    :remote-method="handleRemoteSearch"
    v-el-select-loadmore="that"
    @change="handleChange"
    @clear="handleClear"
    @visible-change="handleVisibleChange"
  >
    <div :class="[customLoading ? 'selectLoad' : 'noData']">
      <el-option
        v-for="(item, index) in options"
        :key="item[keyField] ? item[keyField] : index"
        :label="getLabel(item)"
        :value="item[valueField]"
        :disabled="disabledFunc(item)"
      />
    </div>
  </el-select>
</template>
<script>
import { Select } from 'element-ui';
const { props: elSelectProps } = Select;
export default {
  name: 'RSelectLoadMore',
  props: {
    ...elSelectProps,
    value: {
      type: [String, Object, Number, Boolean, Array],
      default: ''
    },
    service: {
      type: Function,
      default: () => () => {}
    },
    labelField: {
      type: String,
      default: 'name'
    },
    valueField: {
      type: String,
      default: 'value'
    },
    keyField: {
      type: String,
      default: ''
    },
    /**
     * 接口查询的字段，默认 keyword
     */
    searchKey: {
      type: String,
      default: 'keyword'
    },
    /**
     * 额外要传入的参数
     */
    additionalParams: {
      type: Object,
      default: () => ({})
    },
    /**
     * 传入要禁用项的函数，返回true表示禁用，返回false表示不禁用
     */
    disabledFunc: {
      type: Function,
      default: () => false
    },
    /**
     * 显示的多个label，支持数组，根据 - 分割
     */
    labelFieldArr: {
      type: Array,
      default: () => []
    },
    /**
     * 默认值
     */
    defaultValue: {
      type: String,
      default: ''
    },
    /**
     * 是否回显（接口要支持根据id查询回显）
     */
    isCallBackShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      customValue: this.value,
      params: {
        pageNo: 1,
        pageSize: 10,
        keyword: ''
      },
      customLoading: false,
      // 用于滚动刷新
      that: this,
      // 防止触底连续访问接口
      isSuccess: true,
      // 判断是否还有数据
      isEnd: true,
      options: [],
      queryWord: '',
      total: 0,
      isUserSelected: false //处理是否选中,避免触发handleRemoteSearch方法调用
    };
  },
  directives: {
    'el-select-loadmore': {
      bind (el, binding) {
        const componentInstance = binding.value;
        const scrollDom = el.querySelector('.el-select-dropdown__wrap');
        if (scrollDom) {
          scrollDom.addEventListener('scroll', () => {
            if (scrollDom.scrollTop + scrollDom.clientHeight >= scrollDom.scrollHeight - 4) {
              componentInstance.handleScrollToEnd();
            }
          });
        }
      }
    }
  },
  watch: {
    value: {
      handler (value) {
        if (value && !this.multiple && !this.isUserSelected) {
          this.isUserSelected = false; // 重置标记
          this.getList(value);
        }
        this.customValue = value;
      },
      immediate: true
    },
    customValue (val) {
      this.$emit('input', val);
    }
  },
  computed: {
    noData () {
      return this.options.length === this.total;
    }
  },
  created () {
    this.init();
    let searchValue = '';
    if (this.isCallBackShow) {
      searchValue = this.customValue;
    }
    this.getList(searchValue);
  },
  methods: {
    getValueByPath (obj, path) {
      const keys = path.split('.');
      let result = obj;
      for (let key of keys) {
        result = result[key];
        if (!result) return null;
      }
      return result;
    },
    getLabel (item) {
      if (this.labelFieldArr.length === 0) {
        return item[this.labelField];
      } else {
        return this.labelFieldArr.map(field => this.getValueByPath(item, field)).join(' - ');
      }
    },
    init () {
      this.isUserSelected = false;
      this.total = 0;
      this.queryWord = '';
      this.params.pageNo = 1;
      this.options = [];
    },
    handleVisibleChange (val) {
      // 当搜索结果为空时候，要重置参数重新去调用搜索接口，防止它webview缓存导致搜索结果不更新
      this.init();
      if (val) {
        this.customLoading = true;
        this.getList();
      }
    },
    handleClear () {
      this.options = [];
      this.params.pageNo = 1;
      this.getList();
    },
    handleChange (args) {
      this.$emit('input', args);
      if (Array.isArray(args)) {
        const selected = this.options.filter(it => args.includes(it[this.valueField]));
        this.$emit('getCurrentItem', selected, args);
      } else {
        const currentItem = this.options.find(it => it[this.valueField] === args);
        this.$emit('getCurrentItem', currentItem, args);
      }
      this.isUserSelected = true; // 设置标记
      // 添加延迟来重置isUserSelected
      setTimeout(() => {
        this.isUserSelected = false;
      }, 300); // 延迟300毫秒，可以根据需要调整
    },
    async getList (query) {
      try {
        this.customLoading = true;
        let queryWord = query || this.queryWord;
        const params = { ...this.params, ...this.additionalParams, [this.searchKey]: queryWord };
        const data = await this.service(params);
        this.options = [...this.options, ...data.records];
        this.total = data.total;
        // 当第一页数据加载完成后
        // const isValueInOptions = this.options.some(option => option[this.valueField] === this.customValue);
        // if (!isValueInOptions && this.defaultValue) {
        //   // this.customValue = this.defaultValue;
        // }
      } catch (error) {
        this.$message.error(error.message || '加载失败');
      } finally {
        this.customLoading = false;
      }
    },
    handleRemoteSearch (query) {
      // 如果用户在多选，就不触发搜索
      if (this.isUserSelected) {
        this.isUserSelected = false; // 重置标记
        return;
      }
      // 其他逻辑保持不变
      this.options = [];
      this.queryWord = query;
      this.params.pageNo = 1;
      this.getList(this.queryWord);
    },
    handleScrollToEnd () {
      if (!this.customLoading && this.options.length < this.total) {
        this.params.pageNo++;
        this.getList(this.queryWord);
      }
    }
  }
};
</script>
<style lang="scss">
.selectLoad:after {
  position: relative;
  z-index: 1000;
  content: '加载中...';
  display: inline-block;
  text-align: center;
  color: #979797;
  width: 100%;
  line-height: 30px;
  overflow: hidden;
  font-size: 13px;
}
.noData:after {
  position: relative;
  z-index: 1000;
  content: '已经到底了';
  color: #979797;
  display: inline-block;
  text-align: center;
  width: 100%;
  line-height: 30px;
  overflow: hidden;
  font-size: 13px;
}
</style>
