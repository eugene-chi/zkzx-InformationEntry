<style lang="less">
    @import '../../styles/common.less';
    @import 'less/page1.1.less';
</style>

<template>
    <div class="jinjian-page">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-position="top">
            <Card>
                <p slot="title">新增商户支付产品</p>
                <Row class="my-row" :gutter="16" type="flex" align="middle">
                    <Col span="6">
                    <FormItem label="支付渠道ID" prop="payChannelId">
                        <Select v-model="formValidate.payChannelId">
                            <Option v-for="item in paychannelsList"
                                    :value="item.id" :key="item.id">
                                {{ item.fullName }}
                            </Option>
                        </Select>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem label="商户ID" prop="merchantId">
                        <Select v-model="formValidate.merchantId">
                            <Option v-for="item in merchantsList"
                                    :value="item.id" :key="item.id">
                                {{ item.fullName }}
                            </Option>
                        </Select>
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem label="支付方式" prop="payMethod">
                        <Select v-model="formValidate.payMethod">
                            <Option v-for="item in payMethodList"
                                    :value="item.val" :key="item.val">
                                {{ item.label }}
                            </Option>
                        </Select>
                    </FormItem>
                    </Col>
                </Row>
                <Row class="my-row" :gutter="16" type="flex" align="middle">
                    <Col span="12">
                    <FormItem label="上游支付通道分配的商户号" prop="outMerchNo">
                        <Input v-model="formValidate.outMerchNo"></Input>
                    </FormItem>
                    </Col>
                    <Col span="12">
                    <FormItem label="支付产品名称" prop="name">
                        <Input v-model="formValidate.name"></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row class="my-row" :gutter="16" type="flex" align="middle">
                    <Col span="12">
                    <FormItem label="上游支付通道分配的支付秘钥" prop="secretKey">
                        <Input v-model="formValidate.secretKey"></Input>
                    </FormItem>
                    </Col>
                </Row>

            </Card>
        </Form>
        <Button class="margin-top-10" type="primary" @click="submit('formValidate')">保存</Button>
    </div>
</template>

<script>
  import {baseURL,codeTable} from '../../config/index.js';

  export default {
    data() {
      return {
        paychannelsList: codeTable.paychannelsList,
        merchantsList: codeTable.merchantsList,
        payMethodList: codeTable.payMethodList,
        formValidate: {
          payChannelId: '',
          merchantId: '',
          payMethod: '',
          outMerchNo: '',
          secretKey: '',
          name: '',
        },
        ruleValidate: {
          payChannelId: [{required: true, message: '不能为空', trigger: 'change'}],
          merchantId: [{required: true, message: '不能为空', trigger: 'change'}],
          payMethod: [{required: true, message: '不能为空', trigger: 'change'}],
          outMerchNo: [{required: true, message: '不能为空', trigger: 'blur'}],
          secretKey: [{required: false, message: '不能为空', trigger: 'blur'}],
          name: [{required: false, message: '不能为空', trigger: 'blur'}],
        }
      };
    },
    methods: {
      //获取商户列表
      getMerchants() {
        this.$http.get(
          baseURL.serviceName.jinJian +'/merchants',
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
      //获取支付渠道列表
      getPayChannels() {
        this.$http.get(
          baseURL.serviceName.jinJian +'/paychannels',
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
              this.paychannelsList = []; // 清空表格
              if (res.data.payload.totalRecord > 0) {
                res.data.payload.items.forEach((item, i) => {
                  this.paychannelsList.push(item);
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
      //保存信息
      submit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Message.success('Success!');
            this.$http.post(
              baseURL.serviceName.jinJian +'/payProduct',
              {
                name: this.formValidate.name,
                payChannelId: this.formValidate.payChannelId,
                merchantId: this.formValidate.merchantId,
                payMethod: this.formValidate.payMethod,
                outMerchNo: this.formValidate.outMerchNo,
                secretKey: this.formValidate.secretKey,
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
      this.getPayChannels();
      this.getMerchants();
    }
  };
</script>
