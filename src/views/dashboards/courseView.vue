<template>
  <v-container fluid>
    <v-overlay :value="prepareing_overlay">
      <v-chip>
        <v-progress-circular
          indeterminate
          size="16"
          class="mr-3"
        ></v-progress-circular>
        <v-spacer></v-spacer>
        <span>正在准备内容 ...</span>
      </v-chip>
    </v-overlay>
    <v-row style="min-width: 980px">
      <v-col cols="12" sm="12">
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-alert
                color="brown"
                colored-border
                elevation="1"
                dismissible
                class="grey--text pl-5"
                outlined
              >
                <b> 点击进入课程按钮，查看课程内容 </b>
              </v-alert>
              <v-row>
                <v-col
                  v-for="(course, i) in courses"
                  v-bind:key="i"
                  cols="12"
                  sm="4"
                >
                  <Course :Course="course"></Course>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" sm="0">
        <!-- <CourseTable style="min-width: 400px" /> -->
        <!-- <div style="height: 20px"></div> -->
        <!-- <TodoList style="min-width: 400px" /> -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Course from "@/components/comp/Course.vue";
import TodoList from "@/components/comp/TodoList.vue";
import CourseTable from "@/components/comp/CourseTable.vue";
import _axios from "../../utils/_axios";
import { fun_getMyCourse } from "../../api/course";
export default {
  data: () => ({
    courses: [],
    prepareing_overlay: true,
  }),
  methods: {},
  mounted() {
    let _this = this;
    // getCourses
    fun_getMyCourse().then((res) => {
      console.log(res);
      if (res.code != 101) {
        let coursesData = res.data;
        let coursesData_arr = eval(coursesData);
        _this.courses = coursesData_arr;
      }
      _this.prepareing_overlay = false;
    });
  },
  created() {},
  components: { Course, TodoList, CourseTable },
};
</script>

<style scoped>
.course_img {
  display: flex;
  justify-content: center;
  align-items: center;
}
.foot {
  height: 50px;
}
</style>
