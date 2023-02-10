<template>
  <v-container fluid class="px-4">
    <v-dialog width="650px" v-model="dialog_editWorkBank">
      <BankEdit @close="closeDialog()" :isEdit="true" />
    </v-dialog>
    <v-row justify="center">
      <v-col cols="12">
        <v-sheet class="pt-6 transparent px-10">
          <v-card style="padding: 10px" outlined>
            <v-menu
              close-on-click
              close-on-content-click
              offset-y
              transition="slide-x-transition"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-chip color="#b97a57" v-bind="attrs" v-on="on">
                  <v-icon color="white" x-small left>fa fa-plus</v-icon>
                  <span style="color: white">添加新库</span>
                </v-chip>
              </template>
              <v-list>
                <v-list-item @click="addWorkBank()">
                  <v-list-item-title> ➕ 添加作业库</v-list-item-title>
                </v-list-item>
                <v-list-item @click="addQueBank()">
                  <v-list-item-title> ➕ 添加题库</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-chip class="ml-3" color="#b97a57">
              <v-icon color="white" x-small left>fa fa-search</v-icon>
              <span style="color: white">筛选</span>
            </v-chip>
            <v-chip class="ml-3" color="#b97a57">
              <v-icon color="white" x-small left>fa fa-inbox</v-icon>
              <span style="color: white">导入</span>
            </v-chip>

            <v-chip class="ml-3" @click="getWorkBank()" color="black">
              <v-icon color="white" small left>mdi-refresh</v-icon>
              <span style="color: white">刷新</span>
            </v-chip>
          </v-card>
        </v-sheet>
      </v-col>
      <v-col cols="12" lg="3">
        <v-sheet
          class="pb-6 transparent"
          :class="{
            'pl-10': $vuetify.breakpoint.lgAndUp || $vuetify.breakpoint.lgOnly,
            'px-10': !(
              $vuetify.breakpoint.lgAndUp || $vuetify.breakpoint.lgOnly
            ),
          }"
        >
          <v-card max-height="500px" style="overflow: auto" outlined>
            <v-card-title>我的库</v-card-title>
            <v-card-subtitle>请在"筛选"选项中选择作业库/题库</v-card-subtitle>
            <v-divider></v-divider>
            <v-skeleton-loader
              type="list-item-avatar-two-line"
              class="mx-auto"
              v-if="prepareing_overlay"
            ></v-skeleton-loader>
            <v-card-text v-if="!prepareing_overlay" style="overflow-y: auto">
              <v-list>
                <v-list-item-group color="#b97a57" v-model="item">
                  <v-list-item
                    @click="showBankWork(item.id)"
                    v-for="item in items"
                    :key="item.id"
                    v-ripple="{ class: 'warning--text' }"
                  >
                    <v-list-item-content>
                      <v-list-item-title>
                        <v-chip
                          label
                          style="border-radius: 0"
                          small
                          dark
                          :color="
                            Number(item.isPrivate) == 0 ? '#b97a57' : 'warning'
                          "
                          class="mr-2"
                          >{{
                            Number(item.isPrivate) == 0 ? "公开" : "私有"
                          }}</v-chip
                        >

                        <span style="font-weight: 600"
                          >{{ item.bankName }}
                        </span>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card-text>
          </v-card>
        </v-sheet>
      </v-col>
      <v-col cols="12" lg="9">
        <v-sheet
          class="pb-6 transparent"
          :class="{
            'pr-10': $vuetify.breakpoint.lgAndUp || $vuetify.breakpoint.lgOnly,
            'px-10': !(
              $vuetify.breakpoint.lgAndUp || $vuetify.breakpoint.lgOnly
            ),
          }"
        >
          <v-card max-height="500px" style="overflow: auto" outlined>
            <BankWork :bid="bid" v-if="loadBankWork" />
          </v-card>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import BankWork from "@/components/BankManager/bankWork.vue";
import { fun_getWorkBank } from "@/api/bank";
import { _alert } from "@/plugins/myfun";
import BankEdit from "../../components/BankManager/bankEdit.vue";

export default {
  components: { BankWork, BankEdit },
  mounted() {
    this.getWorkBank();
  },
  data() {
    return {
      prepareing_overlay: true,
      bankType: ["作业库", "题库"],
      item: 0,
      items: [],
      numOfQue: [],
      bid: -1,
      loadBankWork: false,
      dialog_editWorkBank: false,
    };
  },
  methods: {
    addWorkBank() {
      // 初始化空数据
      this.dialog_editWorkBank = true;
    },
    addQueBank() {
      _alert("功能开发中 ...");
    },
    showBankWork(id) {
      let _this = this;
      this.loadBankWork = false;
      this.bid = id;
      this.$nextTick(() => {
        this.loadBankWork = true;
        _this.prepareing_overlay = false;
      });
    },
    getQueBank() {},
    getWorkBank() {
      this.prepareing_overlay = true;
      let _this = this;
      fun_getWorkBank()
        .then((res) => {
          if (Number(res.code) > 0) {
            _this.items = eval(res.data);
            _this.items = _this.items.sort();
            _this.bid = _this.items[0].id;
            _this.numOfQue = _this.items[0];
            _this.loadBankWork = false;
            _this.prepareing_overlay = false;
            _this.showBankWork(_this.bid);
          } else {
            _this.loadBankWork = false;
            _this.prepareing_overlay = false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    closeDialog() {
      this.dialog_editWorkBank = false;
    },
  },
};
</script>

<style scoped></style>
