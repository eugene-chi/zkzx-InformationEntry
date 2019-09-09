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
                        <FormItem label="商户名" prop="merchName">
                            <Input v-model="formSearch.merchName"></Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="终端号" prop="terminalNo">
                            <Input v-model="formSearch.terminalNo"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row class="my-row" :gutter="16" type="flex" align="bottom">
                    <Col span="6">
                        <FormItem label="交易号" prop="transNo">
                            
                            <Input v-model="formSearch.transNo" placeholder="Enter something..."></Input>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="医源通卡号" prop="cardNo">
                            
                            <Input v-model="formSearch.cardNo" placeholder="Enter something..."></Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="自发卡交易类型" prop="cardType">
                            <Select clearable=“true” placeholder="全部" v-model="formSearch.cardType" style="width:200px">
                                <Option v-for="item in cardTypeList" :value="item.code" :key="item.code">
                                    {{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row class="my-row" :gutter="16" type="flex" align="bottom">
                    <Col span="12">
                        <FormItem label="商户编号" prop="merchId">
                            
                            <Input v-model="formSearch.merchId" placeholder="Enter something..."></Input>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="交易类型" prop="transType">
                            <Select clearable=“true” placeholder="全部" v-model="formSearch.transType"
                                    style="width:200px">
                                <Option v-for="item in transTypeList" :value="item.code" :key="item.code">
                                    {{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="数据来源" prop="dataSource">
                            <Select clearable=“true” placeholder="全部" v-model="formSearch.dataSource"
                                    style="width:200px">
                                <Option v-for="item in dataSourceList" :value="item.code" :key="item.code">
                                    {{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="16">
                    <Col span="6">
                        <FormItem label="证件开始日期" prop="beginTime">
                            <DatePicker v-model="formSearch.beginTime" type="datetime" placeholder="Select date"
                                        style="width: 160px"></DatePicker>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="证件结束日期" prop="endTime">
                            <DatePicker v-model="formSearch.endTime" type="datetime" placeholder="Select date"
                                        style="width: 160px"></DatePicker>
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
  //时间格式转化
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
          {
            key: 'amount',
            title: '交易金额（元）',
            render: (h, params) => {
              return h('span', {style: {color: '#1c2438'}}, (params.row.amount / 100.0).toFixed(2));
            }
          },
          {
            key: 'transDTime',
            title: '交易时间',
            render: (h, params) => {
              return h('div', [
                h('p', moment(params.row.transDTime, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD')),
                h('p', moment(params.row.transDTime, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss')),
              ]);
            }
          },
          // {
          //   key: 'cdatetime',
          //   title: '记录创建时间',
          //   render: (h, params) => {
          //     return moment(params.row.cdatetime, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss')
          //     //如果 传入格式是moment（YYYYMMDDHHmmss）则返回new Date（），因此需要再次转换
          //   }
          // },
          {key: 'merchName', title: '商户名称'},
          // {key: 'orderNo', title: '订单号'},
          {key: 'transNo', title: '交易流水号'},
          {key: 'payMethod', title: '支付方式'},
          {key: 'terminalNo', title: '终端号'},
          {key: 'transType', title: '交易类型'},
          {key: 'dataSource', title: '数据来源'},
          {key: 'cardNo', title: '卡号'},
        
        ],//表头
        table1: [],
        formSearch: {
          merchName: '',
          terminalNo: '',
          transNo: '',
          cardNo: '',
          cardType: '',
          beginTime: '',
          endTime: '',
          merchId: '',
          transType: '',
          dataSource: '',
        },
        cardTypeList: codeTable.cardTypeList,
        transTypeList: codeTable.transTypeList,
        dataSourceList: codeTable.dataSourceList,
      };
    },
    mounted() {
      this.showTable(1);
    },
    methods: {
      getBeginTime() {
        if (this.formSearch.beginTime != '') {
          return moment(this.formSearch.beginTime).format('YYYYMMDDHHmmss');
        } else {
          this.formSearch.beginTime = moment({
            hour: 0,
            minute: 0,
            second: 0
          }).subtract('days', 1).format('YYYY-MM-DD HH:mm:ss');
          return moment(this.formSearch.beginTime).format('YYYYMMDDHHmmss');
        }
      },
      getEndTime() {
        if (this.formSearch.endTime != '') {
          return moment(this.formSearch.endTime).format('YYYYMMDDHHmmss');
        } else {
          this.formSearch.endTime = moment({hour: 0, minute: 0, second: 0}).format('YYYY-MM-DD HH:mm:ss');
          return moment(this.formSearch.endTime).format('YYYYMMDDHHmmss');
        }
      },
      showTable(page) {//加载表格
        this.loading = true; // 加载遮罩打开
        this.$http.post(
          baseURL.serviceName.duiZhang + '/card/trans/list',
          {
            page: page,
            size: this.size,
            merchName: this.formSearch.merchName,
            terminalNo: this.formSearch.terminalNo,
            transNo: this.formSearch.transNo,
            cardNo: this.formSearch.cardNo,
            cardType: this.formSearch.cardType,
            beginTime: this.getBeginTime(),
            endTime: this.getEndTime(),
            merchId: this.formSearch.merchId,
            transType: this.formSearch.transType,
            dataSource: this.formSearch.dataSource,
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
          'merchName=' + this.formSearch.merchName + '&' +
          'terminalNo=' + this.formSearch.terminalNo + '&' +
          'transNo=' + this.formSearch.transNo + '&' +
          'cardNo=' + this.formSearch.cardNo + '&' +
          'cardType=' + this.formSearch.cardType + '&' +
          'merchId=' + this.formSearch.merchId + '&' +
          'transType=' + this.formSearch.transType + '&' +
          'dataSource=' + this.formSearch.dataSource + '&' +
          'beginTime=' + this.getBeginTime() + '&' +
          'endTime=' + this.getEndTime();
        let url = baseURL.duiZhang + baseURL.serviceName.duiZhang + "/card/trans/export?" + param;//todo
        window.location.href = url;//todo
      }
    }
  };
</script>
