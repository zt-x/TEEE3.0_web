<template>
  <v-card>
    <v-card-title
      >生成 {{ action_str[action] }}
      <v-spacer></v-spacer>
      <v-chip small @click="close()"></v-chip>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="5" class="pt-0" justify-end>
          <v-checkbox
            v-model="timelimit"
            label="设置有效期"
            color="brown"
            hide-details
          ></v-checkbox>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="keyLimitTime"
            hide-details
            :placeholder="'有效期(单位为' + action == 2 ? '分钟' : '小时' + ')'"
            dense
            outlined
            :disabled="!timelimit"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-btn dark @click="createKey()"> 生成 </v-btn>
        </v-col>
        <v-col cols="12" v-if="showKeyArea">
          <v-progress-circular
            indeterminate
            size="16"
            class="mr-3"
          ></v-progress-circular
          >获取中 ...
        </v-col>
        <v-col cols="12" v-if="finishGetKey">
          {{ action_str[action] }}:
          {{ NewCourseKey }}
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { fun_createKey } from "@/api/key";
import { _alert } from "@/plugins/myfun";
export default {
  props: ["action", "param"],
  data() {
    return {
      action_str: ["课程邀请码", "库分享码", "签到码"],
      shareCourseDialog: false,
      showKeyArea: false,
      finishGetKey: false,
      keyLimitTime: "无限制",
      timelimit: false,
      NewCourseKey: "",
    };
  },
  methods: {
    createKey() {
      if (this.action < 0 || this.action > this.action_str.length - 1) {
        _alert("指令有误 .." + this.action);
        return;
      }
      let _this = this;
      let tim = "-";
      if (!Number.isNaN(this.keyLimitTime) && this.timelimit) {
        tim = this.keyLimitTime * 60 * (this.action != 2 ? 60 : 1);
        if (tim <= 0) {
          this._alert("请输入一个正确的时间!");
          return;
        } else {
        }
      }
      this.showKeyArea = true;
      fun_createKey(this.action, this.param, tim).then((res) => {
        _this.NewCourseKey = res.data;
        _this.finishGetKey = true;
        _this.showKeyArea = false;
        _alert(res.msg);
      });
    },
    close() {
      this.$emit("close", false);
    },
  },
};
</script>

<style></style>
