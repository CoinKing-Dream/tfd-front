import Vue from "vue";
import Router from "vue-router";
import Dashboard from "../pages/dashboard/Dashboard";
import Analysis from "../pages/analysis/Analysis";
import Print from "../pages/print/Print";

Vue.use(Router);

export default new Router({
  beforeEnter: (to, from, next) => {
    let access_token = Vue.cookie.get('access_token')
    if (access_token == null) {
      // user doesn't have access token, redirect to login
      next({ name: 'login' })
    }
    else {
      // user has access token, user can open the page
      next()
    }
  },
  routes: [
    {
      path: "/dashboard",
      component: Dashboard
    },
    {
      path: "/analysis",
      component: Analysis
    },
    {
      path: "/print",
      component: Print
    },
    {
      path: "/*",
      component: Dashboard
    }
  ]
});
