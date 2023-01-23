<template>
  <v-card
    max-width="400"
    min-width="100"
    max-height="400px"
    :hover="hover"
    ripple
  >
    <v-card-title class="d-flex justify-space-between align-center">
      {{ Course.cname }}
      <div class="subtitle-2 d-flex align-center">
        <v-icon
          large
          :color="
            Course.status == 0
              ? 'warn'
              : Course.status == 1
              ? 'success'
              : 'grey'
          "
          >mdi-circle-small</v-icon
        >
        <div>
          <span class="subtitle-2 text--secondary">
            {{
              Course.status == 0
                ? "未开始"
                : Course.status == 1
                ? "进行中"
                : "已结束"
            }}
          </span>
        </div>
      </div>
      <div></div>
      <div>
        <!-- <v-icon color="brown" x-large>mdi-star</v-icon> -->
        <v-avatar>
          <v-img :src="Course.banner"></v-img>
        </v-avatar>
      </div>
    </v-card-title>

    <v-card-subtitle class="pb-0" v-text="Course.tname"></v-card-subtitle>

    <v-card-text style="font-size: small">
      <div class="text--secondary">{{ Course.college }}</div>

      <div>{{ Course.time }}</div>
    </v-card-text>

    <v-card-actions>
      <v-btn color="orange" text @click="InterCourse(Course.cid)">
        进入课程
      </v-btn>
      <v-btn color="orange" text> 查看统计 </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="grey" text @click="exitCourse()"> 退出课程 </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { fun_leave } from "@/api/course";
export default {
  props: ["Course"],
  data: () => ({
    hover: true,
  }),
  methods: {
    InterCourse(cid) {
      this.$router.push({ name: "CourseContent", params: { cid: cid } });
    },
    exitCourse(cid) {},
  },
};
</script>

<style scoped></style>
