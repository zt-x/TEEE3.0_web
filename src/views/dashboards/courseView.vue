<template>
  <div class="px-4">
    <create-course-dialog
      :showDialog.sync="dialog.createCourse"
      @flush="getCourses(page)"
    />
    <add-course-dialog
      :dialog_stu.sync="dialog.addCourse"
      @flush="getCourses(page)"
    />
    <v-speed-dial
      v-show="$vuetify.breakpoint.mdAndDown"
      v-model="fab"
      fixed
      bottom
      right
      direction="left"
    >
      <template v-slot:activator>
        <v-btn v-model="fab" color="blue darken-2" dark fab>
          <v-icon v-if="fab">mdi-close</v-icon>
          <v-icon v-else>mdi-circle-edit-outline</v-icon>
        </v-btn>
      </template>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            fab
            dark
            small
            v-bind="attrs"
            v-on="on"
            color="green"
            @click.stop="openDialog()"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span v-if="role == 0">加入课程</span>
        <span v-if="role >= 1">创建课程</span>
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn small fab dark v-bind="attrs" v-on="on" color="primary">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </template>
        <span>查找课程</span>
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            small
            fab
            dark
            v-bind="attrs"
            v-on="on"
            color="black"
            @click.stop="getCourses(page)"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </template>
        <span>刷新</span>
      </v-tooltip>
      <v-btn fab dark small color="red">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-speed-dial>
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
    <div style="height: 25px"></div>
    <v-container fluid>
      <v-row>
        <v-col cols="12" lg="8">
          <v-card>
            <v-sheet class="px-10 transparent">
              <div class="pt-5">
                <v-row>
                  <v-col cols="12">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-chip
                          dark
                          v-bind="attrs"
                          v-on="on"
                          color="primary"
                          @click.stop="openDialog()"
                          class="ml-3"
                        >
                          <v-icon small color="white">mdi-plus</v-icon>
                          <span v-if="role == 0">加入课程</span>
                          <span v-if="role >= 1">创建课程</span>
                        </v-chip>
                      </template>
                      <span v-if="role == 0">加入课程</span>
                      <span v-if="role >= 1">创建课程</span>
                    </v-tooltip>

                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-chip
                          dark
                          v-bind="attrs"
                          v-on="on"
                          color="black"
                          class="ml-3"
                          outlined
                          @click.stop="getCourses(page)"
                        >
                          <v-icon small>mdi-refresh</v-icon>
                          <span>刷新</span>
                        </v-chip>
                      </template>
                      <span>刷新</span>
                    </v-tooltip>
                    <v-spacer></v-spacer>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }"> </template>
                      <span>查找课程</span>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </div>
            </v-sheet>
            <v-sheet class="pb-6 px-10 transparent">
              <v-row class="pt-5">
                <v-col
                  cols="12"
                  md="6"
                  xl="4"
                  v-for="(item, i) in courses"
                  :key="i"
                >
                  <Course :Course="item" @remove="getCourses(1)" />
                </v-col>
              </v-row>
              <v-row class="pt-5">
                <v-col>
                  <div class="text-center">
                    <v-pagination
                      @input="getCourses(page)"
                      v-model="page"
                      :length="page_len"
                    ></v-pagination>
                  </div>
                </v-col>
              </v-row>
            </v-sheet>
          </v-card>
        </v-col>

        <v-col v-show="!$vuetify.breakpoint.mdAndDown" lg="4">
          <v-card>
            <v-sheet class="pb-6 px-10 transparent">
              <div class="text-h3 text--secondary">
                <span class="text-h6">TODAY | 今日课表</span>
              </div>
              <v-sheet class="pt-5" height="800">
                <v-calendar
                  ref="calendar"
                  type="day"
                  locale="cn"
                  start="2023-02-11 08:30"
                  :events="events"
                  :first-interval="7.5"
                  :interval-count="17"
                  @click:event="clickTest"
                >
                  <template v-slot:event="{ eventParsed, event }">
                    <div
                      class="brown--text px-5 py-1 bgc"
                      style="height: 100%; border-radius: 8px"
                    >
                      <span class="text-button">{{ event.name }}</span>
                      <span class="pl-5"
                        >{{ eventParsed.start.time }} -
                        {{ eventParsed.end.time }}</span
                      >
                      <br />
                      <span>{{ event.myItem }}</span>
                    </div>
                  </template>
                  <template v-slot:day-label-header>
                    <span class="text-overline brown--text">
                      Stay hungry, Stay foolish.
                    </span>
                  </template>
                </v-calendar>
              </v-sheet>
            </v-sheet>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Course from "@/components/comp/Course.vue";
import TodoList from "@/components/comp/TodoList.vue";
import CourseTable from "@/components/comp/CourseTable.vue";
import _axios from "../../utils/_axios";
import { fun_getMyCourse } from "../../api/course";
import CreateCourseDialog from "../../components/comp/dialog/createCourseDialog.vue";
import AddCourseDialog from "../../components/comp/dialog/addCourseDialog.vue";
export default {
  data: () => ({
    dialog: {
      createCourse: false,
      addCourse: false,
      role: -1,
    },
    courses: [],
    prepareing_overlay: true,
    fab: false,
    page: 1,
    page_len: 0,
    events: [
      {
        name: "软件项目管理",
        start: "2023-02-11 08:30",
        end: "2023-02-11 10:05",
        myItem: "BX-211",
      },
      {
        name: "软件测试",
        start: "2023-02-11 10:25",
        end: "2023-02-11 12:00",
      },
    ],
  }),
  methods: {
    clickTest(d) {
      console.log(d);
    },
    openDialog() {
      if (this.role >= 1) {
        this.dialog.createCourse = true;
      } else {
        this.dialog.addCourse = true;
      }
    },
    getCourses(page) {
      let _this = this;
      this.prepareing_overlay = true;
      this.courses = [];
      fun_getMyCourse(page)
        .then((res) => {
          if (res.code > 0) {
            let coursesData = res.data.courses;
            let coursesData_arr = eval(coursesData);
            _this.courses = coursesData_arr;
            _this.page_len = res.data.pages;
          } else {
            this.$toasted.show(res.msg, {
              theme: "outline",
              position: "top-center",
              duration: 2000,
            });
          }
          _this.prepareing_overlay = false;
        })
        .catch((err) => {
          _this.prepareing_overlay = false;
        });
    },
  },
  mounted() {
    this.getCourses(1);
  },
  created() {
    this.role = window.localStorage.getItem("role");
  },
  components: {
    Course,
    TodoList,
    CourseTable,
    CreateCourseDialog,
    AddCourseDialog,
  },
};
</script>

<style scoped>
.bgc {
  background-image: linear-gradient(135deg, #fdfcfb 0%, #e9e6e4 100%);
}
</style>
