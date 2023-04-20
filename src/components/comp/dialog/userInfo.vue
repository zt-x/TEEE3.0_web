<template>
  <v-dialog persistent v-model="showDialog" width="550px">
    <v-card>
      <v-img class="white--text bgc" height="100px">
        <v-card-title>
          <v-spacer></v-spacer>
          <v-chip
            small
            @click="$emit('update:showDialog', false)"
            color="red"
          ></v-chip>
        </v-card-title>
      </v-img>
      <v-card height="150px" tile>
        <input
          id="fileuploadChangeAvatar"
          style="display: none"
          ref="input_changeAvatar"
          @change="uploadAvatar"
          type="file"
          v-show="false"
        />
        <v-btn
          absolute
          fab
          top
          right
		  @click="$refs.input_changeAvatar.click()"
          style="height: 125px; width: 125px; left: 38.9%; top: -62.5px"
        >
          <v-avatar size="115">
            <v-img :src="user.avatar"></v-img>
          </v-avatar>
        </v-btn>
        <v-card-title class="white--text">.</v-card-title>
        <v-card-text class="pt-5 text-center">
          <strong>
            <v-chip color="grey" outlined style="border-radius: 12px">
              {{ user.role == 0 ? "学生 |" : "教师 |" }}
              {{ " " + user.uname }}</v-chip
            >
            <v-chip
              color="success"
              class="ml-2"
              outlined
              style="border-radius: 12px"
              @click="alert('其实并没有~功能出现BUG, 正在加急修复ing ...')"
            >
              <v-icon left>mdi-check-circle</v-icon>
              已录入人脸信息
            </v-chip>
          </strong>
        </v-card-text>
      </v-card>
    </v-card>
  </v-dialog>
</template>

<script>
import { fun_getUserInfo } from "@/api/account";
import { fun_upload } from "@/api/upload";
import { _alert } from "@/plugins/myfun";
export default {
  props: ["showDialog"],
  data() {
    return {
      user: {
        avatar: "",
        uname: "Nobody",
        role: -1,
      },
    };
  },
  methods: {
    alert(msg) {
      _alert(msg);
    },
    getUserInfo() {
      let _this = this;
		fun_getUserInfo(-1).then((res) => {
			console.log(res.data);
        _this.user = res.data;
      });
    },
    editUserInfo() {},
    uploadAvatar() {
      let file = this.$refs["input_changeAvatar"].files[0];
		fun_upload("/accounts/updateAvatar", file).then((res) => {
			_alert(res);
			this.getUserInfo();
		
      });
    },
  },
  created() {
    this.getUserInfo();
  },
};
</script>

<style scoped>
.bgc {
  background-image: linear-gradient(135deg, #fdfcfb 0%, #e9e6e4 100%);
}
</style>>