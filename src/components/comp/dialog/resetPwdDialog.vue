<template>
  <v-dialog persistent v-model="showDialog" width="550px">
    <v-card>
      <v-img class="brown--text bgc" height="80px">
        <v-card-title> 为安全起见, 请您创建一个新的密码哦 </v-card-title>
        <v-card-subtitle>
          For security reasons, please create a new password
        </v-card-subtitle>
      </v-img>
      <v-card height="150px" outlined tile>
        <div style="width: 60%;margin-top:40px" class="mx-auto">
          <v-text-field v-model="newPwd" label="新密码" solo></v-text-field>
        </div>
      </v-card>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn v-if="newPwd != ''" text @click="resetPwd()">确定</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { _alert } from "@/plugins/myfun";
import { fun_resetPwd } from "@/api/account";
let _this = this;
export default {
  props: ["showDialog"],
  data() {
    return {
		newPwd: "",
		loading : true,
    };
	},
	methods: {
		resetPwd() {
			// 验证
			let pwd = this.newPwd.trim();
			if (pwd.length < 5) {
				_alert("太短了😣!密码长度要大于5个字符!");
				return;
			} else if (pwd.length > 20) {
				_alert("太长啦😫!长度要小于20个字符!");
				return;
			} else {
				this.loading = true;
				fun_resetPwd(pwd).then((res) => {
					this.$emit('update:showDialog', false)
					_alert("更新成功!💕");

				})
			}
		}
  }
};
</script>

<style>
.bgc {
  background-image: linear-gradient(135deg, #fdfcfb 0%, #e9e6e4 100%);
}
</style>