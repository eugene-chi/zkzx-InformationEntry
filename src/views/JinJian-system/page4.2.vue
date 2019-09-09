<style lang="less">
    @import '../../styles/common.less';
    @import 'less/page1.1.less';
</style>

<template>
    <div class="jinjian-page">

        <Card>
            <p slot="title">商户支付产品列表</p>
            <Form ref="formValidate" label-position="top">
                <Row class="my-row" :gutter="16" type="flex" align="middle">
                    <Col span="12">
                    <FormItem label="支付方式" prop="payMethod">
                        <Select v-model="payMethod" @on-change="showTable()">
                            <Option v-for="item in payMethodList"
                                    :value="item.val" :key="item.val">
                                {{ item.label }}
                            </Option>
                        </Select>
                    </FormItem>
                    </Col>
                </Row>
            </Form>
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
        merchantId: '',
        payMethod: '',
        merchantsList: codeTable.merchantsList,
        payMethodList: codeTable.payMethodList,
        page: 1,
        size: 10,
        totalRecord: 0,
        loading: true,
        columns1: [
          {key: 'name', title: '支付产品名称'},
          {key: 'outMerchNo', title: '上游支付渠道分配的商户编号'},
          {key: 'secretKey', title: '上游支付渠道分配秘钥'},
          {key: 'payMethod', title: '支付方式'},
          {key: 'payChannel', title: '上游支付渠道'},
          {key: 'merchant', title: '商户（合作医院）'},
          {key: 'cdatetime', title: '创建时间'},
//          merchant.merchId
//          payChannel.channelId

        ],//表头
        table1: [],
      };
    },
    mounted() {
      this.haveMerchantId();
    },
    methods: {
      //获取商户列表传来的参商户id
      haveMerchantId() {
        this.merchantId = this.$route.params.merchantId;
        if (this.merchantId == '' || this.merchantId == 'undefined') {
        } else {
          this.showTable();
        }
      },
      showTable() {//加载表格
        this.loading = true; // 加载遮罩打开
        this.$http.get(
          baseURL.serviceName.jinJian +'/payProducts',
          {
            params: {
              page: this.page,
              size: this.size,
              merchantId: this.merchantId,	//String|32max	是	商户Id
              payMethod: this.payMethod,	//String	否	支付方式
            }
          }).then(res => {
          console.info(res.data);
          if (0 != res.data.status) {
            // 显示加载数据出现错误
            this.$Message.error(res.data.errMsg);
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
          this.$Loading.error(); // 显示加载数据出现错误
          if ('undefined' == typeof(error.response)) {
            this.$Message.error(error.message);
          } else {
            this.$Message.error(error.response.data.errMsg);
          }
        })
      },
      changePage(page) {//分页监听
        this.page = page;
        this.showTable();
      }
    }
  };
</script>
