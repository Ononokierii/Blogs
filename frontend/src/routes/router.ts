import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/blogs",
  },
  {
    path: "/blogs",
    name: "blogs",
    component: () => import("@/views/Blogs.vue"),
  },
  {
    path: "/blogs/:id",
    name: "blogDetail",
    component: () => import("@/views/BlogDetail.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Dashboard/Login.vue"),
  },
  {
    path: "/dashboard",
    name: "dashboard",
    redirect: "/dashboard/blog",
    component: () => import("@/views/Dashboard/Dashboard.vue"),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "/dashboard/category",
        name: "category",
        component: () => import("@/views/Dashboard/Category.vue"),
      },
      {
        path: "/dashboard/blog",
        name: "blog",
        component: () => import("@/views/Dashboard/Blog.vue"),
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/views/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem("token");
    token ? next() : next({ name: "login" });
  } else {
    next();
  }
});

export { router };
