<template>
  <v-container fluid>
    <v-row>
      <!-- 左侧栏 -->
      <v-col cols="12" lg="3">
        <v-card style="height: 90vh" class="px-10 py-10">
          <v-card-title class="text-h4"> Hi, ceshi </v-card-title>
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
                    当前使用版本为<strong>3.0.1 -寒假特供测试版</strong>,
                    若您在使用过程中发现BUG, emm, 我晚点再修。
                  </v-alert>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" lg="6">
                <v-card hover style="height: 30vh" class="px-6 py-6">
                  <div style="height: 15%">
                    <div class="subtitle-2">TODO</div>
                    <div class="text-h6">待完成的作业</div>
                  </div>
                  <div style="padding-top: 5px; height: 85%; overflow: auto">
                    <v-progress-linear
                      color="cyan"
                      v-if="!finishGet.todolist"
                      indeterminate
                    ></v-progress-linear>
                    <v-simple-table  v-if="finishGet.todolist">
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th class="text-left">课程</th>
                            <th class="text-left">作业标题</th>
                          </tr>
                        </thead>

                        <tbody v-if="finishGet.todolist">
                          <tr
                            v-for="item in todolist"
                            :key="item.cid"
                            @click="jump(item.cid)"
                          >
                            <td>
                              <div class="d-flex align-center">
                                <v-avatar size="24">
                                  <v-img :src="item.avatar" alt="avatar" />
                                </v-avatar>

                                <div class="ml-1 subtitle-2">
                                  {{ item.cname }}
                                </div>
                              </div>
                            </td>
                            <td>{{ item.count }}</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
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
                    <div class="subtitle-2">PERFORMANCE</div>

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
                  <div style="height: 15%">
                    <div class="subtitle-2">PERFORMANCE</div>

                    <div class="text-h6">作业库被引用次数统计</div>
                  </div>
                  <apexchart
                    v-if="finishGet.bankSummary"
                    width="100%"
                    height="85%"
                    class="mt-4"
                    type="bar"
                    :options="optionsBar"
                    :series="series2"
                  ></apexchart>
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
import { fun_getTodoList, fun_getBankSummary } from "@/api/quickStart";
export default {
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
    optionsBar: {
      theme: {
        mode: "light",
        palette: "palette2",
      },

      stroke: {
        curve: "smooth",
      },
      chart: {
        id: "vuechart-bar",
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
        labels: {
          show: false,
        },
      },
    },
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
  computed: {},
  methods: {
    jump(cid) {
      this.$router.push({ name: "CourseContent", params: { cid: cid } });
    },
    getTodoList() {
      let _this = this;
      fun_getTodoList()
        .then((res) => {
          _this.todolist = res.data;
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
    getBankSummary() {
      let _this = this;
      _this.optionsBar.xaxis.categories = [];
      _this.series2 = [];
      fun_getBankSummary()
        .then((res) => {
          let arr = res.data;
          let arr2 = [];
          console.log(arr);
          arr.forEach((item) => {
            _this.optionsBar.xaxis.categories.push(item.bwname);
            // _this.optionsBar.xaxis.categories.push('');
            arr2.push(item.usageCount);
          });
          _this.series2.push({ name: "1", data: arr2 });
          _this.finishGet.bankSummary = true;
        })
        .catch((err) => {
          _this.finishGet.bankSummary = true;
        });
    },
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
  