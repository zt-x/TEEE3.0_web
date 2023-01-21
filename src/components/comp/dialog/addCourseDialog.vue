<template>
  <v-dialog v-model="dialog_stu" max-width="290">
    <v-card>
      <v-card-title style="font-size: medium">请输入课程邀请码</v-card-title>
      <v-card-subtitle>
        <v-text-field
          v-model="cid"
          style="font-size: small"
          class="mt-5"
          label="课程ID"
          hint="请输入教师提供的课程ID"
        ></v-text-field>
      </v-card-subtitle>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          :loading="loading"
          color="brown darken-1"
          text
          @click="AddCourse(cid)"
        >
          加入
        </v-btn>
        <v-btn
          color="brown darken-1"
          text
          @click="$emit('update:dialog_stu', false)"
        >
          取消
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { fun_addCourse } from "@/api/course";
export default {
  props: ["dialog_stu"],
  data() {
    return {
      loading: false,
      cid: "",
    };
  },
  methods: {
    AddCourse(CourseKey) {
      let _this = this;
      this.loading = true;
      fun_addCourse(CourseKey)
        .then((res) => {
          this.$emit("update:dialog_stu", false);
          _this.loading = false;
          this.$toasted.show(res.msg, {
            theme: "outline",
            position: "top-center",
            duration: 1500,
          });
        })
        .catch((err) => {
          _this.loading = false;
          this.$toasted.error(err, {
            theme: "outline",
            position: "top-center",
            duration: 1500,
          });
        });
    },
  },
};
</script>

<style>
</style>