<style lang="less">
    @import '../../styles/common.less';
    @import 'less/page1.1.less';
</style>

<template>
    <div class="jinjian-page">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-position="top">
            <Card>
                <p slot="title">
                    新增商户终端
                </p>
                <Row class="my-row" :gutter="16" type="flex" align="middle">
                    <Col span="12">
                        <FormItem label="商户ID" prop="merchantId">
                            <Select v-model="formValidate.merchantId" @on-change="getPayProductsList()">
                                <Option v-for="item in merchantsList" :value="item.id" :key="item.id">
                                    {{ item.fullName }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="支付产品ID" prop="payProductId">
                            <Select v-model="formValidate.payProductId">
                                <Option v-for="item in payProductsList" :value="item.id" :key="item.id">
                                    {{ item.name }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row class="my-row" :gutter="16" type="flex" align="middle">
                    <Col span="12">
                        <FormItem label="终端名称" prop="name">
                            <Input v-model="formValidate.name"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row class="my-row" :gutter="16" type="flex" align="middle">
                    <Col span="12">
                        <FormItem label="终端编号" prop="terminalNo">
                            <Input v-model="formValidate.terminalNo"></Input>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="状态" prop="status">
                            <Select v-model="formValidate.status">
                                <Option v-for="item in statusList" :value="item.val" :key="item.val">
                                    {{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>

            </Card>
        </Form>

        <Button class="margin-top-10" type="primary" @click="submit('formValidate')">保存</Button>
    </div>
</template>

<script>
  import {baseURL, codeTable} from '../../config/index.js';

  export default {
    data() {
      return {
        page: 1,
        size: 1000,
        merchantsList: codeTable.merchantsList,
        payProductsList: codeTable.payProductsList,
        statusList: codeTable.statusList,
        formValidate: {
          merchantId: '',   // 商户（医院）id
          payProductId: '', // 支付产品id
          name: '',         // 终端名称
          terminalNo: '',   // 上游支付渠道分配终端编号
          status: '',       // 状态，默认启用
        },
        ruleValidate: {
          merchantId: [
            {required: true, message: '不能为空', trigger: 'change'}
          ],
          payProductId: [
            {required: true, message: '不能为空', trigger: 'change'}
          ],
          name: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          terminalNo: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          status: [
            {required: false, message: '不能为空', trigger: 'change'}
          ]
        }
      };
    },
    methods: {
      //获取商户列表
      getMerchants() {
        this.$http.get(
          baseURL.serviceName.jinJian + '/merchants',
          {
            params: {
              page: 1,
              size: 10000,
            }
          })
          .then(res => {
            console.info(res.data);
            if (0 != res.data.status) {
              // 显示加载数据出现错误
              this.$Message.error(res.data.errMsg)
            } else {
              //成功
              this.merchantsList = []; // 清空列表
              if (res.data.payload.totalRecord > 0) {
                res.data.payload.items.forEach((item, i) => {
                  this.merchantsList.push(item);
                });
              }
            }
          }).catch(error => {
          if ('undefined' == typeof(error.response)) {
            this.$Message.error(error.message)
          } else {
            this.$Message.error(error.response.data.errMsg)
          }
        })
      },
      //获取产品id
      getPayProductsList() {//加载表格
        this.$http.get(
          baseURL.serviceName.jinJian +'/payProducts',
          {
            params: {
              page: this.page,
              size: this.size,
              merchantId: this.formValidate.merchantId,	//String|32max	是	商户Id
              payMethod: '',	//String	否	支付方式
            }
          }).then(res => {
          console.info(res.data);
          if (0 != res.data.status) {
            // 显示加载数据出现错误
            this.$Message.error(res.data.errMsg);
          } else {
            //成功
            this.payProductsList = []; // 清空列表
            if (res.data.payload.totalRecord > 0) {
              res.data.payload.items.forEach((item, i) => {
                this.payProductsList.push(item);
              });
            }
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
      //保存信息
      submit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Message.success('Success!');
            this.$http.post(
              baseURL.serviceName.jinJian +'/terminal',
              {
                merchantId: this.formValidate.merchantId,
                payProductId: this.formValidate.payProductId,
                name: this.formValidate.name,
                terminalNo: this.formValidate.terminalNo,
                status: this.formValidate.status,
              }
            ).then((res) => {
              console.log(res.data.status + ':' + res.data.errMsg);
              if (0 != res.data.status) {
                this.$Message.error('信息填写有误');
              } else {
                // 成功
                this.$Message.success('提交成功');
                this.handleReset('formValidate');
              }
            }).catch(error => {
              // 响应错误回调
              if ('undefined' == typeof(error.response)) {
                this.$Message.error(error.message)
              } else {
                this.$Message.error(error.response.data.errMsg)
              }
            });
          } else {
            this.$Message.error('信息填写有误!');
          }
        });
      },
      //清空填写
      handleReset(name) {
        this.$refs[name].resetFields();
      }
    },
    mounted() {
      this.getMerchants();
    },
  };
</script>
