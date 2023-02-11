<template>
  <v-dialog v-model="dialog_adb" max-width="290">
    <v-card>
      <v-card-title style="font-size: medium">请输入课程邀请码</v-card-title>
      <v-card-subtitle>
        <v-text-field
          v-model="c_key"
          style="font-size: small"
          class="mt-5"
          label="key"
          hint="请输入课程邀请码"
        ></v-text-field>
      </v-card-subtitle>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          :loading="loading"
          color="#be8464"
          text
          @click="AddBankByKey()"
        >
          加入
        </v-btn>
        <v-btn
          color="#be8464"
          text
          @click="$emit('update:dialog_adb', false)"
        >
          取消
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
  
  <script>
import { fun_useKey } from "@/api/key";
export default {
  props: ["dialog_adb"],
  data() {
    return {
      loading: false,
      cid: "",
      c_key: "",
    };
  },
  methods: {
    AddBankByKey() {
      let _this = this;
      this.loading = true;
      fun_useKey(this.c_key)
        .then((res) => {
          this.$emit("update:dialog_adb", false);
          _this.loading = false;
          if (res.code > 0) {
            this.$emit("flush");
            this.$toasted.show(res.msg, {
              theme: "outline",
              position: "top-center",
              duration: 2000,
            });
          }
        })
        .catch((err) => {
          _this.loading = false;
        });
    },
  },
};
</script>
  
  <style></style>
  