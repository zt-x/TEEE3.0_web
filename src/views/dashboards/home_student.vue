<template>
  <v-container fluid>
    <v-row>
      <!-- 左侧栏 -->
      <v-col cols="12" lg="3">
        <v-card style="height: 90vh" class="px-10 py-10">
          <v-card-title class="text-h4 text-truncate">
            Hi, {{ welcome_uname }}
          </v-card-title>
          <v-card-subtitle class="text-h5"> 欢迎回来 </v-card-subtitle>
          <v-card-text>
            <vue-typed-js
              :strings="['您可以将鼠标移动至左侧导航栏处, 探索所有功能']"
              :loop="false"
              :startDelay="300"
              :typeSpeed="80"
              :cursorChar="''"
            >
              <span class="typing"></span>
            </vue-typed-js>
            <vue-typed-js
              :strings="['亦或使用右侧的快速开始, 来开启今日的工作~']"
              :loop="false"
              :startDelay="21 * 80 * 2"
              :typeSpeed="100"
            >
              <span class="typing"></span>
            </vue-typed-js>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- 快速开始 -->
      <v-col cols="12" lg="9">
        <v-sheet
          style="height: 90vh"
          :class="{
            'px-10': $vuetify.breakpoint.mdAndUp,
            'py-10': $vuetify.breakpoint.mdAndUp,
          }"
          color="transparent"
        >
          <v-container
            :class="{ 'px-10': $vuetify.breakpoint.mdAndUp }"
            background-color="red"
            fluid
          >
            <v-row>
              <v-col cols="12" class="pb-0 mb-0">
                <div>
                  <span class="text-h6 font-weight-medium">快速开始 </span>
                  <span class="text-overline brown--text"
                    >Start Your Work Now!</span
                  >
                  <v-alert dense text type="warning">
                    <strong> Author: Gentle Xu </strong>    |     
                    BUG 反馈邮箱 zt.x@outlook.be❤️
                  </v-alert>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" lg="6">
                <v-card hover style="height: 30vh" class="px-6 py-6">
                  <div style="height: 20%">
                    <div class="subtitle-2">TODO</div>
                    <div class="text-h6 pb-5">待完成的作业</div>
                  </div>
                  <div style="padding-top: 10px; height: 80%; overflow: auto">
                    <!-- <v-progress-linear
                      color="cyan"
                      v-if="!finishGet.todolist"
                      indeterminate
                    ></v-progress-linear> -->
                    <v-tabs
                      height="0px"
                      v-model="tab"
                      background-color="primary"
                      dark
                    ></v-tabs>
                    <v-tabs-items v-model="tab">
                      <v-tab-item>
                        <v-card
                          style="
                            display: flex;
                            justify-content: center;
                            align-items: center;
                          "
                          height="150px"
                          tile
                        >
                          <div>
                            <v-img
                              width="25px"
                              height="25px"
                              src="loading2.gif"
                            ></v-img>
                          </div>
                          <br />
                          <div>
                            <span class="pl-4"
                              >正在为您整理作业中 请稍等哦 ...</span
                            >
                          </div>
                        </v-card>
                      </v-tab-item>
                      <v-tab-item>
                        <v-card></v-card>
                        <v-simple-table v-if="finishGet.todolist">
                          <template v-slot:default>
                            <thead>
                              <tr>
                                <th class="text-left">课程</th>
                                <th class="text-left">作业</th>
                                <th class="text-left">截止日期</th>
                              </tr>
                            </thead>

                            <tbody v-if="finishGet.todolist">
                              <tr
                                v-for="item in todolist"
                                :key="item.wid"
                                @click="jump(item.cid)"
                              >
                                <td>
                                  <div class="d-flex align-center">
                                    <div class="ml-1 subtitle-2">
                                      {{ item.cname }}
                                    </div>
                                  </div>
                                </td>
                                <td>{{ item.wname }}</td>
                                <td>{{ item.endTime }}</td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </v-tab-item>
                    </v-tabs-items>
                  </div>
                </v-card>
              </v-col>

              <!-- 课表 -->
              <v-col cols="12" lg="6">
                <v-card
                  hover
                  @click="editTimeTable()"
                  style="height: 30vh"
                  class="px-6 py-6"
                >
                  <v-calendar
                    :start="now"
                    type="week"
                    locale="cn"
                    ref="calendar"
                    :first-interval="7.5"
                    :event-color="getEventColor"
                    :interval-count="17"
                    :weekdays="[1, 2, 3, 4, 5, 6, 0]"
                    :events="events"
                  >
                    <template v-slot:day-label-header>
                      <span class="text-overline brown--text"> </span>
                    </template>
                  </v-calendar>
                </v-card>
              </v-col>
            </v-row>

            <v-row>
              <!-- Free Time Line -->
              <v-col cols="12" lg="6">
                <v-card hover style="height: 30vh" class="px-6 py-6">
                  <div style="height: 15%">
                    <div class="subtitle-2">Date</div>
                    <div class="text-h6">日程安排</div>
                  </div>
                  <apexchart
                    v-if="finishGet.freeTime"
                    width="100%"
                    height="85%"
                    class="mt-4"
                    type="area"
                    :options="optionsArea"
                    :series="series"
                    id="vuechart-area"
                  ></apexchart>
                </v-card>
              </v-col>

              <!-- Bank Usage -->
              <v-col cols="12" lg="6">
                <v-card hover style="height: 30vh" class="px-6 py-6">
                  <div style="height: 20%">
                    <div class="subtitle-2">ANNOUNCEMENT</div>
                    <div class="text-h6">我的消息</div>
                  </div>
                  <div style="height: 80%;color:white">
					其实是为了凑四格 ... <br>
					谁能给我点建议啊, 放些啥在这(*/ω＼*)
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { _alert } from "@/plugins/myfun";
import { fun_getTodoList} from "@/api/quickStart";
export default {
  computed: {
    welcome_uname() {
      return localStorage.getItem("welcome_uname");
    },
    tab() {
      return this.finishGet.todolist ? 1 : 0;
    },
  },
  data: () => ({
    now: "2023-02-15 15:00:00",
    calendar: false,
    todolist: [],
    optionsArea: {
      theme: {
        mode: "light",
        palette: "palette2",
      },
      stroke: {
        curve: "smooth",
      },
      dataLabels: {
        enabled: false,
      },
      chart: {
        id: "vuechart-area",
      },
      xaxis: {
        categories: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      },
    },
    // BankManager
    series: [],
    series2: [],
    desserts: [],
    events: [
      {
        name: "软件项目管理",
        start: "2023-02-14 08:30",
        end: "2023-02-14 10:05",
        myItem: "BX-211",
        type: "course",
      },
      {
        name: "Course2",
        start: "2023-02-14 11:00",
        end: "2023-02-14 12:05",
        myItem: "BX-211",
        type: "course",
      },
      {
        name: "改个BUG",
        start: "2023-02-15 09:30",
        end: "2023-02-15 12:00",
        myItem: "BX-211",
        type: "personal",
      },
      {
        name: "软件测试",
        start: "2023-02-16 13:30",
        end: "2023-02-16 15:05",
        myItem: "BX-211",
        type: "course",
      },
      {
        name: "软件建模",
        start: "2023-02-17 08:30",
        end: "2023-02-17 15:05",
        myItem: "BX-211",
        type: "course",
      },
      {
        name: "睡觉觉",
        start: "2023-02-18 08:30",
        end: "2023-02-18 18:05",
        myItem: "BX-211",
        type: "personal",
      },
    ],
    finishGet: {
      todolist: false,
      courseTable: false,
      freeTime: false,
      bankSummary: false,
    },
  }),
  mounted() {
    this.getFreeTime();
    this.getTodoList();
    this.getBankSummary();
  },
  methods: {
    jump(cid) {
      this.$router.push({ name: "CourseContent", params: { cid: cid } });
    },
    getTodoList() {
      let _this = this;
      fun_getTodoList()
        .then((res) => {
          _this.todolist = res.data;
          _this.todolist.sort((a, b) => {
            return new Date(a.endTime) - new Date(b.endTime) ;
          });
          console.log(_this.todolist);
          _this.finishGet.todolist = true;
        })
        .catch((err) => {
          _this.finishGet.todolist = true;
        });
    },
    getCourseTable() {
      // TODO 待接入API
    },
    getFreeTime() {
      this.series = [];
      //   计算课程时间
      let courseArr = this.events.filter((item) => {
        return item.type == "course";
      });
      let personalArr = this.events.filter((item) => {
        return item.type == "personal";
      });
      let courseTimeSummary = [0, 0, 0, 0, 0, 0, 0];
      let personalTimeSummary = [0, 0, 0, 0, 0, 0, 0];
      courseArr.forEach((item) => {
        let start_time = new Date(item.start);
        let end_time = new Date(item.end);
        let now_time = new Date();
        if (
          !(
            start_time - now_time > 0 && start_time.getDay() < now_time.getDay()
          )
        ) {
          let diff = Math.abs(start_time - end_time) / 1000 / 60 / 60;
          if (diff >= 24) {
            diff = 24;
          }
          courseTimeSummary[start_time.getDay() - 1] += diff.toFixed(1);
        }
      });
      personalArr.forEach((item) => {
        let start_time = new Date(item.start);
        let end_time = new Date(item.end);
        let now_time = new Date();

        if (
          !(
            start_time - now_time > 0 && start_time.getDay() < now_time.getDay()
          )
        ) {
          let diff = Math.abs(start_time - end_time) / 1000 / 60 / 60;
          if (diff >= 24) {
            diff = 24;
          }
          personalTimeSummary[start_time.getDay() - 1] += diff.toFixed(1);
        }
      });
      this.series.push({ name: "课程", data: courseTimeSummary });
      this.series.push({ name: "个人安排", data: personalTimeSummary });
      this.finishGet.freeTime = true;
    },
    getBankSummary() {},
    editTimeTable() {
      _alert("后续版本将支持添加个人事件哦~敬请期待！");
    },
    getEventColor(e) {
      return e.type == "course" ? "#3f51b5" : "#29b6f6";
    },
  },
};
</script>

<style scoped>
.left_bg {
  background-image: linear-gradient(to right, #ffecd2 0%, #fcb69f 100%);
}
</style>
