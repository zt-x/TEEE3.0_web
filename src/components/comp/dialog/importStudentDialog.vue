<template>
  <v-dialog persistent v-model="showDialog" width="550px">
    <v-card>
      <input
        id="fileuploadUploadExcelImportStudent"
        style="display: none"
        ref="input"
        @change="getExcel"
        type="file"
        v-show="false"
      />
      <v-img class="bgc" height="60px">
        <v-card-title>
          导入
          <v-spacer></v-spacer>
          <v-chip small @click="leave" color="red"></v-chip>
        </v-card-title>
      </v-img>
      <v-card tile>
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
              <v-btn class="mr-5" color="primary" @click="$refs.input.click()"
                >上传学生文件</v-btn
              >
              <span style="color: #f6f4f3">|</span>
              <v-btn
                class="ml-5"
                @click="alert('只要表头存在“学号”和“姓名”即可!')"
                >下载模板</v-btn
              >
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card height="550px">
              <v-card-title>请选择学生</v-card-title>
              <v-card-subtitle
                >未注册的学生将同时被注册,初始密码为123456</v-card-subtitle
              >
              <v-card-text>
                <v-data-table
                  height="400px"
                  v-model="selected"
                  :headers="headers"
                  :items="userDatas"
                  item-key="学号"
                  show-select
                  hide-default-footer
                  disable-pagination
                  class="elevation-1"
                  no-data-text="请添加选项，并勾选正确的选项!"
                ></v-data-table>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  v-if="selected.length > 0"
                  color="primary"
                  text
                  @click="submitNewUsers"
                  >添加选中的学生</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card
              height="250px"
              style="
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <div>
                <v-img width="25px" height="25px" src="loading2.gif"></v-img>
              </div>
              <br />
              <div>
                <span class="pl-4"
                  >  正在全速导入中 请稍等哦 {{Math.trunc(time_now/time_prediction *100 )==100?'99':Math.trunc(time_now/time_prediction *100 ) }} % </span
                >
              </div>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-card>
  </v-dialog>
</template>

<script>
import { _alert } from "@/plugins/myfun";
import { fun_addUsersToCourses } from "@/api/course";
import xlsx from "xlsx";
import { readFile } from "@/utils/xlsx";
let _this = this;
export default {
  props: ["showDialog", "cid"],
  computed: {
    tab() {
      return this.file == null || undefined ? 0 : this.loading ? 2 : 1;
    },
  },
  data() {
    return {
      time_now: -1,
      time_prediction: -1,
      userDatas: [],
      file: null,
      selected: [],
      loading: false,
      headers: [
        {
          text: "学号",
          sortable: true,
          value: "学号",
        },
        {
          text: "姓名",
          sortable: true,
          value: "姓名",
        },
      ],
    };
  },
  methods: {
    leave() {
      var obj = document.getElementById("fileuploadUploadExcelImportStudent");
      this.tab = 0;
      this.selected = [];
      this.userDatas = [];
      this.file = null;
      this.time_prediction = -1;
      this.time_now = -1;
      obj.value = "";
      this.$emit("update:showDialog", false);
    },
    getExcel() {
      this.phraseExcel().then(() => {
        this.tab = 1;
      });
    },
    async phraseExcel() {
      this.file = this.$refs["input"].files[0];
      let fileName = this.file.name;
      // 验证文件类型
      var suffix = fileName.substring(fileName.lastIndexOf(".") + 1);
      let excel_suffix = ["xlsx", ".xls"];
      if (excel_suffix.indexOf(suffix) < 0) {
        _alert("不支持的文件格式!");
        return;
      } else {
        console.log(this.file.raw);
        let dataBinary = await readFile(this.file);
        let workBook = xlsx.read(dataBinary, {
          type: "binary",
          cellDates: true,
        });
        let workSheet = workBook.Sheets[workBook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(workSheet);
        this.userDatas = data;
        console.log(this.userDatas); //这里已经能拿到转换后的json
      }
    },
    alert(msg) {
      _alert(msg);
    },
    timeAdd() {
		this.time_now++;
		if (this.time_now >= this.time_prediction) {
			this.time_now = this.time_prediction;
	  }
    },
    submitNewUsers() {
      let timer = "";
      let users = [];
      this.loading = true;
      this.time_prediction = 0;
      this.time_now = 0;
      this.selected.forEach((item) => {
        users.push({ uid: item.学号, uname: item.姓名 });
        this.time_prediction++;
      });
      timer = setInterval(this.timeAdd, 400);
      fun_addUsersToCourses(users, this.cid)
        .then((res) => {
          _alert(res.msg);
          this.loading = false;
          clearInterval(timer);
          this.leave();
        })
        .catch((err) => {
          _alert(err.msg);
          this.loading = false;
          clearInterval(timer);

          this.leave();
        });
    },
  },
};
</script>

<style>
.bgc {
  background-image: linear-gradient(135deg, #fdfcfb 0%, #e9e6e4 100%);
}
</style>