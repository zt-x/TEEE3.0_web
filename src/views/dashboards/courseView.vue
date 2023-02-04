<template>
  <div class="px-4">
    <create-course-dialog :showDialog.sync="dialog.createCourse" />
    <add-course-dialog :dialog_stu.sync="dialog.addCourse" />
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
    <v-container fluid>
      <v-row>
        <v-col cols="12" lg="8">
          <v-sheet class="py-6 px-10 transparent">
            <div class="text-h3 text--secondary">Courses</div>
            <v-row class="pt-5">
              <v-col
                cols="12"
                md="6"
                lg="4"
                v-for="(item, i) in courses"
                :key="i"
              >
                <Course :Course="item" />
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
        </v-col>
        <v-col v-show="!$vuetify.breakpoint.mdAndDown" lg="4">
          <v-sheet class="py-6 px-10 transparent">
            <div class="text-h3 text--secondary">
              <span class="text-h6">Course Tools</span>
            </div>
            <div class="pt-5">
              <v-card class="px-5 py-5">
                <v-row class="text-center px-8">
                  <v-col cols="3">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          fab
                          dark
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
                  </v-col>
                  <v-col cols="3">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          fab
                          dark
                          v-bind="attrs"
                          v-on="on"
                          color="primary"
                        >
                          <v-icon>mdi-magnify</v-icon>
                        </v-btn>
                      </template>
                      <span>查找课程</span>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="3">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
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
                  </v-col>
                  <v-col cols="3">
                    <v-btn fab dark color="brown">3</v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </div>
          </v-sheet>
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
  }),
  methods: {
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

      fun_getMyCourse(page)
        .then((res) => {
          if (res.code != 101 && res.code > 0) {
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
          this.$toasted.error(err, {
            theme: "outline",
            position: "top-center",
            duration: 2000,
          });
        });
    },
  },
  mounted() {
    let _this = this;
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
