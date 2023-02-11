<template>
  <v-dialog v-model="showDialog" max-width="500" persistent>
    <v-card>
      <v-card-title style="font-size: medium">创建新课程</v-card-title>
      <v-card-subtitle>
        <v-form ref="form" v-model="form_vaild">
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  clearable
                  style="font-size: small"
                  v-model="form_courename"
                  :rules="form_courename_Rules"
                  color="#be8464"
                  label="课程名称"
                  hint="例如: 高等数学-2002班"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  clearable
                  style="font-size: small"
                  color="#be8464"
                  v-model="form_college"
                  label="专业 / 学院"
                ></v-text-field>
              </v-col>
            </v-row>
            <!-- <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  clearable
                  style="font-size: small"
                  v-model="form_banner"
                  color="#be8464"
                  label="课程封面图片URL"
                  hint="可留空。例如: http://xxx.xxx.png"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-img
                  :src="form_banner"
                  style="width: 239px; height: 101px"
                ></v-img>
              </v-col>
            </v-row> -->
            <v-row>
              <v-col cols="12" sm="6">
                <v-menu
                  ref="startMenu"
                  style="font-size: small"
                  v-model="startMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  min-width="290px"
                  offset-y
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="form_startTime"
                      class="mt-3"
                      label="开课时间"
                      dense
                      style="font-size: small"
                      readonly
                      outlined
                      hide-details
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    color="#be8464"
                    locale="zh-cn"
                    :first-day-of-week="0"
                    v-model="form_startTime"
                    scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="startMenu = false"
                      >OK</v-btn
                    >
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" sm="6">
                <v-menu
                  ref="endMenu"
                  v-model="endMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  min-width="290px"
                  offset-y
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="form_endTime"
                      style="font-size: small"
                      class="mt-3"
                      label="结课时间"
                      dense
                      readonly
                      outlined
                      hide-details
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    color="#be8464"
                    locale="zh-cn"
                    :first-day-of-week="0"
                    v-model="form_endTime"
                    scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="endMenu = false"
                      >OK</v-btn
                    >
                  </v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-subtitle>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="#be8464"
          text
          @click="createCourse()"
          :loading="btn_create_loading"
        >
          创建
        </v-btn>
        <v-btn
          color="#be8464 darken-1"
          text
          @click="$emit('update:showDialog', false)"
        >
          取消
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { fun_createCourse } from "@/api/course";
import { _alert } from "@/plugins/myfun";
export default {
  props: ["showDialog"],
  data() {
    return {
      btn_create_loading: false,
      form_vaild: false,
      // form_createCourse
      form_courename: "",
      form_courename_Rules: [(v) => !!v || "必须课程名输入哦"],
      form_college: "",
      form_banner: "",
      form_startTime: "",
      form_endTime: "",
      startMenu: false,
      endMenu: false,
    };
  },
  methods: {
    createCourse() {
      // 验证数据合法性
      if (this.form_courename == "") {
        _alert("必须课程名输入哦");
        return;
      }
      this.btn_create_loading = true;
      fun_createCourse(
        this.form_courename,
        this.form_college,
        this.form_startTime,
        this.form_endTime
      )
        .then((res) => {
          this.btn_create_loading = false;
          if (res.code > 0) {
            this.$toasted.success(res.msg, {
              theme: "outline",
              position: "top-center",
              duration: 2000,
            });
            this.$emit("update:showDialog", false);
            this.$emit("flush");
          }
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
};
</script>

<style></style>
