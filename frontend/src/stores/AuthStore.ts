import { defineStore } from "pinia";
import { LoginInfo } from "../types";
import { router } from "../routes/router";

export const AuthStore = defineStore("auth", {
  state: (): LoginInfo => ({
    token: localStorage.getItem("token") || "",
    username: localStorage.getItem("username") || "",
    password: localStorage.getItem("password") || "",
    remember: localStorage.getItem("remember") === "true",
  }),
  getters: {},
  actions: {
    login(loginInfo: Partial<LoginInfo>) {
      this.token = loginInfo.token ?? "";
      this.username = loginInfo.username ?? "";
      this.password = loginInfo.password ?? "";
      this.remember = loginInfo.remember ?? false;
      localStorage.setItem("token", loginInfo.token ?? "");
      localStorage.setItem("username", loginInfo.username ?? "");
      localStorage.setItem("password", loginInfo.password ?? "");
      localStorage.setItem("remember", String(loginInfo.remember));
    },
    logout() {
      this.token = "";
      localStorage.removeItem("token");
      router.push("/login");
    },
  },
});
