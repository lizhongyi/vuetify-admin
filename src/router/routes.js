const routes = [
  {
    path: '/sds',
    name: 'HelloWorld',
    component: resolve => require(['@/components/HelloWorld.vue'], resolve)
  }
]

export default routes
