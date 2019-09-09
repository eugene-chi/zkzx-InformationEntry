<style lang="less">
    @import '../../styles/common.less';
    @import 'less/page1.1.less';
    @import '../my-components/markdown-editor/markdown-editor.less';

</style>

<template>
    <div class="jinjian-page">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-position="top">
            <Card>
                <p slot="title">
                    公司简介
                </p>
                <Row class="my-row" :gutter="16" type="flex" align="middle">
                    <Col span="12">
                        <FormItem label="测试文字" prop="test1">
                            <Input v-model="formValidate.test1" placeholder=""></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <div class="markdown-con">
                        <Card>
                            <textarea  id="iview_admin_markdown_editor" style="display:none;"></textarea>
                        </Card>
                    </div>
                </Row>
                
            </Card>
        </Form>
        <Button class="margin-top-10" type="primary" @click="submit('formValidate')">保存</Button>

    </div>
</template>

<script>
  import {baseURL, codeTable} from '../../config/index.js';
  import SimpleMDE from 'simplemde';
  import '../my-components/markdown-editor/simplemde.min.css';
  
  export default {
    data() {
      return {
        onlineServiceList: codeTable.onlineServiceList,
        statusList: codeTable.statusList,
        formValidate: {
          test1: '',
        
        },
        ruleValidate: {
          test1: [
            {required: false, message: '不能为空', trigger: 'blur'}
          ],
          
        }
      };
    },
    mounted () {
      new SimpleMDE({
        element: document.getElementById('iview_admin_markdown_editor'),
        toolbar: ['bold', 'italic', 'strikethrough', 'heading', 'heading-smaller', 'heading-bigger', 'heading-1', 'heading-2', 'heading-3', '|', 'code', 'quote', 'unordered-list', 'clean-block', '|', 'link', 'image', 'table', 'horizontal-rule', '|', 'preview', 'guide']
      });
    },
    methods: {
      //保存信息
      submit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            // this.$Message.success('Success!');
            this.$http.post(
              baseURL.serviceName.test1 + '/test1',
              {
                test1: this.formValidate.test1,
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

  };
</script>
