<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名">
                            <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                            <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <CheckboxGroup>
                                <Checkbox label="管理员登录"></Checkbox>
                                <Checkbox label="企业用户登录"></Checkbox>
                            </CheckboxGroup>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                            <a data-v-2526d47e="" href="#">忘记密码</a>
                        </FormItem>

                    </Form>
                    <p class="login-tip">输入任意用户名和密码即可</p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
  import Cookies from 'js-cookie';

  export default {
    data() {
      return {
        form: {
          userName: '',
          password: ''
        },
        rules: {
          userName: [
            {required: true, message: '账号不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ]
        }
      };
    },
    methods: {
      handleSubmit() {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {

            this.$store.commit(
              'setAvator',
              'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg'
            );
            if (this.form.userName === 'zkzx' && this.form.password === 'zkzx') {
              Cookies.set('user', this.form.userName);
              Cookies.set('password', this.form.password);
              Cookies.set('access', 0);
              this.$router.push({
                name: 'home_index'
              });
            } else {
              this.$Message.error('登录失败');
              this.form.userName = '';
              this.form.password = '';
              Cookies.set('access', 1);
            }

          }
        });
      }
    }
  };
</script>

<style>

</style>
