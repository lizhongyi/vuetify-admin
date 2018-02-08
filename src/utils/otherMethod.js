const method = function (obj) {
  return {
    users: [{
      name: 'edit',
      icon: 'settings',
      color: 'green',
      action: function (item) {
        console.log(obj)
      }
    }]
  }
}
export default method
