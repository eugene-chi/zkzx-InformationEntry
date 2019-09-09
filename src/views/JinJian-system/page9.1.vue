<style lang="less">
    @import '../../styles/common.less';
    @import 'less/page1.1.less';
</style>

<template>
    <div class="jinjian-page">
        
        <Card>
            <Form ref="formSearch" :model="formSearch" label-position="top">
                <Row class="my-row" :gutter="16" type="flex" align="middle">
                    <Col span="12">
                        <FormItem label="批次号" prop="batchNo">
                            <Input v-model="formSearch.batchNo"></Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="订单号" prop="orderNo">
                            <Input v-model="formSearch.orderNo"></Input>
                        </FormItem>
                    </Col>
                </Row>
                
                <Row class="my-row" :gutter="16" type="flex" align="bottom">
                    <Col span="12">
                        <FormItem label="商户名" prop="merchName">
                            
                            <Input v-model="formSearch.merchName" placeholder="Enter something..."></Input>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="交易方式" prop="payMethod">
                            <Select v-model="formSearch.payMethod" style="width:200px">
                                <Option v-for="item in payMethodList" :value="item.code" :key="item.code">
                                    {{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="账单日期" prop="billDate">
                            <DatePicker v-model="formSearch.billDate" type="date" placeholder="Select date"
                                        style="width: 120px"></DatePicker>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            
            <Row type="flex" :gutter="16" class="my-row">
                
                <Col span="24">
                    <Button style="float: right" type="primary" @click="showTable(1)">搜索</Button>
                </Col>
            </Row>
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
  import moment from 'moment';
  import {baseURL, codeTable} from '../../config/index.js';
  
  export default {
    data() {
      return {
        page: 1,
        size: 10,
        totalRecord: 0,
        loading: true,
        columns1: [
          {key: 'batchNo', title: '批次号'},
          {key: 'billDate', title: '账单日期'},
          {
            key: 'cdatetime',
            title: '创建日期',
            render: (h, params) => {
              return moment(params.row.cdatetime, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss')
            }
          },
          {key: 'channelTradeNo', title: '通道方交易号'},
          {key: 'channelTradeTime', title: '通道方订单日期'},
          {key: 'merchName', title: '商户名称'},
          {key: 'merchNo', title: '商户号'},
          {
            key: 'orderAmount', title: '订单金额（元）',
            render: (h, params) => {
              return (params.row.orderAmount / 100.0).toFixed(2)
            }
          },
          {key: 'orderNo', title: '订单号'},
          {key: 'orderTime', title: '订单时间'},
          {key: 'outMerchantNo', title: '通道商户号'},
          {key: 'payMethod', title: '支付方式'},
        
        ],//表头
        table1: [],
        payMethodList: codeTable.payMethodList,
        formSearch: {
          batchNo: '',
          orderNo: '',
          billDate: '',
          payMethod: '',
          merchName: '',
        }
      };
    },
    mounted() {
      this.showTable(1);
    },
    methods: {
      getBillDate() {
        if (this.formSearch.billDate != '') {
          return moment(this.formSearch.billDate).format('YYYY-MM-DD');
        } else {
          return '';
        }
      },
      showTable(page) {//加载表格
        
        this.loading = true; // 加载遮罩打开
        this.$http.post(
          baseURL.serviceName.duiZhang + '/recon/mistake/pool/list',
          {
            page: page,
            size: this.size,
            orderNo: this.formSearch.orderNo,
            payMethod: this.formSearch.payMethod,
            merchName: this.formSearch.merchName,
            batchNo: this.formSearch.batchNo,
            billDate: this.getBillDate(),
          })
          .then(res => {
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
        this.showTable(page);
      }
    }
  };
</script>
