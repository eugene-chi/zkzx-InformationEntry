<style lang="less">
    @import '../../styles/common.less';
    @import 'less/page1.1.less';
</style>

<template>
    <div class="jinjian-page">
        
        <Card>
            <Form ref="formSearch" :model="formSearch" label-position="top">
                <Row class="my-row" :gutter="16" type="flex" align="middle">
                    <Col span="6">
                        <FormItem label="批次号" prop="batchNo">
                            <Input v-model="formSearch.batchNo"></Input>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="通道名称" prop="channelName">
                            <Input v-model="formSearch.channelName"></Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="订单号" prop="orderNo">
                            <Input v-model="formSearch.orderNo"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row class="my-row" :gutter="16" type="flex" align="middle">
                    <Col span="12">
                        <FormItem label="交易号" prop="transNo">
                            <Input v-model="formSearch.transNo"></Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="商户名" prop="merchName">
                            <Input v-model="formSearch.merchName"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row class="my-row" :gutter="16" type="flex" align="bottom">
                    <Col span="12">
                        <FormItem label="交易号" prop="transNo">
                            
                            <Input v-model="formSearch.transNo" placeholder="Enter something..."></Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="交易方式" prop="payMethod">
                            <Select v-model="formSearch.payMethod" style="width:200px">
                                <Option v-for="item in payMethodList" :value="item.code" :key="item.code">
                                    {{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="16">
                    <Col span="6">
                        <FormItem label="账单日期" prop="billDate">
                            <DatePicker v-model="formSearch.billDate" type="date" placeholder="Select date"
                                        style="width: 120px"></DatePicker>
                        </FormItem>
                    </Col>
                
                </Row>
            </Form>
            <Row type="flex" :gutter="16" class="my-row">
                <Col span="12">
                    <Button type="primary" icon="ios-cloud-download-outline" @click="downloadExcel()">下载Excel</Button>
                </Col>
                <Col span="12">
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
          {key: 'errType', title: '差错类型'},
          {key: 'handleRemark', title: '差错处理描述'},
          {key: 'handleStatus', title: '是否处理'},
          {key: 'handleWay', title: '处理方式'},
          {key: 'merchName', title: '商户名称'},
          {key: 'merchNo', title: '商户号'},
          {
            key: 'orderAmount', title: '订单金额（元）',
            render: (h, params) => {
              return (params.row.orderAmount / 100.0).toFixed(2)
            }
          },
          {key: 'orderNo', title: '平台订单号'},
          {key: 'orderTime', title: '订单时间'},
          {key: 'outMerchantNo', title: '上游通道商户号'},
          {key: 'channelName', title: '通道名称'},
          {key: 'payMethod', title: '支付方式'},
        ],//表头
        table1: [],
        payMethodList: codeTable.payMethodList,
        formSearch: {
          batchNo: '',
          orderNo: '',
          transNo: '',
          billDate: '',
          payMethod: '',
          merchName: '',
          channelName: '',
        },
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
          baseURL.serviceName.duiZhang + '/recon/mistake/list',
          {
            page: page,
            size: this.size,
            batchNo: this.formSearch.batchNo,
            orderNo: this.formSearch.orderNo,
            transNo: this.formSearch.transNo,
            billDate: this.getBillDate(),
            payMethod: this.formSearch.payMethod,
            merchName: this.formSearch.merchName,
            channelName: this.formSearch.channelName,
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
      },
      //下载
      downloadExcel() {
        let param =
          'batchNo=' + this.formSearch.batchNo + '&' +
          'orderNo=' + this.formSearch.orderNo + '&' +
          'transNo=' + this.formSearch.transNo + '&' +
          'payMethod=' + this.formSearch.payMethod + '&' +
          'merchName=' + this.formSearch.merchName + '&' +
          'channelName=' + this.formSearch.channelName + '&' +
          'billDate=' + this.getBillDate();
        let url = baseURL.duiZhang + baseURL.serviceName.duiZhang + "/recon/mistake/export?";//todo
        window.location.href = url;//todo
      }
    }
  };
</script>
