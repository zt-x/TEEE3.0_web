<template>
  <v-card
    style="border: solid #f4f2f1"
    hover
    max-width="400"
    min-width="200px"
    max-height="400px"
    @click="InterCourse(Course.cid)"
    ripple
  >
    <v-card-title class="d-flex justify-space-between align-center">
      <span
        class="text-h5 d-inline-block text-truncate"
        style="max-width: 150px"
      >
        {{ Course.cname ? Course.cname : "" }}
      </span>

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
        <v-avatar>
          <v-img :src="Course.banner"></v-img>
        </v-avatar>
      </div>
    </v-card-title>

    <v-card-subtitle
      class="pb-0 text-overline"
      v-text="Course.classname ? Course.classname : '公共'"
    ></v-card-subtitle>
    <v-card-subtitle
      class="pb-0 text-overline"
      v-text="Course.tname"
    ></v-card-subtitle>

    <v-card-text style="font-size: small" class="text-overline">
      <div>{{ Course.time }}</div>
    </v-card-text>

    <v-card-actions class="text-overline">
      <v-btn color="#b27654" text @click="InterCourse(Course.cid)">
        进入课程
      </v-btn>
      <v-btn color="#b27654" text> 查看统计 </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="grey" text @click="before_exitCourse(Course.cid)">
        {{ role < 1 ? "退出课程" : "删除课程" }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { fun_leave, fun_delCourse } from "@/api/course";
import { _alert } from "@/plugins/myfun";
export default {
  props: ["Course"],
  data: () => ({
    role: -1,
    block: false,
  }),
  created() {
    this.role = window.localStorage.getItem("role");
  },
  methods: {
    InterCourse(cid) {
      if (!this.block) {
		  this.$router.push({ name: "CourseContent", params: { cid: cid } });
		  this.block = !this.block;
      }
    },
    exitCourse(cid) {
      if (this.role < 1) {
        fun_leave(cid).then((res) => {
          this.$emit("remove");

          _alert(res.msg);
          this.block = false;
        });
      } else {
        fun_delCourse(cid).then((res) => {
          this.$emit("remove");
          _alert(res.msg);
          this.block = false;
        });
      }
	  },
	  before_exitCourse(cid) {
		this.block = true;
		this.$dialog({
        title:  this.role < 1 ? "退出课程" : "删除课程",
        content: "🚨确定要继续嘛？ 该操作无法直接恢复哦",
        btns: [
          {
            label: "确定",
            color: "#be8464",
            callback: () => {
				this.exitCourse(cid);
            },
          },
          {
            label: "算了",
            color: "grey",
            ghost: true,
          },
        ],
      });
    
	}
  },
};
</script>

<style scoped>
.bgc {
  background-image: linear-gradient(135deg, #fdfcfb 0%, #e9e6e4 100%);
}
</style>
