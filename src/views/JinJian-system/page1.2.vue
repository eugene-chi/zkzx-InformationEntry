<style lang="less">
    @import '../../styles/common.less';
    @import 'less/page1.1.less';
</style>

<template>
    <div class="jinjian-page">

        <Card>
            <p slot="title">
                商户列表（合作医院）
            </p>

            <Table :loading="loading" :columns="columns1" :data="table1"></Table>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :current="page" :total="totalRecord" :page-size="size" @on-change="changePage"></Page>
                </div>
            </div>
        </Card>

    </div>
</template>
<script>
  import {baseURL, codeTable} from '../../config/index.js';

  export default {
    data() {
      return {
        page: 1,
        size: 10,
        totalRecord: 0,
        loading: true,
        columns1: [
          {key: 'name', title: '商户名称（简称）'},
          {key: 'fullName', title: '商户全称'},
          {key: 'linkman', title: '联系人'},
          {key: 'linkphone', title: '联系电话'},
          {key: 'logoUrl', title: 'Logo url'},
          {key: 'apiEntryBaseUrl', title: 'api入口基础url地址'},
          {key: 'onlineService', title: '是否支持线上服务'},
          {key: 'merchantNo', title: '约定的商户编号'},
          {key: 'status', title: '状态'},
          {key: 'cdatetime', title: '创建时间'},
          {
            title: '查看',
            key: 'id',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginLeft: '5px',
                    marginBottom: '2px',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.checkTerminals(params.index);
                    }
                  }
                }, '医院设备列表'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.checkPayProducts(params.index);
                    }
                  }
                }, '支付产品列表')
              ]);
            }
          }

        ],//表头
        table1: [],
      };
    },
    mounted() {
      this.showTable();
    },
    methods: {
      //查看商户设备列表
      checkTerminals(index) {
        let merchantId = this.table1[index].id;
        this.$router.push({name: '2.2', params: {merchantId: merchantId}});
      },
      //查看支付产品列表
      checkPayProducts(index) {
        let merchantId = this.table1[index].id;
        this.$router.push({name: '4.2', params: {merchantId: merchantId}});
      },
      showTable() {//加载表格
        this.loading = true; // 加载遮罩打开
        this.$http.get(
          baseURL.serviceName.jinJian + '/merchants',
          {
            params: {
              page: this.page,
              size: this.size,
            }
          })
          .then(res => {
            console.info(res.data);
            if (0 != res.data.status) {
              // 显示加载数据出现错误
              this.$Message.error(res.data.errMsg)
            } else {
              //成功
              this.table1 = []; // 清空表格
              this.totalRecord = res.data.payload.totalRecord;//总条数，分页用
              if (res.data.payload.totalRecord > 0) {
                res.data.payload.items.forEach((item, i) => {
                  this.table1.push(item);
                })
              }
              this.loading = false; // 加载遮罩关闭
            }
          }).catch(error => {
          if ('undefined' == typeof(error.response)) {
            this.$Message.error(error.message)
          } else {
            this.$Message.error(error.response.data.errMsg)
          }
        })
      },
      changePage(page) {
        this.page = page;
        this.showTable();
      }
    }
  };
</script>
