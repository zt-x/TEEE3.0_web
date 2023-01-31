<template>
  <v-container fluid>
    <v-dialog persistent v-model="releaseWorkDialog" width="800px">
      <release-work :cid="cid" @close="close($event)" />
    </v-dialog>
    <v-dialog content-class="trans" persistent v-model="releaseAnnDialog" width="800px">
      <Announcement_release @close="close($event)" />
    </v-dialog>

    <v-row>
      <!-- Course WorkPlace -->
      <v-col cols="12" lg="8">
        <v-sheet
          class="py-6 transparent"
          :class="{
            'pl-10': $vuetify.breakpoint.lgAndUp || $vuetify.breakpoint.lgOnly,
            'px-10': !($vuetify.breakpoint.lgAndUp || $vuetify.breakpoint.lgOnly),
          }"
        >
          <div class="text-h3 text--secondary mb-5">Works</div>
          <v-row v-if="isTeacher">
            <v-col cols="12">
              <v-card rounded="true" style="padding: 10px">
                <v-chip label @click="releaseWorkDialog = true" color="success">
                  <v-icon color="white" x-small left>fa fa-paper-plane</v-icon>
                  <span style="color: white">发布新作业 / 考试</span>
                </v-chip>

                <v-chip
                  label
                  @click="releaseAnnDialog = true"
                  color="success"
                  class="ml-5"
                >
                  <v-icon color="white" small left>mdi-clipboard-outline</v-icon>
                  <span style="color: white">发布公告</span>
                </v-chip>
                <v-chip
                  @click="
                    flushContent();
                    getCourseInfo();
                    getCourseStatsitics();
                  "
                  label
                  color="pink"
                  class="ml-5"
                >
                  <v-icon color="white" small left>mdi-refresh</v-icon>
                  <span style="color: white">刷新</span>
                </v-chip>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-card>
                <v-tabs
                  v-model="tab"
                  background-color="transparent"
                  color="basil"
                  :centered="!$vuetify.breakpoint.lgAndUp"
                >
                  <v-tab v-for="item in items" :key="item">
                    {{ item }}
                  </v-tab>
                </v-tabs>
                <v-tabs-items v-model="tab">
                  <v-tab-item :key="items[0]">
                    <v-card color="basil" style="background: #f6f7f8" flat>
                      <WorksView
                        :cid="cid"
                        :works="works"
                        v-if="loading_workview && !isTeacher"
                      />
                      <WorksViewTeacher
                        :cid="cid"
                        :works="works"
                        @flush="flushContent"
                        v-if="loading_workview && isTeacher"
                      />
                      <v-card v-if="!loading_workview">
                        <v-container>
                          <v-row class="text-center">
                            <v-col cols="12">
                              <v-progress-circular
                                indeterminate
                                :size="20"
                                color="primary"
                              ></v-progress-circular>
                              <span class="pl-2">正在获取作业 ...</span>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card>
                    </v-card>
                  </v-tab-item>
                  <!-- 考试模块 -->
                  <v-tab-item>
                    <v-card color="basil" style="background: #f6f7f8" flat>
                      <ExamsView
                        :cid="cid"
                        :exams="exams"
                        v-if="loading_examview && !isTeacher"
                      />
                      <ExamsViewTeacher
                        :cid="cid"
                        :exams="exams"
                        @flush="flushContent"
                        v-if="loading_examview && isTeacher"
                      />
                      <v-card v-if="!loading_examview">
                        <v-container>
                          <v-row class="text-center">
                            <v-col cols="12">
                              <v-progress-circular
                                indeterminate
                                :size="20"
                                color="primary"
                              ></v-progress-circular>
                              <span class="pl-2">正在获取考试 ...</span>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card>
                    </v-card>
                  </v-tab-item>
                  <!-- 公告模块 -->
                  <v-tab-item>
                    <v-card color="basil" style="background: #f6f7f8" flat>
                      <Announcement
                        :announcement="announcement"
                        v-if="loading_announcementview"
                      />
                    </v-card>
                  </v-tab-item>
                  <!-- 成员管理模块 -->
                  <v-tab-item v-if="isTeacher">
                    <v-card>
                      <v-card-title>
                        学生列表
                        <v-spacer></v-spacer>
                        <v-text-field
                          v-model="search_user"
                          append-icon="mdi-magnify"
                          label="Search"
                          single-line
                          hide-details
                        ></v-text-field>
                      </v-card-title>
                      <v-data-table
                        :loading="!finishGetUser"
                        loading-text="正在努力加载课程学生信息 ..."
                        :headers="usertable_headers"
                        :items="userinfos"
                        :search="search_user"
                        :items-per-page="10"
                        :page.sync="pageOfUser"
                        @page-count="pageCount = $event"
                        hide-default-footer
                      >
                        <template v-slot:item.username="{ item }">
                          <v-chip outlined>
                            <v-avatar left size="30">
                              <v-img :src="item.avatar"></v-img>
                            </v-avatar>
                            {{ item.username }}</v-chip
                          >
                        </template>
                        <template v-slot:item.delete="{ item }">
                          <v-chip small @click="removeStu(item.uid)">
                            <v-avatar left>
                              <v-icon small> mdi-exit-to-app </v-icon>
                            </v-avatar>
                            Delete
                          </v-chip>
                        </template>
                      </v-data-table>
                      <div class="text-center pt-2">
                        <v-pagination
                          v-model="pageOfUser"
                          :length="pageCount"
                        ></v-pagination>
                      </div>
                    </v-card>
                    <!-- <v-card
                      v-if="finishGetUser"
                      class="py-5"
                      color="basil"
                      style="background: #f6f7f8"
                      flat
                    >
                      <v-card
                        class="mx-auto"
                        width="95%"
                        rounded="true"
                        style="background: #a36645"
                      >
                        <v-container>
                          <v-row>
                            <v-col cols="4"> </v-col>
                            <v-col cols="4">
                              <div>
                                <v-text-field
                                  append-icon="fas fa-search"
                                  @click:append="searchUser"
                                  @keypress.enter="searchUser"
                                  dense
                                  label="all"
                                  hide-details="auto"
                                  v-model="search_user"
                                  solo
                                ></v-text-field>
                              </div>
                            </v-col>
                            <v-col cols="4">
                              <v-btn dark color="#a36645">
                                <v-icon>fas fa-plus</v-icon>
                                添加用户
                              </v-btn>

                              <v-btn class="ml-3" dark color="#a36645">
                                <v-icon>fas fa-plus</v-icon>
                                批量添加
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card>

                      <v-card
                        class="mx-auto mb-5"
                        width="95%"
                        rounded="false"
                        style="padding: 10px; background: #f6f7f8; overflow-y: auto"
                        v-if="finishGetUser"
                        max-height="500px"
                      >
                        <v-card class="my-1 mx-auto" style="width: 95%">
                          <v-container>
                            <v-row justify="center">
                              <v-col cols="2" class="hideMore"> 姓名 </v-col>
                              <v-col cols="2">学号</v-col>
                              <v-col cols="4">
                                <v-spacer></v-spacer>
                              </v-col>
                              <v-col cols="2"> 完成作业数 </v-col>

                              <v-col cols="2"> 作业平均分 </v-col>
                            </v-row>
                          </v-container>
                        </v-card>
                        <v-card
                          v-for="user in userinfos_show"
                          :key="user.uid"
                          ripple
                          hover
                          class="my-1 mx-auto"
                          style="width: 94%"
                        >
                          <v-container>
                            <v-row>
                              <v-col cols="2" class="hideMore">
                                <v-avatar class="mr-1" size="30px">
                                  <v-img :src="user.avatar"></v-img>
                                </v-avatar>
                                {{ user.username }}
                              </v-col>
                              <v-col cols="2">{{ user.uid }}</v-col>
                              <v-col cols="4">
                                <v-spacer></v-spacer>
                              </v-col>
                              <v-col cols="2">
                                <v-chip small>{{ user.finishWorkNum }}</v-chip>
                              </v-col>
                              <v-col cols="2">
                                <v-chip small>{{
                                  user.workAverageScore.toFixed(1)
                                }}</v-chip>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-card>
                      </v-card>
                    </v-card>
                    <v-card
                      v-if="!finishGetUser"
                      class="py-5"
                      color="basil"
                      style="background: #f6f7f8"
                      flat
                    >
                      <v-container>
                        <v-row class="text-center">
                          <v-col cols="12">
                            <v-progress-circular
                              indeterminate
                              :size="20"
                              color="primary"
                            ></v-progress-circular>
                            <span class="pl-2">正在获取成员信息并统计作业情况 ...</span>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card> -->
                  </v-tab-item>
                </v-tabs-items>
              </v-card>
            </v-col>
          </v-row>
        </v-sheet>
      </v-col>
      <!-- Course Info -->
      <v-col cols="12" lg="4">
        <v-sheet
          class="py-6 transparent"
          :class="{
            'pr-10': $vuetify.breakpoint.lgAndUp || $vuetify.breakpoint.lgOnly,
            'px-10': !($vuetify.breakpoint.lgAndUp || $vuetify.breakpoint.lgOnly),
          }"
        >
          <!-- 课程信息 -->
          <div class="text-h3 text--secondary">_</div>
          <v-card :loading="!finishGetCourseInfo" class="mt-5">
            <v-card-title>{{ CourseInfo.cname }}</v-card-title>
            <v-card-subtitle
              >CourseKey:{{ this.cid }} || {{ CourseInfo.startTime }} -
              {{ CourseInfo.endTime }}</v-card-subtitle
            >
            <v-divider class="mb-5"></v-divider>
            <v-container v-if="finishGetCourseInfo">
              <v-row>
                <v-col cols="12" lg="5">
                  <v-card class="pl-5 pt-6" style="height: 200px" outlined>
                    <span>任课教师：{{ CourseInfo.tname }}</span>
                    <v-divider></v-divider>

                    <span>班级人数: {{ CourseInfo.UserCount }}</span>
                    <v-divider></v-divider>

                    <span
                      >作业次数:
                      {{
                        CourseInfo.WorksCount == null ? 0 : CourseInfo.WorksCount
                      }}</span
                    >
                    <v-divider></v-divider>
                    <span
                      >考试次数:
                      {{
                        CourseInfo.ExamsCount == null ? 0 : CourseInfo.ExamsCount
                      }}</span
                    >
                    <v-divider></v-divider>
                  </v-card>
                </v-col>
                <v-col cols="12" lg="7"> 这里是一个图表 </v-col>
              </v-row>
            </v-container>
          </v-card>
          <v-card class="mt-5">
            <v-card-title>学情分析</v-card-title>
            <v-divider></v-divider>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <!--  -->
                  这是一个图表，用来展示作业完成情况
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-sheet>
      </v-col>
    </v-row>
    <v-overlay v-if="loading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <div class="mx-auto">{{ loadingText }}</div>
    </v-overlay>
  </v-container>
</template>

<script>
import Announcement from "@/components/CourseContentChildren/announcement.vue";
import ExamsView from "@/components/CourseContentChildren/examsView.vue";
import WorksView from "@/components/CourseContentChildren/worksView.vue";
import ReleaseWork from "@/components/CourseContentChildren/work/releaseWork.vue";
import Chart_sex from "@/components/CourseContentChildren/charts/chart_sex.vue";
import Chart_workScroe from "@/components/CourseContentChildren/charts/chart_workScroe.vue";
import WorksViewTeacher from "@/components/CourseContentChildren/worksViewTeacher.vue";
import ExamsViewTeacher from "@/components/CourseContentChildren/examsViewTeacher.vue";
import Announcement_release from "@/components/CourseContentChildren/announcement_release.vue";

import {
  fun_getUsers,
  fun_getWorks,
  fun_getAnnouncement,
  fun_getInfo,
  fun_removeUsers,
} from "@/api/course";

export default {
  components: {
    ExamsView,
    Announcement,
    WorksView,
    ReleaseWork,
    Chart_sex,
    Chart_workScroe,
    WorksViewTeacher,
    ExamsViewTeacher,
    Announcement_release,
  },
  data() {
    return {
      tab: null,
      items: ["作业", "考试", "公告", "成员"],
      usertable_headers: [
        {
          text: "学生姓名",
          align: "start",
          sortable: false,
          value: "username",
        },
        {
          text: "学号",
          align: "start",
          value: "uid",
        },
        {
          text: "作业平均分",
          align: "start",
          value: "workAverageScore",
        },
        {
          text: "完成作业数量",
          align: "start",
          value: "finishWorkNum",
        },
        {
          text: "移除该学生",
          value: "delete",
        },
      ],
      userinfos: [],
      pageOfUser: 1,
      pageCount: 0,
      cid: 0,
      loading_workview: false,
      loading_examview: false,
      loading_announcementview: false,
      works: [],
      exams: [],
      announcement: [],
      isTeacher: false,
      releaseWorkDialog: false,
      releaseAnnDialog: false,
      loading: false,
      loadingText: "",
      searchIcon: "fa fa-user",
      finishGetUser: false,
      finishGetCourseInfo: true,
      CourseInfo: {},
      search_user: "",
      gotExams: false,
      gotWorkScore: false,
      CourseStatsitics: {},
      submit_totalNum: 0,
      loading_summary: false,
    };
  },
  methods: {
    _alert(msg) {
      this.$toasted.show(msg, {
        theme: "outline",
        position: "top-center",
        duration: 2000,
      });
    },
    async close() {
      this.releaseWorkDialog = false;
      this.releaseAnnDialog = false;
      this.flushContent();
      this.getCourseInfo();
      this.getCourseStatsitics();
    },
    getCourseInfo() {
      let _this = this;
      _this.finishGetCourseInfo = false;
      fun_getInfo(this.cid)
        .then((res) => {
          _this.CourseInfo = JSON.parse(res.data);
          //   _this.CourseInfo = eval(res.data);
          _this.finishGetCourseInfo = true;
        })
        .catch((err) => {
          _this._alert("获取课程INFO失败：" + err);
        });
    },
    getCourseStatsitics() {
      //   let _this = this;
      //   const form = new FormData();
      //   form.append("cid", this.cid);
      //   _axios
      //     .post("/api/Course/getCourseStatistic", form)
      //     .then((res) => {
      //       _this.CourseStatsitics = eval(res.data.data);
      //       _this.gotExams = true;
      //       _this.gotWorkScore = true;
      //     })
      //     .catch((err) => {
      //       _this._alert("获取课程Statistics失败：" + err);
      //     });
    },
    flushContent() {
      let _this = this;
      _this.finishGetUser = false;
      _this.loading_examview = false;
      _this.loading_workview = false;
      //   TODO 刷新时用户列表不会清除
      fun_getUsers(this.cid)
        .then((res) => {
          let arr = eval(res.data);
          arr = arr.sort((a, b) => {
            return Number(b.finishWorkNum) - Number(a.finishWorkNum);
          });
          arr.forEach((element, i) => {
            _this.userinfos[i] = element;
          });
          _this.finishGetUser = true;
          _this.loading = false;
        })
        .catch((err) => {
          _this._alert("出问题咯，获取班级成员异常: " + err);
          _this.loading = false;
          // _this.$router.replace({ path: "/Course" });
        });
      fun_getWorks(this.cid)
        .then((res) => {
          let dt = res.data;
          _this.works = dt.filter((item) => {
            return item.isExam == 0;
          });
          _this.exams = dt.filter((item) => {
            return item.isExam == 1;
          });
          _this.works.sort((a, b) => {
            return b.id - a.id;
          });
          _this.exams.sort((a, b) => {
            return b.id - a.id;
          });

          _this.loading_workview = true;
          _this.loading_examview = true;
          _this.loading = false;
          _this.loading_summary = false;
        })
        .catch((err) => {
          //   _this.$router.replace({ path: "/Course" });
          _this._alert("出问题咯，获取作业异常: " + err);

          _this.loading = false;
        });
      fun_getAnnouncement(this.cid)
        .then((res) => {
          _this.loading_announcementview = true;
        })
        .catch((err) => {
          _this.loading_announcementview = false;
          _this._alert("出问题咯，获取公告异常: " + err);
        });
    },
    removeStu(uid) {
      let _this = this;
      this.$dialog({
        title: "Delete",
        content: "⚠ 删除后学生在班级里的作业记录无法恢复哦！请谨慎操作",
        btns: [
          {
            label: "确定",
            color: "brown",
            callback: () => {
              fun_removeUsers(this.cid, uid).then((res) => {
                _this._alert(res.code);
              });
            },
          },
          {
            label: "算了",
            color: "grey",
            ghost: true,
          },
        ],
      });
    },
  },
  mounted() {
    this.finishGetUser = false;
    this.loadingText = "正在获取作业 ...";
    this.loading = true;
    this.cid = this.$route.params.cid;
    if (this.cid == undefined) {
      this.cid = sessionStorage.getItem("temp_cid");
    } else {
      sessionStorage.setItem("temp_cid", this.cid);
    }
    this.loadingText = "正在准备权限信息 .. ";
    this.flushContent();
    this.getCourseInfo();
    this.getCourseStatsitics();
    this.isTeacher = window.localStorage.getItem("role") >= 1 ? true : false;
    this.items = this.isTeacher
      ? ["作业", "考试", "公告", "成员"]
      : ["作业", "考试", "公告"];
  },
  created() {
    // this.isTeacher
  },
};
</script>

<style>
.hideMore {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
